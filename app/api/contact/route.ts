import { NextRequest } from "next/server";
import { z } from "zod";
import ContactEmail from "@/emails/contact-email";
import { getResend, CONTACT_FROM, CONTACT_TO } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ message: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const { error } = await getResend().emails.send({
    from: CONTACT_FROM,
    to: [CONTACT_TO],
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    react: ContactEmail({ name, email, subject, message }),
  });

  if (error) {
    console.error("Resend send error:", error);
    return Response.json(
      { message: "Failed to send message" },
      { status: 502 }
    );
  }

  return Response.json({ ok: true }, { status: 201 });
}
