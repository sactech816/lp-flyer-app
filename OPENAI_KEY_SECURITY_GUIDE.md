# OpenAI APIキー漏洩時の対応ガイド

## 🚨 緊急対応手順

### 1. OpenAI APIキーの無効化（最優先）

1. **OpenAIダッシュボードにアクセス**
   - https://platform.openai.com/api-keys にアクセス
   - アカウントにログイン

2. **漏洩したキーを無効化**
   - 該当するAPIキーを見つける
   - 「Revoke」または「Delete」ボタンをクリック
   - 確認ダイアログで「確認」をクリック

3. **新しいAPIキーを発行**
   - 「Create new secret key」ボタンをクリック
   - キーの名前を入力（例: `profile-lp-maker-production`）
   - **重要**: 生成されたキーは一度しか表示されないので、必ずコピーして安全な場所に保存

---

## 🔧 修正内容の説明

### セキュリティ上の問題点（修正前）

1. **`NEXT_PUBLIC_OPENAI_API_KEY`を使用していた**
   - `NEXT_PUBLIC_`プレフィックスの環境変数は、ブラウザ（クライアント側）でも使用可能
   - ブラウザの開発者ツールで簡単に確認できてしまう
   - **誰でもあなたのAPIキーを盗むことができる状態でした**

2. **フロントエンドから直接OpenAI APIを呼び出していた**
   - `components/Editor.jsx`の`handleAiGenerate`関数
   - ブラウザのネットワークタブでAPIキーが見えてしまう

### 修正内容

#### ✅ 修正1: サーバーサイドAPIルートの作成

新しいファイル: `app/api/generate-quiz/route.js`

- フロントエンドからの直接呼び出しを禁止
- サーバー側でのみOpenAI APIを呼び出す
- `OPENAI_API_KEY`（`NEXT_PUBLIC_`なし）のみを使用

#### ✅ 修正2: フロントエンドの修正

`components/Editor.jsx`の`handleAiGenerate`関数を修正:

- OpenAI APIへの直接呼び出しを削除
- 代わりに`/api/generate-quiz`エンドポイントを呼び出す
- APIキーはフロントエンドに一切露出しない

#### ✅ 修正3: 既存APIルートの修正

`app/api/generate-profile/route.js`:

- `NEXT_PUBLIC_OPENAI_API_KEY`のフォールバックを削除
- `OPENAI_API_KEY`のみを使用

---

## 🔐 環境変数の設定方法

### ローカル開発環境

1. **`.env.local`ファイルを作成/編集**

```bash
# プロジェクトのルートディレクトリで実行
notepad .env.local
```

2. **以下の内容を記述**（新しいAPIキーを使用）

```env
# OpenAI API Key（サーバーサイドのみ）
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe設定
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

3. **重要な注意点**
   - ✅ `OPENAI_API_KEY`（`NEXT_PUBLIC_`なし）を使用
   - ❌ `NEXT_PUBLIC_OPENAI_API_KEY`は使用しない
   - `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません

### Vercel（本番環境）

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard
   - 該当するプロジェクトを選択

2. **Settings → Environment Variables に移動**

3. **古い環境変数を削除**
   - `NEXT_PUBLIC_OPENAI_API_KEY`が存在する場合は削除

4. **新しい環境変数を追加**
   - **Name**: `OPENAI_API_KEY`
   - **Value**: 新しく発行したAPIキー（`sk-proj-...`）
   - **Environment**: Production, Preview, Development すべてにチェック
   - 「Save」をクリック

5. **再デプロイ**
   - Deployments タブに移動
   - 最新のデプロイメントの右側の「...」メニューをクリック
   - 「Redeploy」を選択
   - 環境変数の変更を反映させるため、必ず再デプロイが必要

---

## ✅ 動作確認手順

### 1. ローカル環境での確認

```bash
# 開発サーバーを起動
npm run dev
```

1. ブラウザで http://localhost:3000 にアクセス
2. クイズ作成画面に移動
3. 「AIで自動生成」機能を試す
4. エラーが出ないことを確認

### 2. ブラウザの開発者ツールで確認

1. F12キーで開発者ツールを開く
2. 「Console」タブを確認
   - `OPENAI_API_KEY`や`sk-proj-`などの文字列が表示されていないことを確認
3. 「Network」タブを確認
   - `/api/generate-quiz`へのリクエストのみが表示される
   - `api.openai.com`への直接リクエストがないことを確認

### 3. 本番環境での確認

Vercelへの再デプロイ後:

1. 本番URLにアクセス
2. AI生成機能が正常に動作することを確認
3. エラーログを確認（Vercel Dashboard → Logs）

---

## 📋 チェックリスト

- [ ] OpenAIダッシュボードで古いAPIキーを無効化
- [ ] 新しいAPIキーを発行
- [ ] ローカルの`.env.local`を更新（`OPENAI_API_KEY`のみ）
- [ ] Vercelの環境変数を更新（`OPENAI_API_KEY`のみ）
- [ ] `NEXT_PUBLIC_OPENAI_API_KEY`を削除（ローカル・Vercel両方）
- [ ] コードの修正を確認（3ファイル）
- [ ] ローカルで動作確認
- [ ] Vercelで再デプロイ
- [ ] 本番環境で動作確認
- [ ] ブラウザの開発者ツールでAPIキーが露出していないことを確認

---

## 🔍 今後の予防策

### 1. 環境変数の命名規則

- **サーバーサイドのみ**: `VARIABLE_NAME`
- **クライアント側でも使用**: `NEXT_PUBLIC_VARIABLE_NAME`

**重要**: APIキーや秘密情報は絶対に`NEXT_PUBLIC_`を使用しない

### 2. コードレビュー時の確認項目

- [ ] `NEXT_PUBLIC_`プレフィックスが秘密情報に使われていないか
- [ ] フロントエンドから直接外部APIを呼び出していないか
- [ ] APIキーがハードコードされていないか

### 3. 定期的なセキュリティチェック

- 月に1回、環境変数の見直し
- 不要になったAPIキーの削除
- アクセスログの確認（OpenAI Usage Dashboard）

---

## 🆘 トラブルシューティング

### エラー: "OpenAI APIキーが設定されていません"

**原因**: 環境変数が正しく設定されていない

**解決方法**:
1. `.env.local`ファイルに`OPENAI_API_KEY`が存在するか確認
2. Vercelの環境変数に`OPENAI_API_KEY`が設定されているか確認
3. 開発サーバーを再起動（`Ctrl+C`で停止 → `npm run dev`で起動）

### エラー: "API request failed"

**原因**: APIキーが無効、または使用制限に達している

**解決方法**:
1. OpenAIダッシュボードでAPIキーが有効か確認
2. 使用量を確認（https://platform.openai.com/usage）
3. 支払い方法が登録されているか確認

### Vercelで環境変数を変更したのに反映されない

**原因**: 環境変数の変更後に再デプロイが必要

**解決方法**:
1. Vercel Dashboard → Deployments
2. 最新のデプロイメント → 「Redeploy」

---

## 📞 サポート

問題が解決しない場合:

1. **OpenAIサポート**: https://help.openai.com/
2. **Vercelサポート**: https://vercel.com/support
3. **プロジェクトのIssue**: GitHubリポジトリのIssueを作成

---

## 📚 参考資料

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

