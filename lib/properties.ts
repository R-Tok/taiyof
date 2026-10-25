/**
 * 物件データ（CMS 接続前のサンプル）。
 * 表示項目は CMS 連携時に増減しうるため、一覧・詳細は optional フィールドを許容する。
 */
import type { CategoryDefinition } from "@/lib/property-routes";

export type PropertyImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** 一覧・詳細で使う共通フィールド（CMS 側の型イメージ） */
export type Property = {
  slug: string;
  categoryKey: CategoryDefinition["key"];
  name: string;
  address: string;
  price: string;
  thumbnail?: PropertyImage;
  images?: PropertyImage[];
  layout?: string;
  landArea?: string;
  buildingArea?: string;
  parking?: string;
  builtYear?: string;
  notes?: string;
  /** 現行 details.php?id= */
  legacyDetailId?: number;
};

const properties: Property[] = [
  {
    slug: "koemachi-used-house",
    categoryKey: "deal/house-mansion",
    legacyDetailId: 396,
    name: "幸町中古住宅",
    address: "上越市幸町",
    layout: "5DK",
    price: "650万円",
    landArea: "468.78㎡（141.83坪）",
    buildingArea: "106.30㎡（32.15坪）",
    builtYear: "1973年築",
    notes:
      "東本町小・城北中学校区\n公共上下水道・都市ガス\n南側前面道路幅員約4.5m市道除雪あり",
    thumbnail: {
      src: "/properties/koemachi-used-house/exterior.jpeg",
      alt: "幸町中古住宅の外観",
      width: 320,
      height: 240,
    },
    images: [
      {
        src: "/properties/koemachi-used-house/exterior.jpeg",
        alt: "幸町中古住宅の外観",
        width: 640,
        height: 480,
      },
      {
        src: "/properties/koemachi-used-house/interior-1.jpg",
        alt: "幸町中古住宅の室内",
        width: 640,
        height: 480,
      },
      {
        src: "/properties/koemachi-used-house/interior-2.jpeg",
        alt: "幸町中古住宅の室内",
        width: 640,
        height: 480,
      },
    ],
  },
];

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

export function getPropertySlugs(): string[] {
  return properties.map((p) => p.slug);
}

export function getPropertiesByCategoryKey(
  categoryKey: CategoryDefinition["key"],
): Property[] {
  return properties.filter((p) => p.categoryKey === categoryKey);
}

export function getDetailFields(
  property: Property,
): { label: string; value: string }[] {
  const rows: { label: string; value: string | undefined }[] = [
    { label: "物件名", value: property.name },
    { label: "所在地", value: property.address },
    { label: "間取", value: property.layout },
    { label: "価格", value: property.price },
    { label: "土地面積（㎡・坪）", value: property.landArea },
    { label: "専有面積（㎡・坪）", value: property.buildingArea },
    { label: "駐車場", value: property.parking },
    { label: "築年数", value: property.builtYear },
  ];

  return rows.filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );
}
