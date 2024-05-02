// mailgun.ts
import formData from "form-data";
import Mailgun from "mailgun.js";
import { renderEmailTemplate } from "@/components/EmailTemplate";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.NEXT_PUBLIC_MAILGUN_API_KEY!,
});

export const sendEmail = async (
  userEmail: string,
  subject: string,
  text: string
) => {
  const html = renderEmailTemplate({ subject, text });

  const data = {
    from: "Budget Canvas <mailgun@sandbox2468b718a01b46299e2f5c7fe7ba0936.mailgun.org>",
    to: userEmail,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await mg.messages.create(process.env.NEXT_PUBLIC_MAILGUN_DOMAIN!, data);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
