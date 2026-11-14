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

export const LAYOUT_GROUP_LABELS: Record<LayoutGroup, string> = {
  "1": "1K/1DK/1LDK",
  "2": "2K/2DK/2LDK",
  "3": "3K/3DK/3LDK",
};

export const RENT_HUB = {
  title: "賃貸物件",
  intro:
    "こちらでは、学生・一人暮らしに最適なアパート物件から家族でも充分な間取りのマンション・戸建などの賃貸物件を掲載しています。ビジネス向けには店舗・倉庫などの物件も掲載しておりますので、お気軽にお問い合わせ下さい。また、掲載物件には仲介物件もありますので、成約の際には別途、仲介手数料が必要となります。",
  note: "掲載物件は随時更新しています。成約の際、仲介物件は別途仲介手数料が必要です。",
} as const;

export const DEAL_HUB = {
  title: "売買物件",
  intro:
    "こちらでは、主にこれから家を建てようとお考えの方向けに住宅用土地の紹介や、売り家・分譲マンションなどの売買物件を掲載しています。また、掲載物件には仲介物件もありますので、成約の際には別途、仲介手数料が必要となります。",
  note: "掲載物件は随時更新しています。成約の際、仲介物件は別途仲介手数料が必要です。",
} as const;

const rentBuildingLabels: Record<RentBuildingKind, string> = {
  apartment: "アパート",
  mansion: "マンション",
  house: "戸建住宅",
  "store-warehouse": "店舗・倉庫",
};

const rentBuildingDescriptions: Record<RentBuildingKind, string> = {
  apartment: "学生・一人暮らし向けのアパート",
  mansion: "家族でも使える間取りのマンション",
  house: "戸建の賃貸住宅",
  "store-warehouse": "店舗・倉庫などの事業用物件",
};

const rentCategories: CategoryDefinition[] = [
  ...(["apartment", "mansion", "house", "store-warehouse"] as const).map(
    (buildingKind) => ({
      transactionType: "rent" as const,
      segments: [buildingKind],
      key: `rent/${buildingKind}`,
      href: `/rent/${buildingKind}`,
      title: rentBuildingLabels[buildingKind],
      hubLabel: rentBuildingLabels[buildingKind],
      description: rentBuildingDescriptions[buildingKind],
      rent: { buildingKind },
    }),
  ),
  ...(["apartment", "mansion"] as const).flatMap((buildingKind) =>
    (["1", "2", "3"] as const).map((layoutGroup) => {
      const buildingLabel = rentBuildingLabels[buildingKind];
      const layoutLabel = LAYOUT_GROUP_LABELS[layoutGroup];
      const segments = [buildingKind, layoutGroup];
      return {
        transactionType: "rent" as const,
        segments,
        key: `rent/${segments.join("/")}`,
        href: `/rent/${segments.join("/")}`,
        title: `${buildingLabel} ${layoutLabel}`,
        hubLabel: buildingLabel,
        description: rentBuildingDescriptions[buildingKind],
        rent: { buildingKind, layoutGroup },
      };
    }),
  ),
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
  return rentCategories.filter((category) => !category.rent?.layoutGroup);
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

  if (category.rent?.layoutGroup) {
    const parent = resolveCategory("rent", [category.rent.buildingKind]);
    return [
      hub,
      {
        label: parent?.title ?? category.title,
        href: parent?.href,
      },
      {
        label: LAYOUT_GROUP_LABELS[category.rent.layoutGroup],
        href: category.href,
      },
    ];
  }

  return [hub, { label: category.title, href: category.href }];
}
