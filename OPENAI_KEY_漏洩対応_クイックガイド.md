# OpenAI APIキー漏洩対応 - クイックガイド

## 🚨 今すぐやること（5分以内）

### 1. OpenAI APIキーを無効化

```
1. https://platform.openai.com/api-keys にアクセス
2. 漏洩したキーを見つけて「Revoke」をクリック
3. 新しいキーを発行して安全な場所にコピー
```

### 2. 環境変数を更新

#### ローカル環境（`.env.local`ファイル）

```env
# ❌ 削除または変更
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-old-key

# ✅ 新しく追加（NEXT_PUBLIC_を削除）
OPENAI_API_KEY=sk-proj-new-key
```

#### Vercel（本番環境）

```
1. https://vercel.com/dashboard → プロジェクトを選択
2. Settings → Environment Variables
3. NEXT_PUBLIC_OPENAI_API_KEY を削除
4. OPENAI_API_KEY を追加（新しいキーを設定）
5. Deployments → 最新のデプロイ → Redeploy
```

---

## 📝 コード修正（すでに完了）

以下のファイルが修正されました:

1. ✅ `app/api/generate-profile/route.js` - サーバーサイドのみでAPIキーを使用
2. ✅ `components/Editor.jsx` - フロントエンドから直接OpenAI APIを呼び出さない
3. ✅ `app/api/generate-quiz/route.js` - 新しいサーバーサイドAPIルート

---

## ✅ 動作確認

### ローカル環境

```bash
# 開発サーバーを再起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
# AI生成機能をテスト
```

### ブラウザの開発者ツール（F12）

```
1. Console タブ: APIキーが表示されていないことを確認
2. Network タブ: api.openai.com への直接リクエストがないことを確認
```

---

## 📋 チェックリスト

- [ ] OpenAIで古いAPIキーを無効化
- [ ] 新しいAPIキーを発行
- [ ] `.env.local`を更新（`OPENAI_API_KEY`のみ）
- [ ] Vercelの環境変数を更新
- [ ] `NEXT_PUBLIC_OPENAI_API_KEY`を削除（ローカル・Vercel）
- [ ] 開発サーバーを再起動
- [ ] Vercelで再デプロイ
- [ ] ローカルで動作確認
- [ ] 本番環境で動作確認

---

## 🔍 Git履歴のクリーンアップ（オプション）

APIキーがGitにコミットされている場合:

```bash
# 簡単な方法（BFG使用）
echo "sk-proj-old-key" > passwords.txt
bfg --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force --all
del passwords.txt
```

詳細は `GIT_HISTORY_CLEANUP.md` を参照してください。

---

## 🆘 トラブルシューティング

### エラー: "OpenAI APIキーが設定されていません"

```bash
# 環境変数を確認
cat .env.local | grep OPENAI

# 開発サーバーを再起動
# Ctrl+C で停止 → npm run dev で起動
```

### Vercelで反映されない

```bash
# 再デプロイが必要
Vercel Dashboard → Deployments → Redeploy
```

---

## 📞 サポート

詳細なガイド:
- `OPENAI_KEY_SECURITY_GUIDE.md` - 完全な手順書
- `GIT_HISTORY_CLEANUP.md` - Git履歴のクリーンアップ方法

問題が解決しない場合:
- OpenAIサポート: https://help.openai.com/
- Vercelサポート: https://vercel.com/support

