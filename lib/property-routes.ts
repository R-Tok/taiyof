/**
 * 賃貸・売買のカテゴリ URL 定義（ホワイトリスト）。
 * catch-all ルートはここで解決し、未定義パスは 404 にする。
 */
export type TransactionType = "rent" | "deal";

export type LayoutGroup = "1" | "2" | "3";

export type RentBuildingKind = "apartment" | "mansion" | "house" | "store-warehouse";

export type DealKind = "land" | "house-mansion";

export type CategoryDefinition = {
  transactionType: TransactionType;
  /** `/rent` または `/deal` 以降のセグメント */
  segments: string[];
  /** 一意キー（例: deal/house-mansion） */
  key: string;
  href: string;
  title: string;
  /** ハブのカード等で使う短いラベル */
  hubLabel: string;
  description?: string;
  /** 現行 list.php?id= の対応（移行メモ） */
  legacyListId?: number;
  rent?: {
    buildingKind: RentBuildingKind;
    layoutGroup?: LayoutGroup;
  };
  deal?: {
    kind: DealKind;
  };
};

export const DEAL_HUB = {
  title: "売買物件",
  intro:
    "こちらでは、主にこれから家を建てようとお考えの方向けに住宅用土地の紹介や、売り家・分譲マンションなどの売買物件を掲載しています。また、掲載物件には仲介物件もありますので、成約の際には別途、仲介手数料が必要となります。",
  note: "掲載物件は随時更新しています。成約の際、仲介物件は別途仲介手数料が必要です。",
} as const;

const rentCategories: CategoryDefinition[] = [
  ...(["apartment", "mansion"] as const).flatMap((buildingKind) =>
    (["1", "2", "3"] as const).map((layoutGroup) => {
      const buildingLabel = buildingKind === "apartment" ? "アパート" : "マンション";
      const layoutLabel =
        layoutGroup === "1"
          ? "1K・1DK・1LDK"
          : layoutGroup === "2"
            ? "2K・2DK・2LDK"
            : "3K・3DK・3LDK";
      const segments = [buildingKind, layoutGroup];
      return {
        transactionType: "rent" as const,
        segments,
        key: `rent/${segments.join("/")}`,
        href: `/rent/${segments.join("/")}`,
        title: `${buildingLabel} ${layoutLabel}`,
        hubLabel: `${buildingLabel} ${layoutLabel}`,
        rent: { buildingKind, layoutGroup },
      };
    }),
  ),
  {
    transactionType: "rent",
    segments: ["house"],
    key: "rent/house",
    href: "/rent/house",
    title: "戸建住宅",
    hubLabel: "戸建住宅",
    legacyListId: 3,
    rent: { buildingKind: "house" },
  },
  {
    transactionType: "rent",
    segments: ["store-warehouse"],
    key: "rent/store-warehouse",
    href: "/rent/store-warehouse",
    title: "店舗・倉庫",
    hubLabel: "店舗・倉庫",
    legacyListId: 4,
    rent: { buildingKind: "store-warehouse" },
  },
];

const dealCategories: CategoryDefinition[] = [
  {
    transactionType: "deal",
    segments: ["land"],
    key: "deal/land",
    href: "/deal/land",
    title: "土地",
    hubLabel: "土地",
    description: "住宅用土地などの売買物件",
    legacyListId: 5,
    deal: { kind: "land" },
  },
  {
    transactionType: "deal",
    segments: ["house-mansion"],
    key: "deal/house-mansion",
    href: "/deal/house-mansion",
    title: "戸建・マンション",
    hubLabel: "戸建・マンション",
    description: "中古住宅・分譲マンションなど",
    legacyListId: 6,
    deal: { kind: "house-mansion" },
  },
];

const allCategories: CategoryDefinition[] = [...rentCategories, ...dealCategories];

const categoryByKey = new Map(allCategories.map((c) => [c.key, c]));

function segmentsKey(transactionType: TransactionType, segments: string[]): string {
  return `${transactionType}/${segments.join("/")}`;
}

export function resolveCategory(
  transactionType: TransactionType,
  segments: string[] | undefined,
): CategoryDefinition | undefined {
  if (!segments?.length) {
    return undefined;
  }
  return categoryByKey.get(segmentsKey(transactionType, segments));
}

export function getDealHubCategories(): CategoryDefinition[] {
  return dealCategories;
}

export function getRentHubCategories(): CategoryDefinition[] {
  return rentCategories;
}

export function getAllCategoryDefinitions(): CategoryDefinition[] {
  return allCategories;
}

export function getCategoryBreadcrumbs(category: CategoryDefinition): {
  label: string;
  href?: string;
}[] {
  const hub =
    category.transactionType === "deal"
      ? { label: "売買物件", href: "/deal" }
      : { label: "賃貸物件", href: "/rent" };

  return [hub, { label: category.title, href: category.href }];
}
