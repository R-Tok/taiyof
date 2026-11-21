/** お問い合わせページの固定文言（現行 contact/index.php より） */
export const CONTACT_PAGE = {
  title: "物件お問い合わせ",
  intro:
    "当ホームページに掲載されている物件に関してのお問い合わせは、電話・お問い合わせフォームよりお願い致します。お問い合わせフォームの場合、追って当社担当よりご連絡をさせていただきます。ホームページに掲載されていない物件に関しても、お客様のご希望の物件をお探ししますので、お客様のご要望を「お問い合わせ内容」にご記入し送信して下さい。当社からご希望にピッタリな物件を紹介いたします。また、物件の買取査定をご希望の方は、「お問い合わせ内容」にお持ちの物件情報をご記入いただければ、当社より詳細のご連絡をさせて頂きます。",
  phone: "025-524-7651",
  phoneDisplay: "025-524-7651",
  submitNote:
    "開発中の差出人は onboarding@resend.dev です。届く宛先は .env.local の CONTACT_TO_EMAIL で、独自ドメインを追加するまでは Resend に登録したメールアドレスだけです。",
} as const;

/** 現行 site の contact/index.php?param= 互換 */
export function buildPropertyInquiryHref(propertyName: string): string {
  return `/contact?param=${encodeURIComponent(propertyName)}`;
}

export function parseInquiryPropertyParam(
  param: string | string[] | undefined,
): string {
  if (typeof param === "string") {
    return param;
  }
  if (Array.isArray(param)) {
    return param[0] ?? "";
  }
  return "";
}
