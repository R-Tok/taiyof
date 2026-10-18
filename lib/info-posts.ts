/**
 * 店舗からのお知らせ（CMS 接続前のサンプル原稿）。
 * microCMS 接続時はこの型と取得関数の実装を差し替える。
 */
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
  /** ISO 8601（登録日時） */
  publishedAt: string;
  image?: InfoPostImage;
};

const infoPosts: InfoPost[] = [
  {
    slug: "2025-06-holiday",
    title: "6月の休業日",
    body: "6/30 お休みします",
    publishedAt: "2025-06-01T09:00:00+09:00",
  },
  {
    slug: "kanban-inu",
    title: "店舗からのお知らせ",
    body: "看板犬",
    publishedAt: "2025-05-20T14:30:00+09:00",
    image: {
      src: "/infos/kanban-inu.svg",
      alt: "店舗の看板犬のイメージ",
      width: 640,
      height: 480,
    },
  },
];

export function getInfoPosts(): InfoPost[] {
  return [...infoPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getInfoPostBySlug(slug: string): InfoPost | undefined {
  return infoPosts.find((post) => post.slug === slug);
}

export function getInfoPostSlugs(): string[] {
  return infoPosts.map((post) => post.slug);
}

export function formatInfoPublishedAt(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(new Date(iso));
}
