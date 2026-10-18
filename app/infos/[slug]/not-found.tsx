import Link from "next/link";

export default function InfoNotFound() {
  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          お知らせが見つかりません
        </h1>
        <p className="mt-4 leading-7 text-stone-600">
          削除されたか、URL が間違っている可能性があります。
        </p>
        <Link
          href="/infos"
          className="mt-8 inline-block text-sm font-medium text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
        >
          お知らせ一覧へ
        </Link>
      </div>
    </main>
  );
}
