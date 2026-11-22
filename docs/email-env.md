# お問い合わせメールの環境変数

値の見本は `.env.example`。実際のキーとアドレスは Git に置かない。

## 環境の区別

| 画面 | 環境 | 値の記載場所 |
| --- | --- | --- |
| `localhost` | 開発 | リポジトリ直下の `.env.local` |
| `*.vercel.app` のプレビュー URL | Preview | Vercel の Environment Variables で **Preview** |
| 本番として割り当てた URL | Production | Vercel の Environment Variables で **Production** |

Vercel へデプロイしただけでは、すべてが本番ではない。Production にチェックしたデプロイだけが本番。ブランチのプレビュー URL は Preview で、受信先は開発と同じ Gmail にしておく。

`.env.local` は Vercel にはアップロードされない。本番の値は Vercel の画面に別途入れる。

## 記載するキー

| キー | 開発（`.env.local`） | Preview | Production |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Resend の API キー | 同じキー | 同じキー |
| `CONTACT_TO_EMAIL` | Resend 登録の Gmail | 同じ Gmail | 会社の受信アドレス |
| `CONTACT_FROM_EMAIL` | 空欄（`onboarding@resend.dev` になる） | 空欄 | 独自ドメインを Resend で検証したあと、その差出人 |

現行サイトの差出人は `webmaster@taiyo-f.net`。会社がその箱で問い合わせを読むなら、Production の `CONTACT_TO_EMAIL` にこのアドレスを書く。`CONTACT_FROM_EMAIL` は、Resend で `taiyo-f.net` の検証が終わるまで空欄のままにする。メールサーバー契約を残しても、Resend がそのアドレスから送る許可にはならない。

## 独自ドメインを足す前の制約

差出人が `onboarding@resend.dev` の間、Resend は登録したメールアドレス以外へ送れない。Production の `CONTACT_TO_EMAIL` を会社アドレスにしても、ドメイン検証が終わるまでは届かない。

会社アドレスで受け取る手順は次のとおり。

1. Resend に `taiyo-f.net` を追加し、表示された DNS レコードを現行ドメインの管理画面へ入れる。メールの MX は変えない。
2. 検証が終わってから、Vercel の Production に `CONTACT_FROM_EMAIL`（検証済みの差出人）と `CONTACT_TO_EMAIL`（会社の受信アドレス）を入れる。
3. 保存後、再デプロイする。環境変数はデプロイの時点で読み込まれる。

## Vercel での入力場所

Project → Settings → Environment Variables。

各キーを追加するとき、適用先のチェックを分ける。

- Preview にだけ Gmail の `CONTACT_TO_EMAIL`
- Production にだけ会社アドレスの `CONTACT_TO_EMAIL`
- `RESEND_API_KEY` は Preview と Production の両方
