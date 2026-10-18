/**
 * 現行サイトの会社概要テーブルを転記した原稿。
 * https://www.taiyo-f.net/company/index.html#02
 *
 * 業者登録の更新回数は、フッター表記の「（13）」を正とする。
 */
export type CompanyProfileItem = {
  label: string;
  lines: string[];
};

export const companyName = "太陽不動産株式会社";

export const companyProfileItems: CompanyProfileItem[] = [
  { label: "名称", lines: ["太陽不動産株式会社"] },
  { label: "設立", lines: ["昭和47年2月11日"] },
  { label: "代表者", lines: ["代表取締役　徳永　康弘"] },
  {
    label: "所在地",
    lines: [
      "〒943-0827　新潟県上越市栄町7番6号",
      "TEL：025-524-7651",
      "FAX：025-523-7340",
    ],
  },
  {
    label: "営業時間",
    lines: ["8：30～18：30迄　（定休日 年末年始、盆休）"],
  },
  { label: "資本金", lines: ["2,000万円"] },
  {
    label: "業者登録",
    lines: ["宅地建物取引業者　新潟県知事（13）1633"],
  },
  {
    label: "加盟団体",
    lines: [
      "（社）新潟県宅地建物取引業協会",
      "（社）全国宅地建物取引業保証協会",
      "新潟県不動産政治連盟",
      "賃貸不動産管理業協会",
      "（財）不動産流通近代化センター",
      "（社）首都圏不動産公正取引協議会　他",
    ],
  },
  {
    label: "取引銀行",
    lines: ["第四銀行・大光銀行・上越信用金庫"],
  },
  {
    label: "業務内容",
    lines: [
      "宅地・建物取引業",
      "宅地造成業",
      "不動産開発・観光開発事業",
      "前各号に付帯する一切の業務",
    ],
  },
];
