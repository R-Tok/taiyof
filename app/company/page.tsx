import type { Metadata } from "next";
import { companyName, companyProfileItems } from "@/lib/company-profile";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "太陽不動産株式会社の会社概要です。所在地、営業時間、宅地建物取引業者登録などの情報をご案内します。",
};

function ProfileLine({ line }: { line: string }) {
  const tel = line.match(/^TEL：(.+)$/);

  if (!tel) {
    return <p>{line}</p>;
  }

  const dial = tel[1].replace(/-/g, "");

  return (
    <p>
      TEL：
      <a href={`tel:${dial}`} className="underline decoration-stone-300 underline-offset-4 hover:decoration-sky-900">
        {tel[1]}
      </a>
    </p>
  );
}

export default function CompanyPage() {
  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-sky-900">{companyName}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">会社概要</h1>
        <dl className="mt-8 border-y border-stone-200">
          {companyProfileItems.map((item) => (
            <div
              key={item.label}
              className="grid gap-1 border-b border-stone-200 py-4 last:border-b-0 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-6 sm:py-5"
            >
              <dt className="text-sm font-medium text-stone-500">{item.label}</dt>
              <dd className="space-y-1 text-base leading-7">
                {item.lines.map((line) => (
                  <ProfileLine key={line} line={line} />
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </main>
  );
}
