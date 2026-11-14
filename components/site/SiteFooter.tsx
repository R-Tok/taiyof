import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-100 text-stone-700">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <p className="text-base font-semibold text-stone-900">太陽不動産株式会社</p>
        <div className="text-sm leading-7">
          <p>新潟県知事免許(13)1633</p>
          <p>〒943-0827　新潟県上越市栄町7-6</p>
          <p>
            TEL：
            <a href="tel:0255247651" className="underline decoration-stone-300 underline-offset-4 hover:decoration-sky-900">
              025-524-7651
            </a>
            {"　/　FAX：025-523-7340"}
          </p>
          <p>
            E-mail：
            <a href="mailto:info@taiyo-f.net" className="underline decoration-stone-300 underline-offset-4 hover:decoration-sky-900">
              info@taiyo-f.net
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-stone-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Copyright © 2026 太陽不動産株式会社 All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-sky-900">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-sky-900">
              利用規約
            </Link>
            <Link href="/contact" className="hover:text-sky-900">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
