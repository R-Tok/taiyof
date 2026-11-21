"use server";

import { sendContactInquiry, type ContactInquiry } from "@/lib/contact-mail";

export type ContactFormState = {
  status: "success" | "error";
  message: string;
} | null;

function field(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const inquiry: ContactInquiry = {
    propertyName: field(formData, "propertyName", 200),
    name: field(formData, "name", 100),
    furigana: field(formData, "furigana", 100),
    email: field(formData, "email", 200),
    tel: field(formData, "tel", 40),
    message: field(formData, "message", 4000),
  };

  if (!inquiry.name || !inquiry.message) {
    return {
      status: "error",
      message: "氏名とお問い合わせ内容を入力してください。",
    };
  }

  if (inquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) {
    return {
      status: "error",
      message: "メールアドレスの形式を確認してください。",
    };
  }

  try {
    await sendContactInquiry(inquiry);
    return {
      status: "success",
      message: "送信しました。担当者からご連絡します。",
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    return {
      status: "error",
      message: detail
        ? `送信できませんでした。${detail}`
        : "送信できませんでした。時間をおいて再度お試しください。",
    };
  }
}
