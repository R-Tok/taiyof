import type { Metadata } from "next";
import Link from "next/link";
import { getInfoPosts, formatInfoPublishedAt } from "@/lib/info-posts";

export const metadata: Metadata = {
  title: "上越市のアパート・マンション・不動産情報",
  description:
    "新潟県上越市の賃貸・売買物件。太陽不動産株式会社がアパート、マンション、戸建、土地をご案内します。",
};

const entries = [
  {
    href: "/rent",
    eyebrow: "Rent",
    title: "賃貸物件",
    text: "アパート、マンション、戸建、店舗・倉庫。",
  },
  {
    href: "/deal",
    eyebrow: "Buy",
    title: "売買物件",
    text: "住宅用の土地と、戸建・マンション。",
  },
];

export default async function Home() {
  const posts = (await getInfoPosts()).slice(0, 3);

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-stone-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero/town.svg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
          <p className="text-sm font-medium tracking-wide text-white/80">
            上越市の不動産
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            住まいは、
            <br />
            地元の太陽不動産へ。
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/90 sm:text-lg">
            上越エリアで不動産をお探しの方は、ぜひ一度ご覧下さい。アパートから土地まで、掲載物件をご案内します。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/rent"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-stone-900 hover:bg-stone-100"
            >
              賃貸物件を見る
            </Link>
            <Link
              href="/deal"
              className="inline-flex items-center justify-center rounded-lg border border-white/70 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              売買物件を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight">物件を探す</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group rounded-2xl border border-stone-200 bg-stone-50 p-8 transition-colors hover:border-sky-300 hover:bg-sky-50/40"
            >
              <p className="text-sm font-medium tracking-wide text-sky-900">
                {entry.eyebrow}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight group-hover:text-sky-900">
                {entry.title}
              </p>
              <p className="mt-3 leading-7 text-stone-600">{entry.text}</p>
              <span className="mt-6 inline-block text-sm font-medium text-sky-900">
                一覧へ →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">店舗からのお知らせ</h2>
            <Link
              href="/infos"
              className="text-sm font-medium text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
            >
              すべて見る
            </Link>
          </div>
          <ul className="mt-6 divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/infos/${post.slug}`} className="block px-4 py-5 hover:bg-stone-50">
                  <time dateTime={post.publishedAt} className="text-sm text-stone-500">
                    {formatInfoPublishedAt(post.publishedAt)}
                  </time>
                  <p className="mt-1 font-medium">{post.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
