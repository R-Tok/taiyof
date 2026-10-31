import type { Metadata } from "next";
import Link from "next/link";
import {
  formatInfoPublishedAt,
  getInfoPosts,
  getInfoPreviewText,
} from "@/lib/info-posts";

export const metadata: Metadata = {
  title: "店舗からのお知らせ",
  description:
    "太陽不動産株式会社からの休業日や店舗のお知らせ一覧です。",
};

export default async function InfosPage() {
  const posts = await getInfoPosts();

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="text-sm font-medium tracking-wide text-sky-900">
          太陽不動産株式会社
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          店舗からのお知らせ
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          休業日や店舗のご案内を掲載しています。
        </p>

        {posts.length === 0 ? (
          <p className="mt-10 text-stone-500">現在、お知らせはありません。</p>
        ) : (
          <ul className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/infos/${post.slug}`}
                  className="group block py-5 transition-colors hover:bg-stone-50 sm:py-6"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <time
                      dateTime={post.publishedAt}
                      className="text-sm text-stone-500"
                    >
                      {formatInfoPublishedAt(post.publishedAt)}
                    </time>
                    {post.category ? (
                      <span className="text-xs font-medium text-sky-900">
                        {post.category}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-lg font-medium text-stone-900 group-hover:text-sky-900">
                    {post.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-base leading-7 text-stone-600">
                    {getInfoPreviewText(post)}
                  </p>
                  {post.image ? (
                    <p className="mt-2 text-xs text-stone-400">画像あり</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
