# Vercelビルドエラー修正ガイド

## 問題の概要

Vercelでのビルド時に以下のエラーが発生していました:

```
Error: Neither apiKey nor config.authenticator provided
❌ Stripe API Key is missing!
Error: Command "npm run build" exited with 1
```

これは、ビルド時にStripe APIキーが環境変数として設定されていないため、Stripeの初期化に失敗していることが原因です。

## 実施した修正

### 1. Stripe初期化の修正

以下のファイルでStripeの初期化方法を修正しました:

- `app/api/business-checkout/route.js`
- `app/api/business-verify/route.js`
- `app/api/checkout-profile/route.js`
- `app/api/verify-profile/route.js`
- `app/api/checkout/route.js`
- `app/api/verify/route.js`

#### 修正前:
```javascript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

#### 修正後:
```javascript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
});
```

### 2. ランタイムチェックの追加

各APIルートのPOSTハンドラーの先頭に、環境変数のチェックを追加しました:

```javascript
export async function POST(request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Stripe API Key is missing!');
      return NextResponse.json(
        { error: 'Payment system is not configured' },
        { status: 500 }
      );
    }
    // ... 残りの処理
  }
}
```

## Vercelでの環境変数設定

### 必須の環境変数

Vercelダッシュボードで以下の環境変数を設定してください:

1. **Vercelダッシュボード** にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables** に移動
4. 以下の環境変数を追加:

#### Stripe関連
```
STRIPE_SECRET_KEY=sk_test_xxxxx (テスト環境) または sk_live_xxxxx (本番環境)
```

#### Supabase関連
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### OpenAI関連
```
OPENAI_API_KEY=sk-xxxxx
```

#### サイトURL
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 環境変数の適用範囲

各環境変数に対して、以下の環境を選択してください:

- **Production**: 本番環境用
- **Preview**: プレビュー環境用（プルリクエストなど）
- **Development**: 開発環境用

通常は、すべての環境にチェックを入れることをお勧めします。

## 再デプロイ

環境変数を設定した後、以下の手順で再デプロイしてください:

1. **Deployments** タブに移動
2. 最新のデプロイメントの右側にある **...** メニューをクリック
3. **Redeploy** を選択

または、新しいコミットをプッシュすることで自動的に再デプロイされます。

## 確認方法

デプロイが成功したら、以下を確認してください:

1. ビルドログに `✓ Compiled successfully` が表示されること
2. Stripeエラーが表示されないこと
3. アプリケーションが正常に動作すること

## トラブルシューティング

### ビルドは成功するが、実行時にエラーが発生する場合

環境変数が正しく設定されているか確認してください:

```javascript
// app/api/check-env/route.js を作成して確認
export async function GET() {
  return Response.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
  });
}
```

### Stripe APIバージョンについて

Stripe APIバージョン `2024-12-18.acacia` を指定しています。これは最新の安定版です。
必要に応じて、Stripeダッシュボードで使用しているAPIバージョンに合わせて変更してください。

## セキュリティ上の注意

- **絶対に** `STRIPE_SECRET_KEY` をクライアントサイドのコードに含めないでください
- **絶対に** `SUPABASE_SERVICE_ROLE_KEY` をクライアントサイドのコードに含めないでください
- 環境変数は `.env.local` ファイルに保存し、`.gitignore` に含めてください
- GitHubなどのリポジトリには環境変数をコミットしないでください

## 参考資料

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)


