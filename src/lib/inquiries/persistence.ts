import type { Inquiry } from "@/lib/inquiries/schema";

type CreateInquiryResult =
  | { created: true; id: string }
  | { created: false; reason: "rate_limited"; retryAfterSeconds: number }
  | { created: false; reason: "not_configured" | "database_error" };

interface SupabaseConfig {
  url: string;
  secretKey: string;
  hashSecret: string;
}

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const hashSecret = process.env.INQUIRY_HASH_SECRET;
  if (!url || !secretKey || !hashSecret) return null;

  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }

  return { url, secretKey, hashSecret };
}

function requestHeaders(secretKey: string) {
  return {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
    "User-Agent": "Northline-Website/1.0",
  };
}

async function hashIdentifier(identifier: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(identifier));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createInquiry(inquiry: Inquiry, clientIdentifier: string): Promise<CreateInquiryResult> {
  const config = getSupabaseConfig();
  if (!config) return { created: false, reason: "not_configured" };

  try {
    const response = await fetch(`${config.url}/rest/v1/rpc/create_inquiry`, {
      method: "POST",
      headers: requestHeaders(config.secretKey),
      body: JSON.stringify({
        p_form_type: inquiry.formType,
        p_name: inquiry.name,
        p_email: inquiry.email,
        p_phone: inquiry.phone || "",
        p_company: inquiry.company || "",
        p_project_type: inquiry.projectType || "",
        p_budget: inquiry.budget || "",
        p_location: inquiry.location || "",
        p_timeline: inquiry.timeline || "",
        p_message: inquiry.message,
        p_client_hash: await hashIdentifier(clientIdentifier, config.hashSecret),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    const payload = await response.json().catch(() => null) as Array<{
      result?: unknown;
      inquiry_id?: unknown;
      retry_after_seconds?: unknown;
    }> | null;
    const row = payload?.[0];

    if (!response.ok || !row) {
      console.error("Supabase rejected inquiry persistence.", { status: response.status });
      return { created: false, reason: "database_error" };
    }

    if (row.result === "rate_limited") {
      const retryAfterSeconds = Number(row.retry_after_seconds);
      return {
        created: false,
        reason: "rate_limited",
        retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : 600,
      };
    }

    if (row.result !== "created" || typeof row.inquiry_id !== "string") {
      console.error("Supabase returned an invalid inquiry result.");
      return { created: false, reason: "database_error" };
    }

    return { created: true, id: row.inquiry_id };
  } catch (error) {
    console.error("Inquiry persistence failed.", error instanceof Error ? error.message : "Unknown error");
    return { created: false, reason: "database_error" };
  }
}

export async function updateInquiryDelivery(id: string, status: "delivered" | "delivery_failed", emailDeliveryId?: string) {
  const config = getSupabaseConfig();
  if (!config) return false;

  try {
    const response = await fetch(`${config.url}/rest/v1/inquiries?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        ...requestHeaders(config.secretKey),
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        status,
        email_delivery_id: emailDeliveryId ?? null,
        updated_at: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) console.error("Supabase could not update inquiry delivery status.", { status: response.status });
    return response.ok;
  } catch (error) {
    console.error("Inquiry delivery status update failed.", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}
