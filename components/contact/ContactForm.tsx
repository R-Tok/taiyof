"use client";

import { useState } from "react";
import { CONTACT_PAGE } from "@/lib/contact";

type ContactFormProps = {
  defaultPropertyName?: string;
};

export function ContactForm({ defaultPropertyName = "" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-2">
        <label htmlFor="propertyName" className="block text-sm font-medium text-stone-700">
          問い合わせ物件名
        </label>
        <input
          id="propertyName"
          name="propertyName"
          type="text"
          defaultValue={defaultPropertyName}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
          placeholder="物件名が自動入力されます"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">
          氏名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="furigana" className="block text-sm font-medium text-stone-700">
          フリガナ
        </label>
        <input
          id="furigana"
          name="furigana"
          type="text"
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tel" className="block text-sm font-medium text-stone-700">
          TEL
        </label>
        <input
          id="tel"
          name="tel"
          type="tel"
          autoComplete="tel"
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-stone-700">
          お問い合わせ内容 <span className="text-red-600">必須</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={8}
          className="w-full rounded-lg border border-stone-300 px-3 py-2.5 text-base leading-7 outline-none ring-sky-900/20 focus:border-sky-700 focus:ring-2"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-sky-900 px-5 py-3 text-sm font-medium text-white hover:bg-sky-950 sm:w-auto"
        >
          送信
        </button>
        <p className="mt-3 text-sm text-stone-500">{CONTACT_PAGE.submitNote}</p>
        {submitted ? (
          <p className="mt-2 text-sm text-sky-900" role="status">
            入力内容は送信されません（デモ表示）。本番ではメール送信や CMS 連携を接続します。
          </p>
        ) : null}
      </div>
    </form>
  );
}
