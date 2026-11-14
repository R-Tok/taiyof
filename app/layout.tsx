import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "太陽不動産株式会社",
    template: "%s | 太陽不動産株式会社",
  },
  description:
    "新潟県上越市のアパート・マンション・不動産情報。太陽不動産株式会社の公式サイトです。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="flex justify-between items-center py-4 px-4 bg-red-100 dark:bg-black">
          <h1><Link href="/">太陽不動産株式会社</Link></h1>
          <div className="flex gap-4">
            <Link href="/infos">お知らせ</Link>
            <Link href="/rent">賃貸物件</Link>
            <Link href="/deal">売買物件</Link>
            <Link href="/company">会社概要</Link>
            <Link href="/contact">お問い合わせ</Link>
          </div>
        </header>
        {children}
        <footer className="py-4 px-4 bg-gray-300 dark:bg-black">
          <div className="flex justify-center border-b pb-2 items-center gap-12">
            <h2 className="text-xl font-bold">太陽不動産株式会社</h2>
            <div className="text-sm">
              <p>新潟県知事免許(13)1633</p>
              <p>〒943-0827　新潟県上越市栄町7-6</p>
              <p>TEL：025-524-7651　/　FAX：025-523-7340</p>
              <p>E-mail：info@taiyo-f.net</p>
            </div>
          </div>
          <div className="flex justify-center text-sm gap-4">
            <div>Copyright © 2026 太陽不動産株式会社 All Rights Reserved.</div>
            <div className="flex gap-4">
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/terms">利用規約</Link>
              <Link href="/contact">お問い合わせ</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
