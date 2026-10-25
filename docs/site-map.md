# サイトマップ構成方針（案）

正本のステータス管理は `docs/decisions.md` に集約する。本ファイルは URL ツリーと設計意図の読み物。

## 1. 全体像

```
/                          … トップ（未実装・別途決定）
│
├─ /rent                   … 賃貸トップ（ハブ）
│   ├─ /rent/apartment/1   … アパート 1K・1DK・1LDK
│   ├─ /rent/apartment/2   … アパート 2K・2DK・2LDK
│   ├─ /rent/apartment/3   … アパート 3K・3DK・3LDK
│   ├─ /rent/mansion/1     … マンション 1K・1DK・1LDK
│   ├─ /rent/mansion/2     … マンション 2K・2DK・2LDK
│   ├─ /rent/mansion/3     … マンション 3K・3DK・3LDK
│   ├─ /rent/house         … 戸建住宅
│   └─ /rent/store-warehouse … 店舗・倉庫
│
├─ /deal                   … 売買トップ（ハブ）
│   ├─ /deal/land          … 土地
│   └─ /deal/house-mansion … 戸建・マンション
│
├─ /properties/[slug]      … 物件詳細（賃貸・売買共通）
│
├─ /company                … 会社案内（実装済）
├─ /infos                  … 店舗からのお知らせ一覧（実装済）
├─ /infos/[slug]           … お知らせ詳細（実装済）
├─ /contact                … お問い合わせ（単一ページ・未実装）
├─ /privacy-policy         … プライバシーポリシー（単一ページ・未実装）
└─ /sitemap                … HTML サイトマップ（公開前にリンク一覧の簡易版・未実装）
```

旧案の `/123456` や `/info` は採用しない。物件詳細は **`/properties/[slug]`**、お知らせは **`/infos`**。

## 2. レイヤー分け（方針の核）

| レイヤー | 役割 | URL の例 |
| --- | --- | --- |
| **ハブ** | 賃貸/売買の入口。カテゴリへの導線 | `/rent`, `/deal` |
| **カテゴリ一覧** | サイトマップ上の「小分類」。固定の意味を持つ | `/rent/apartment/1` など |
| **物件詳細** | 1 物件 1 URL。賃貸/売買で URL 形式を共通化 | `/properties/ocean-view-101` |
| **静的コンテンツ** | 更新頻度が低い固定ページ | `/company`, `/contact` など |
| **CMS 記事** | お知らせなど | `/infos`, `/infos/[slug]` |

**カテゴリ URL と絞り込み URL を分ける。**

- **パス** … ナビ・フッター・旧サイトからの導線で使う「公式の入口」。サイトマップ案のツリーはここに対応する。
- **クエリ（将来）** … 家賃帯・エリア・こだわり条件など、UI 上の追加絞り込み。例: `/rent/apartment/1?maxRent=80000&area=north`
- カテゴリページを開いた状態を **共有可能な URL** として残しつつ、細かい条件はクエリで足す想定。

フィルタ UI・CMS フィールドが固まるまでは、カテゴリ一覧は「その分類に属する物件を並べる」最小実装から始める。

## 3. カテゴリパスの意味（賃貸）

| パス | 意味（データ上の条件イメージ） |
| --- | --- |
| `/rent/apartment/{1\|2\|3}` | 建物種別=アパート、間取りグループ=1/2/3 |
| `/rent/mansion/{1\|2\|3}` | 建物種別=マンション、間取りグループ=1/2/3 |
| `/rent/house` | 建物種別=戸建 |
| `/rent/store-warehouse` | 建物種別=店舗・倉庫 |

`{1|2|3}` は **1K・1DK・1LDK をまとめる** など、サイトマップ表記どおりの「表示用グループ」。CMS では `layoutGroup: "1" | "2" | "3"` のような enum と、実際の間取り文字列（`1LDK` 等）を分けて持つ想定。

## 4. カテゴリパスの意味（売買）

| パス | 意味 |
| --- | --- |
| `/deal/land` | 取引=売買、種別=土地 |
| `/deal/house-mansion` | 取引=売買、種別=戸建またはマンション |

売買側は賃貸より枝が少ない。将来「投資用」などが増えたら `/deal/...` を追加する。

## 5. 物件詳細 `/properties/[slug]`

- **賃貸・売買で URL 形式を 1 つに統一**する。slug は CMS で一意（物件名ベース＋重複時は suffix）。
- 詳細ページ内で取引種別（賃貸/売買）・カテゴリを表示し、パンくずで「賃貸 > アパート > 1K… > 物件名」のように **元カテゴリへ戻れる** ようにする。
- 実装時は `transactionType: "rent" | "deal"` と `categoryPath`（または分解フィールド）を物件レコードに持たせ、一覧・詳細・パンくずで共用する。

`/rent/.../some-slug` のように取引種別を詳細 URL に含めない理由: 同じ物件 ID の表記ゆれを防ぎ、外部共有・検索コンソール上の正規 URL を 1 本にできる。

## 6. App Router 上の置き方（実装方針・仮）

フィルタ仕様が未確定の間は、**一覧 UI を 1 系統にまとめる** ことを優先する。

```
app/
  rent/
    page.tsx                    … /rent
    [[...category]]/page.tsx    … /rent/apartment/1 等（catch-all・仮）
  deal/
    page.tsx                    … /deal
    [[...category]]/page.tsx    … /deal/land 等
  properties/
    [slug]/page.tsx             … 物件詳細
```

- 許可する `category` の組み合わせは **定数テーブル**（`lib/property-routes.ts` 等）でホワイトリスト化し、未定義パスは 404。
- カテゴリ定義（ラベル・パンくず・フィルタ条件）も同じテーブルから生成し、サイトマップ追加時に 1 箇所だけ直す。

個別に `app/rent/apartment/[size]/page.tsx` を量産する方式も可能だが、一覧 UI が同じなら catch-all + 定数テーブルの方が変更に強い。

## 7. 静的ページ・お知らせ

| パス | 備考 |
| --- | --- |
| `/company` | 実装済 |
| `/infos`, `/infos/[slug]` | 実装済 |
| `/contact` | フォーム or 連絡先。単一ページ |
| `/privacy-policy` | 条文。単一ページ |
| `/sitemap` | **HTML 用**。公開前に主要ページへのリンク一覧だけの簡易版を作る。`sitemap.xml`（機械用）は別途 Next の metadata 等で足せる |

## 8. あえて今決めないこと

- 一覧の並び順（新着・家賃順・おすすめ）
- クエリパラメータの名前と UI（エリア、家賃、敷金、設備タグ等）
- microCMS の API 型・フィールド名
- トップ `/` のワイヤーと物件の見せ方
- 旧サイト URL からの 301 対応表

これらはカテゴリ URL ツリーと `/properties/[slug]` が固定されたあと、プロトタイプと CMS 設計で詰める。

## 9. 次の実装順（提案）

1. `lib/property-routes.ts` … カテゴリ定義とバリデーション
2. `/rent`, `/deal` … ハブ（カテゴリリンクのみで可）
3. 賃貸カテゴリ 1 本（例: `/rent/apartment/1`）＋サンプル物件数件
4. `/properties/[slug]` … 詳細
5. 残りカテゴリを定数追加で展開
6. `/contact`, `/privacy-policy`
