import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/infos", label: "お知らせ" },
  { href: "/rent", label: "賃貸物件" },
  { href: "/deal", label: "売買物件" },
  { href: "/company", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="shrink-0" aria-label="太陽不動産株式会社">
          <Image
            src="/brand/logo.png"
            alt="太陽不動産株式会社"
            width={676}
            height={176}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        <nav aria-label="主要" className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-stone-700 underline decoration-transparent underline-offset-4 hover:text-sky-900 hover:decoration-sky-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
