/**
 * 売買物件。表示用の型は固定し、取得元だけ microCMS / ローカル定数を切り替える。
 */
import { cacheLife, cacheTag } from "next/cache";
import {
  getMicroCMSClient,
  isMicroCMSConfigured,
  MicroCMSFetchError,
} from "@/lib/microcms";
import type { CategoryDefinition, DealKind } from "@/lib/property-routes";

export type PropertyImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PropertyDetailField = {
  label: string;
  value: string;
  preWrap?: boolean;
};

export type Property = {
  slug: string;
  categoryKey: CategoryDefinition["key"];
  dealKind?: DealKind;
  name: string;
  address?: string;
  price?: string;
  layout?: string;
  landArea?: string;
  buildingArea?: string;
  landCategory?: string;
  builtYear?: string;
  notes?: string;
  thumbnail?: PropertyImage;
  images: PropertyImage[];
  detailFields: PropertyDetailField[];
};

type MicroCMSImage = {
  url: string;
  width: number;
  height: number;
};

type MicroCMSDeal = {
  id: string;
  slug?: string;
  name: string;
  category?: string[];
  address?: string;
  layout?: string;
  area_land?: string;
  area_owned?: string;
  price?: string;
  land_category?: string;
  building_age?: string;
  notes?: string;
  images?: MicroCMSImage[];
  [key: string]: unknown;
};

const CMS_SYSTEM_KEYS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "publishedAt",
  "revisedAt",
  "images",
  "slug",
]);

const CMS_FIELD_LABELS: Record<string, string> = {
  name: "物件名",
  category: "種別",
  address: "所在地",
  layout: "間取",
  price: "価格",
  area_land: "土地面積",
  area_owned: "専有面積",
  land_category: "地目",
  building_age: "築年数",
  notes: "備考",
};

const CMS_FIELD_ORDER = [
  "name",
  "category",
  "address",
  "layout",
  "price",
  "area_land",
  "area_owned",
  "land_category",
  "building_age",
  "notes",
];

const localProperties: Property[] = [
  {
    slug: "koemachi-used-house",
    categoryKey: "deal/house-mansion",
    dealKind: "house-mansion",
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
    ],
    detailFields: [
      { label: "物件名", value: "幸町中古住宅" },
      { label: "種別", value: "戸建・マンション" },
      { label: "所在地", value: "上越市幸町" },
      { label: "間取", value: "5DK" },
      { label: "価格", value: "650万円" },
      { label: "土地面積", value: "468.78㎡（141.83坪）" },
      { label: "専有面積", value: "106.30㎡（32.15坪）" },
      { label: "築年数", value: "1973年築" },
      {
        label: "備考",
        value:
          "東本町小・城北中学校区\n公共上下水道・都市ガス\n南側前面道路幅員約4.5m市道除雪あり",
        preWrap: true,
      },
    ],
  },
];

function formatCmsValue(value: unknown): string | undefined {
  if (value == null || value === "") {
    return undefined;
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => formatCmsValue(item))
      .filter((item): item is string => Boolean(item));
    return parts.length ? parts.join("、") : undefined;
  }
  if (typeof value === "object") {
    if ("name" in value && typeof value.name === "string") {
      return value.name;
    }
    return undefined;
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return undefined;
}

function buildDetailFields(item: MicroCMSDeal): PropertyDetailField[] {
  const used = new Set<string>();
  const rows: PropertyDetailField[] = [];

  for (const key of CMS_FIELD_ORDER) {
    const value = formatCmsValue(item[key]);
    if (!value) {
      continue;
    }
    used.add(key);
    rows.push({
      label: CMS_FIELD_LABELS[key] ?? key,
      value,
      preWrap: key === "notes",
    });
  }

  for (const [key, raw] of Object.entries(item)) {
    if (used.has(key) || CMS_SYSTEM_KEYS.has(key)) {
      continue;
    }
    const value = formatCmsValue(raw);
    if (!value) {
      continue;
    }
    rows.push({
      label: CMS_FIELD_LABELS[key] ?? key,
      value,
      preWrap: key === "notes",
    });
  }

  return rows;
}

function resolveDealKind(category: string[] | undefined): DealKind | undefined {
  if (category?.includes("土地")) {
    return "land";
  }
  if (category?.includes("戸建・マンション")) {
    return "house-mansion";
  }
  return undefined;
}

function mapCmsDeal(item: MicroCMSDeal): Property | null {
  const dealKind = resolveDealKind(item.category);
  if (!dealKind) {
    return null;
  }

  const images = (item.images ?? []).map((image, index) => ({
    src: image.url,
    alt: `${item.name}の画像${index + 1}`,
    width: image.width,
    height: image.height,
  }));

  return {
    slug: item.slug?.trim() || item.id,
    categoryKey: `deal/${dealKind}`,
    dealKind,
    name: item.name,
    address: item.address,
    price: item.price,
    layout: item.layout,
    landArea: item.area_land,
    buildingArea: item.area_owned,
    landCategory: item.land_category,
    builtYear: item.building_age,
    notes: item.notes,
    thumbnail: images[0],
    images,
    detailFields: buildDetailFields(item),
  };
}

async function fetchCmsDealProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("deal");

  const client = getMicroCMSClient();
  if (!client) {
    return [];
  }

  try {
    const data = await client.getList<MicroCMSDeal>({
      endpoint: "deal",
      queries: {
        limit: 100,
        orders: "-publishedAt",
      },
    });

    return data.contents
      .map(mapCmsDeal)
      .filter((property): property is Property => property !== null);
  } catch (cause) {
    throw new MicroCMSFetchError("売買物件の取得に失敗しました。", { cause });
  }
}

export async function getDealProperties(): Promise<Property[]> {
  if (!isMicroCMSConfigured()) {
    return localProperties;
  }

  return fetchCmsDealProperties();
}

export async function getPropertiesByCategoryKey(
  categoryKey: CategoryDefinition["key"],
): Promise<Property[]> {
  const properties = await getDealProperties();
  return properties.filter((property) => property.categoryKey === categoryKey);
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  const properties = await getDealProperties();
  return properties.find((property) => property.slug === slug);
}

export async function getPropertySlugs(): Promise<string[]> {
  const properties = await getDealProperties();
  return properties.map((property) => property.slug);
}

export function getDetailFields(property: Property): PropertyDetailField[] {
  return property.detailFields;
}
