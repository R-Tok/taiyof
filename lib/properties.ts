/**
 * 売買物件。表示用の型は固定し、取得元だけ microCMS / ローカル定数を切り替える。
 */
import { cacheLife, cacheTag } from "next/cache";
import {
  getMicroCMSClient,
  isMicroCMSConfigured,
  MicroCMSFetchError,
} from "@/lib/microcms";
import {
  getAllCategoryDefinitions,
  type CategoryDefinition,
  type DealKind,
  type LayoutGroup,
  type RentBuildingKind,
} from "@/lib/property-routes";

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
  buildingKind?: RentBuildingKind;
  layoutGroup?: LayoutGroup;
  name: string;
  address?: string;
  price?: string;
  layout?: string;
  rentFee?: string;
  deposit?: string;
  gratuity?: string;
  commonFee?: string;
  parking?: string;
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
  layout_category: "間取り分類",
  price: "価格",
  fee_rent: "賃料/月",
  fee_deposit: "敷金",
  fee_gratuity: "礼金",
  fee_common: "共益費",
  parking: "駐車場",
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

const RENT_FIELD_ORDER = [
  "name",
  "category",
  "address",
  "layout",
  "layout_category",
  "fee_rent",
  "fee_deposit",
  "fee_gratuity",
  "fee_common",
  "parking",
  "building_age",
  "notes",
];

function buildDetailFields(
  item: MicroCMSDeal,
  order: string[] = CMS_FIELD_ORDER,
): PropertyDetailField[] {
  const used = new Set<string>();
  const rows: PropertyDetailField[] = [];

  for (const key of order) {
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

const RENT_CATEGORY_TO_KIND: Record<string, RentBuildingKind> = {
  アパート: "apartment",
  マンション: "mansion",
  戸建住宅: "house",
  "店舗・倉庫": "store-warehouse",
};

function resolveBuildingKind(
  category: string[] | undefined,
): RentBuildingKind | undefined {
  for (const label of category ?? []) {
    const kind = RENT_CATEGORY_TO_KIND[label];
    if (kind) {
      return kind;
    }
  }
  return undefined;
}

function resolveLayoutGroup(values: string[] | undefined): LayoutGroup | undefined {
  const text = (values ?? []).join(" ");
  if (text.includes("1K/1DK/1LDK") || text.includes("1K・1DK・1LDK")) {
    return "1";
  }
  if (text.includes("2K/2DK/2LDK") || text.includes("2K・2DK・2LDK")) {
    return "2";
  }
  if (text.includes("3K/3DK/3LDK") || text.includes("3K・3DK・3LDK")) {
    return "3";
  }
  return undefined;
}

type MicroCMSRent = MicroCMSDeal & {
  layout_category?: string[];
  fee_rent?: string;
  fee_deposit?: string;
  fee_gratuity?: string;
  fee_common?: string;
  parking?: string;
};

const localRentProperties: Property[] = [
  {
    slug: "maison-aile-takada",
    categoryKey: "rent/apartment",
    buildingKind: "apartment",
    layoutGroup: "1",
    name: "メゾンエール高田",
    address: "新潟県上越市東城町３丁目",
    layout: "1K",
    rentFee: "35,000円",
    deposit: "１ヶ月",
    gratuity: "なし",
    commonFee: "なし",
    parking: "3,000円",
    builtYear: "平成６年３月",
    notes: "平成２９年３月リフォーム",
    images: [],
    detailFields: [
      { label: "物件名", value: "メゾンエール高田" },
      { label: "種別", value: "アパート" },
      { label: "所在地", value: "新潟県上越市東城町３丁目" },
      { label: "間取", value: "1K" },
      { label: "間取り分類", value: "1K/1DK/1LDK" },
      { label: "賃料/月", value: "35,000円" },
      { label: "敷金", value: "１ヶ月" },
      { label: "礼金", value: "なし" },
      { label: "共益費", value: "なし" },
      { label: "駐車場", value: "3,000円" },
      { label: "築年数", value: "平成６年３月" },
      { label: "備考", value: "平成２９年３月リフォーム", preWrap: true },
    ],
  },
];

function mapCmsRent(item: MicroCMSRent): Property | null {
  const buildingKind = resolveBuildingKind(item.category);
  if (!buildingKind) {
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
    categoryKey: `rent/${buildingKind}`,
    buildingKind,
    layoutGroup: resolveLayoutGroup(item.layout_category),
    name: item.name,
    address: item.address,
    layout: item.layout,
    rentFee: item.fee_rent,
    deposit: item.fee_deposit,
    gratuity: item.fee_gratuity,
    commonFee: item.fee_common,
    parking: item.parking,
    builtYear: item.building_age,
    notes: item.notes,
    thumbnail: images[0],
    images,
    detailFields: buildDetailFields(item, RENT_FIELD_ORDER),
  };
}

async function fetchCmsRentProperties(): Promise<Property[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("rent");

  const client = getMicroCMSClient();
  if (!client) {
    return [];
  }

  try {
    const data = await client.getList<MicroCMSRent>({
      endpoint: "rent",
      queries: {
        limit: 100,
        orders: "-publishedAt",
      },
    });

    return data.contents
      .map(mapCmsRent)
      .filter((property): property is Property => property !== null);
  } catch (cause) {
    throw new MicroCMSFetchError("賃貸物件の取得に失敗しました。", { cause });
  }
}

export async function getRentProperties(): Promise<Property[]> {
  if (!isMicroCMSConfigured()) {
    return localRentProperties;
  }

  return fetchCmsRentProperties();
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
  const definition = getAllCategoryDefinitions().find(
    (category) => category.key === categoryKey,
  );
  if (!definition) {
    return [];
  }

  if (definition.transactionType === "deal") {
    const properties = await getDealProperties();
    return properties.filter((property) => property.categoryKey === categoryKey);
  }

  const rent = definition.rent;
  if (!rent) {
    return [];
  }

  const properties = await getRentProperties();
  return properties.filter((property) => {
    if (property.buildingKind !== rent.buildingKind) {
      return false;
    }
    if (!rent.layoutGroup) {
      return true;
    }
    return property.layoutGroup === rent.layoutGroup;
  });
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | undefined> {
  const [rentProperties, dealProperties] = await Promise.all([
    getRentProperties(),
    getDealProperties(),
  ]);
  return [...rentProperties, ...dealProperties].find(
    (property) => property.slug === slug,
  );
}

export async function getPropertySlugs(): Promise<string[]> {
  const [rentProperties, dealProperties] = await Promise.all([
    getRentProperties(),
    getDealProperties(),
  ]);
  return [...rentProperties, ...dealProperties].map((property) => property.slug);
}

export function getDetailFields(property: Property): PropertyDetailField[] {
  return property.detailFields;
}
