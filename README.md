This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📚 ドキュメント

ビジネスLPメーカーの開発ガイドは以下を参照してください：

- **[ドキュメント索引](BUSINESS_LP_DOCS_INDEX.md)** - まずここから開始
- [統合ガイド](BUSINESS_LP_INTEGRATION_GUIDE.md) - プロジェクト全体の技術ガイド
- [URLチェックリスト](BUSINESS_LP_URL_CHECKLIST.md) - 実装前後の検証ツール
- [コード例集](BUSINESS_LP_CODE_EXAMPLES.md) - すぐに使える実装例

### 開発フロー推奨
1. **実装前**: INTEGRATION_GUIDE.mdの該当セクションを確認
2. **実装中**: CODE_EXAMPLES.mdを参照
3. **実装後**: URL_CHECKLIST.mdで検証

---

## 環境変数の設定

プロジェクトを実行する前に、`.env.local`ファイルをプロジェクトのルートディレクトリに作成し、以下の環境変数を設定してください：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe（決済機能を使用する場合）
STRIPE_SECRET_KEY=sk_test_... または sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... または pk_live_...

# サイトURL（決済のリダイレクト先・SEO用）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Googleスプレッドシート連携（オプション・管理者機能）
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

これらの値は、Supabaseダッシュボードの **Settings > API** から取得できます。

## Supabaseデータベースのセットアップ

プロジェクトを実行する前に、以下のSQLファイルをSupabaseダッシュボードで実行してください：

1. **アナリティクステーブルの作成**
   - `supabase_analytics_setup.sql` をSupabaseダッシュボードの **SQL Editor** で実行

2. **featured_on_topカラムの追加**
   - `add_featured_on_top_column.sql` をSupabaseダッシュボードの **SQL Editor** で実行
   - このカラムは、プロフィールをトップページに掲載するかどうかを制御します

3. **購入履歴テーブルの作成（決済機能を使用する場合）**
   - `supabase_profile_purchases_setup.sql` をSupabaseダッシュボードの **SQL Editor** で実行
   - このテーブルは、Pro機能（HTML・埋め込み）の購入履歴を管理します

## 決済システム（Stripe連携）

このプロジェクトには、Stripeを使用した決済システムが実装されています。

### 機能概要
- プロフィールLPのPro機能（HTMLダウンロード・埋め込みコード）を寄付・応援により開放
- 価格：500円〜50,000円（ユーザーが自由に設定可能）
- 決済完了後、自動的に購入履歴を記録

### セットアップ手順
1. Stripeアカウントを作成（https://stripe.com/）
2. `.env.local`にStripe APIキーを設定
3. `supabase_profile_purchases_setup.sql`を実行してデータベーステーブルを作成
4. テストモードで決済フローを確認

### 詳細ドキュメント
- `PAYMENT_SYSTEM_MIGRATION_GUIDE.md` - 決済システムの詳細な実装ガイド
- テスト手順、トラブルシューティング、カスタマイズ方法などを記載

## 管理者機能：ユーザー情報エクスポート

管理者アカウントでログインすると、全ユーザーの情報をエクスポートできる機能が利用できます。

### 機能概要
- **CSVダウンロード**: 全ユーザー情報をCSV形式でダウンロード
- **Googleスプレッドシート連携**: ユーザー情報を自動的にGoogleスプレッドシートに送信

### エクスポートされる情報
- ユーザーID
- メールアドレス
- 登録日時
- 最終ログイン日時
- メール確認日時
- プロフィール作成数
- 購入数

### セットアップ
1. **CSVダウンロード**: 追加設定不要（管理者としてログインするだけで利用可能）
2. **Googleスプレッドシート連携**: `GOOGLE_SHEETS_SETUP.md` を参照して設定

詳細な設定手順は `GOOGLE_SHEETS_SETUP.md` をご覧ください。

## SEO対策

このプロジェクトには、Google検索やAI検索エンジンに最適化されたSEO対策が実装されています。

### 実装内容
- **メタタグ最適化**: タイトル、説明文、キーワードを最適化
- **構造化データ**: Schema.org準拠のJSON-LD実装
- **sitemap.xml**: 自動生成されるサイトマップ
- **robots.txt**: 検索エンジンのクロール設定
- **OGP対応**: SNSシェア時の表示最適化
- **コンテンツSEO**: 競合キーワード（litlink、profu.link、POTOFU）を含む自然な文章

### 主要キーワード
- プロフィールリンク
- SNSまとめ
- プロフィール作成
- リンクまとめ
- 無料プロフィール
- litlink 代替
- profu.link
- POTOFU

### セットアップ
1. `.env.local`に`NEXT_PUBLIC_SITE_URL`を設定（必須）
2. Google Search Consoleにサイトを登録
3. サイトマップを送信: `https://your-domain.com/sitemap.xml`

詳細は `SEO_IMPLEMENTATION_GUIDE.md` をご覧ください。

## Supabaseメールテンプレートの設定

新規アカウント作成時の認証メールを正しく設定するため、以下の手順でSupabaseダッシュボードからメールテンプレートを設定してください：

1. Supabaseダッシュボードにログイン
2. **Authentication** → **Email Templates** に移動
3. **Confirm signup** テンプレートを選択
4. 以下のように適切な内容に変更してください：

**件名の例:**
```
【診断クイズメーカー】メールアドレスの確認
```

**本文の例:**
```html
<h2>診断クイズメーカーへようこそ！</h2>
<p>アカウント登録ありがとうございます。</p>
<p>以下のボタンをクリックして、メールアドレスの確認を完了してください：</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 8px;">メールアドレスを確認する</a></p>
<p>このリンクは24時間有効です。</p>
<p>もしこのメールに心当たりがない場合は、無視していただいて結構です。</p>
```

5. **Save** をクリックして保存

### 注意事項
- `{{ .ConfirmationURL }}` は必ず含めてください（これが認証リンクになります）
- メールの内容は、アプリケーションの目的（診断クイズの作成）に合わせて記述してください
- 診断クイズのロジックなど、無関係な内容は削除してください

## Getting Started

環境変数を設定した後、開発サーバーを起動します:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
