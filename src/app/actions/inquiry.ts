"use server";

import { headers } from "next/headers";
import { deliverInquiry } from "@/lib/inquiries/delivery";
import { createInquiry, updateInquiryDelivery } from "@/lib/inquiries/persistence";
import { inquirySchema, readInquiryForm } from "@/lib/inquiries/schema";

export interface InquiryState {
  status: "idle" | "success" | "error";
  message: string;
  code?: "validation" | "rate_limited" | "delivery_unavailable";
  fieldErrors?: Record<string, string[]>;
}

async function getClientIdentifier() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = requestHeaders.get("x-real-ip")?.trim();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 200) || "unknown-agent";
  return forwardedFor || realIp || `unknown-ip:${userAgent}`;
}

export async function submitInquiry(_previousState: InquiryState, formData: FormData): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse(readInquiryForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      code: "validation",
      message: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Silently accept honeypot submissions so automated senders do not learn
  // which field triggered the spam check. No email is delivered.
  if (parsed.data.companyWebsite) {
    return { status: "success", message: "Thank you. Your message has been received." };
  }

  const persistence = await createInquiry(parsed.data, await getClientIdentifier());
  if (!persistence.created && persistence.reason === "rate_limited") {
    const minutes = Math.max(1, Math.ceil(persistence.retryAfterSeconds / 60));
    return {
      status: "error",
      code: "rate_limited",
      message: `Too many submissions. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  if (!persistence.created) {
    return {
      status: "error",
      code: "delivery_unavailable",
      message: "We could not save your message right now. Please email us directly or try again later.",
    };
  }

  const deliveryMode = process.env.INQUIRY_DELIVERY_MODE || "database-only";
  if (deliveryMode === "database-only") {
    return {
      status: "success",
      message: parsed.data.formType === "quote"
        ? "Thank you. Your project inquiry has been saved."
        : "Thank you. Your message has been saved.",
    };
  }

  if (deliveryMode !== "email") {
    console.error("Invalid INQUIRY_DELIVERY_MODE configuration.");
    return {
      status: "error",
      code: "delivery_unavailable",
      message: "We could not process your message right now. Please email us directly or try again later.",
    };
  }

  const delivery = await deliverInquiry(parsed.data);
  if (!delivery.delivered) {
    await updateInquiryDelivery(persistence.id, "delivery_failed");
    return {
      status: "error",
      code: "delivery_unavailable",
      message: "We could not deliver your message right now. Please email us directly or try again later.",
    };
  }

  await updateInquiryDelivery(persistence.id, "delivered", delivery.id);

  return {
    status: "success",
    message: parsed.data.formType === "quote"
      ? "Thank you. Our project team will review your information and follow up shortly."
      : "Thank you. A member of our team will be in touch shortly.",
  };
}
