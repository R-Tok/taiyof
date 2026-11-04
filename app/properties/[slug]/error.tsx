"use client";

import Link from "next/link";

export default function PropertyError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          物件情報を表示できません
        </h1>
        <p className="mt-4 leading-7 text-stone-600">
          コンテンツの取得に失敗しました。時間をおいて再度お試しください。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-sky-900 px-5 py-3 text-sm font-medium text-white hover:bg-sky-950"
          >
            再読み込み
          </button>
          <Link
            href="/deal"
            className="inline-flex items-center text-sm font-medium text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
          >
            売買物件トップへ
          </Link>
        </div>
      </div>
    </main>
  );
}
