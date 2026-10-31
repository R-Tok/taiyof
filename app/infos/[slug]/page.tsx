import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatInfoPublishedAt,
  getInfoPostBySlug,
  getInfoPostSlugs,
  getInfoPreviewText,
} from "@/lib/info-posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getInfoPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInfoPostBySlug(slug);

  if (!post) {
    return { title: "お知らせが見つかりません" };
  }

  return {
    title: post.title,
    description: getInfoPreviewText(post, 120),
  };
}

export default async function InfoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getInfoPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col bg-white text-stone-900">
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/infos"
          className="text-sm font-medium text-sky-900 underline decoration-sky-200 underline-offset-4 hover:decoration-sky-900"
        >
          ← お知らせ一覧
        </Link>

        <header className="mt-8 border-b border-stone-200 pb-6">
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
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {post.title}
          </h1>
        </header>

        <div className="mt-8 space-y-8">
          {post.bodyFormat === "html" ? (
            <div
              className="info-html text-base leading-8"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p className="whitespace-pre-wrap text-base leading-8">{post.body}</p>
          )}

          {post.image ? (
            <figure className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                className="h-auto w-full"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <figcaption className="border-t border-stone-200 px-4 py-2 text-sm text-stone-500">
                {post.image.alt}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </article>
    </main>
  );
}
