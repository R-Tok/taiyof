/**
 * 店舗からのお知らせ。
 * 表示用の型は固定し、取得元だけ microCMS / ローカル定数を切り替える。
 */
import { cacheLife, cacheTag } from "next/cache";
import {
  getMicroCMSClient,
  isMicroCMSConfigured,
  MicroCMSFetchError,
} from "@/lib/microcms";

export type InfoPostImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type InfoPost = {
  slug: string;
  title: string;
  body: string;
  bodyFormat: "plain" | "html";
  /** ISO 8601（登録日時） */
  publishedAt: string;
  category?: string;
  image?: InfoPostImage;
  source: "local" | "cms";
};

type MicroCMSCategory = {
  id: string;
  name: string;
};

type MicroCMSInfo = {
  id: string;
  publishedAt: string;
  title: string;
  content: string;
  slug?: string;
  category?: MicroCMSCategory | null;
};

const localInfoPosts: InfoPost[] = [
  {
    slug: "2025-06-holiday",
    title: "6月の休業日",
    body: "6/30 お休みします",
    bodyFormat: "plain",
    publishedAt: "2025-06-01T09:00:00+09:00",
    source: "local",
  },
  {
    slug: "kanban-inu",
    title: "店舗からのお知らせ",
    body: "看板犬",
    bodyFormat: "plain",
    publishedAt: "2025-05-20T14:30:00+09:00",
    source: "local",
    image: {
      src: "/infos/kanban-inu.svg",
      alt: "店舗の看板犬のイメージ",
      width: 640,
      height: 480,
    },
  },
];

function sortByPublishedAt(posts: InfoPost[]): InfoPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function mapCmsInfo(item: MicroCMSInfo): InfoPost | null {
  const slug = item.slug?.trim();
  if (!slug) {
    return null;
  }

  return {
    slug,
    title: item.title,
    body: item.content,
    bodyFormat: "html",
    publishedAt: item.publishedAt,
    category: item.category?.name,
    source: "cms",
  };
}

async function fetchCmsInfoPosts(): Promise<InfoPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("infos");

  const client = getMicroCMSClient();
  if (!client) {
    return [];
  }

  try {
    const data = await client.getList<MicroCMSInfo>({
      endpoint: "infos",
      queries: {
        limit: 100,
        orders: "-publishedAt",
        fields: ["id", "title", "content", "slug", "category", "publishedAt"],
      },
    });

    return data.contents
      .map(mapCmsInfo)
      .filter((post): post is InfoPost => post !== null);
  } catch (cause) {
    throw new MicroCMSFetchError("お知らせの取得に失敗しました。", { cause });
  }
}

function mergeInfoPosts(cmsPosts: InfoPost[]): InfoPost[] {
  const bySlug = new Map<string, InfoPost>();

  for (const post of localInfoPosts) {
    bySlug.set(post.slug, post);
  }
  for (const post of cmsPosts) {
    bySlug.set(post.slug, post);
  }

  return sortByPublishedAt([...bySlug.values()]);
}

export async function getInfoPosts(): Promise<InfoPost[]> {
  if (!isMicroCMSConfigured()) {
    return sortByPublishedAt(localInfoPosts);
  }

  const cmsPosts = await fetchCmsInfoPosts();
  return mergeInfoPosts(cmsPosts);
}

export async function getInfoPostBySlug(
  slug: string,
): Promise<InfoPost | undefined> {
  const posts = await getInfoPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getInfoPostSlugs(): Promise<string[]> {
  const posts = await getInfoPosts();
  return posts.map((post) => post.slug);
}

export function formatInfoPublishedAt(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(new Date(iso));
}

export function getInfoPreviewText(post: InfoPost, maxLength = 80): string {
  const plain =
    post.bodyFormat === "html"
      ? post.body
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : post.body.trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength)}…`;
}
