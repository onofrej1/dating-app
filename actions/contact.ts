"use server";

import { sendEmail } from "@/lib/email";

export async function contact(email: string, subject: string, message: string) {
    message = `From: ${email}, Message: ${message}`;
    await sendEmail(process.env.EMAIL_USER as string, subject, message);
}
