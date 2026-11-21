import { Resend } from "resend";

export type ContactInquiry = {
  propertyName: string;
  name: string;
  furigana: string;
  email: string;
  tel: string;
  message: string;
};

const DEFAULT_FROM = "太陽不動産 <onboarding@resend.dev>";

function inquiryText(inquiry: ContactInquiry): string {
  return [
    `問い合わせ物件名: ${inquiry.propertyName || "（なし）"}`,
    `氏名: ${inquiry.name}`,
    `フリガナ: ${inquiry.furigana || "（なし）"}`,
    `メールアドレス: ${inquiry.email || "（なし）"}`,
    `TEL: ${inquiry.tel || "（なし）"}`,
    "",
    inquiry.message,
  ].join("\n");
}

export async function sendContactInquiry(inquiry: ContactInquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL?.trim();

  if (!apiKey || !to) {
    throw new Error("RESEND_API_KEY または CONTACT_TO_EMAIL が未設定です。");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
    to: [to],
    replyTo: inquiry.email || undefined,
    subject: inquiry.propertyName
      ? `物件お問い合わせ: ${inquiry.propertyName}`
      : "物件お問い合わせ",
    text: inquiryText(inquiry),
  });

  if (error) {
    throw new Error(error.message);
  }
}
