import { Resend } from "resend";

/**
 * Lazily-created Resend client for server-side use. Constructing `Resend`
 * eagerly throws when `RESEND_API_KEY` is unset (e.g. during `next build`
 * page-data collection), so we defer it until a request actually sends mail.
 * Never import this in client components — it relies on the secret key.
 */
let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    client = new Resend(apiKey);
  }
  return client;
}

/** Verified sender address (must be on a domain verified in Resend). */
export const CONTACT_FROM =
  process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";

/** Inbox that contact-form submissions are delivered to. */
export const CONTACT_TO = process.env.CONTACT_TO ?? "azzimaina@gmail.com";
