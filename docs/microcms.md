# microCMS 連携手順

正本のステータスは `docs/decisions.md`。本ファイルは作業手順。

## 決まっていること

- 最初に接続するのは **お知らせ**（`/infos`）。物件は後から。
- API ID はお知らせ `infos`、売買物件 `deal`、賃貸物件 `rent`。
- 詳細 URL は **カスタム `slug` フィールド**。
- キャッシュ + 公開時 Webhook。
- キー未設定時は `lib/` の定数。取得失敗時はエラー画面。
- API キーはクライアントに出さない。

## 環境変数

置く。名前は次でよい。

```
MICROCMS_SERVICE_DOMAIN=your-service-id
MICROCMS_API_KEY=your-api-key
```

| 置く場所 | 用途 |
| --- | --- |
| `.env.local` | 自分のマシン。Git に含めない（`.gitignore` の `.env*` で除外済） |
| `.env.example` | キー名だけの見本。値は空かプレースホルダ |
| 公開先の設定画面 | 本番。Vercel 等の Environment Variables |

- **サービスドメイン** は管理画面 URL の `https://<ここ>.microcms.io` の `<ここ>`。
- **API キー** は「API キー」画面の **GET（コンテンツ参照）** 用。書き込みキーはフロントに置かない。
- **`NEXT_PUBLIC_` を付けない。** 付けるとブラウザにバンドルされ、キーが漏れる。
- 取得は Server Component と `lib/` の関数からのみ。Client Component では `createClient` しない。

## SDK

入れる。`npm install microcms-js-sdk` でよい。クライアント生成は `lib/microcms.ts` 1 箇所にまとめる。

## 推奨する作業順

1. **API ID を `infos` にする**  
   すでに別 ID（例: `news`）なら、管理画面で合わせるかコード側でマッピングする。方針は `infos`。
2. **フィールドをサイトの型に合わせる**  
   いまの `InfoPost`（`lib/info-posts.ts`）に対応させる。
   | 画面で使うもの | microCMS の目安 |
   | --- | --- |
   | slug | テキスト。必須・ユニーク |
   | title | テキスト。必須 |
   | body | リッチエディタ `content`（HTML） |
   | publishedAt | 日時。未設定なら microCMS の `publishedAt` でも可 |
   | image | 画像。任意 |
3. **サンプルを slug 付きで 1〜2 件公開する**
4. **ローカルに `.env.local` を置く**（値は管理画面からコピー）
5. **コード側（お知らせは接続済）**
   - `lib/microcms.ts` … クライアント
   - `lib/info-posts.ts` … CMS 取得 + ローカル定数のマージ
   - `app/infos` / `app/infos/[slug]`
   - 画像フィールド追加時は `next.config.ts` に `images.microcms-assets.io` を許可
   - 再検証用 Route Handler + Webhook は未実装（`cacheTag("infos")` のみ付与済）
6. **売買物件は接続済**（API ID `deal`）。`category` の値で `/deal/land` と `/deal/house-mansion` に振り分ける。詳細 URL は `slug` があればそれを、なければコンテンツ ID。

## 要件メモ（指摘）

要件の骨格は問題ない。次だけ直す。

- 「properties API から物件を取る」は **今の最初の接続先ではない**。先は `infos`。
- 「一覧コンポーネントに渡す」は、ページ（Server Component）で取得 → 既存の表示へ渡す、で足りる。Client で fetch しない。
- 失敗時「適切なエラー」は、空一覧にしない（確定どおりエラー画面）。キー未設定だけローカル定数。
