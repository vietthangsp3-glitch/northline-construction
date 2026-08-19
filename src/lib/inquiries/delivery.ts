import type { Inquiry } from "@/lib/inquiries/schema";

export type DeliveryResult =
  | { delivered: true; id: string }
  | { delivered: false; reason: "not_configured" | "provider_error" };

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function display(value: string | undefined) {
  return value || "Not provided";
}

function buildEmail(inquiry: Inquiry) {
  const fields = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", display(inquiry.phone)],
    ["Company", display(inquiry.company)],
    ...(inquiry.formType === "quote" ? [
      ["Project type", display(inquiry.projectType)],
      ["Budget", display(inquiry.budget)],
      ["Location", display(inquiry.location)],
      ["Timeline", display(inquiry.timeline)],
    ] : []),
  ];

  const text = [
    `New ${inquiry.formType === "quote" ? "project" : "contact"} inquiry`,
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    inquiry.message,
  ].join("\n");

  const html = `
    <h1>New ${inquiry.formType === "quote" ? "project" : "contact"} inquiry</h1>
    <table cellpadding="8" cellspacing="0" border="0">
      ${fields.map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}
    </table>
    <h2>Message</h2>
    <p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
  `.trim();

  return { text, html };
}

export async function deliverInquiry(inquiry: Inquiry): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!apiKey || !from || !to) return { delivered: false, reason: "not_configured" };

  const content = buildEmail(inquiry);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(inquiry)));
  const idempotencyKey = `inquiry-${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "Northline-Website/1.0",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: `${inquiry.formType === "quote" ? "Project inquiry" : "Contact inquiry"} — ${inquiry.name}`,
        text: content.text,
        html: content.html,
        tags: [{ name: "form_type", value: inquiry.formType }],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const payload = await response.json().catch(() => null) as { id?: unknown; name?: unknown } | null;
    if (!response.ok || typeof payload?.id !== "string") {
      console.error("Inquiry email provider rejected the request.", { status: response.status, type: payload?.name ?? "unknown" });
      return { delivered: false, reason: "provider_error" };
    }

    return { delivered: true, id: payload.id };
  } catch (error) {
    console.error("Inquiry email delivery failed.", error instanceof Error ? error.message : "Unknown error");
    return { delivered: false, reason: "provider_error" };
  }
}
