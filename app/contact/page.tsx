import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormWithSearchParams } from "@/components/contact/ContactFormWithSearchParams";
import { CONTACT_PAGE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "太陽不動産株式会社への物件お問い合わせ。電話またはフォームよりご連絡ください。",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-sky-900">
          太陽不動産株式会社
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {CONTACT_PAGE.title}
        </h1>
        <p className="mt-4 leading-8 text-stone-700">{CONTACT_PAGE.intro}</p>

        <section className="mt-8 rounded-lg border border-stone-200 bg-stone-50 p-5">
          <h2 className="text-sm font-semibold text-stone-800">お電話でのお問い合わせ</h2>
          <p className="mt-2">
            TEL：
            <a
              href={`tel:${CONTACT_PAGE.phone.replace(/-/g, "")}`}
              className="font-medium text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
            >
              {CONTACT_PAGE.phoneDisplay}
            </a>
          </p>
        </section>

        <Suspense fallback={<ContactForm />}>
          <ContactFormWithSearchParams />
        </Suspense>
      </div>
    </main>
  );
}
