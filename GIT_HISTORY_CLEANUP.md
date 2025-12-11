# Git履歴からAPIキーを完全に削除する方法

## ⚠️ 警告

この作業は**Git履歴を書き換える**ため、慎重に行ってください。
チームで開発している場合は、必ず他のメンバーに事前通知してください。

---

## 🔍 漏洩したキーがGit履歴に含まれているか確認

### 1. 履歴を検索

```bash
# APIキーの一部を検索（例: sk-proj-）
git log -S "sk-proj-" --all --oneline

# または、特定のファイルの履歴を確認
git log --all --full-history -- .env.local
git log --all --full-history -- .env
```

### 2. 具体的な内容を確認

```bash
# 特定のコミットの内容を表示
git show <commit-hash>
```

---

## 🧹 方法1: BFG Repo-Cleaner（推奨）

最も簡単で安全な方法です。

### インストール

```bash
# Windowsの場合（Chocolateyを使用）
choco install bfg

# または、手動でダウンロード
# https://rtyley.github.io/bfg-repo-cleaner/
```

### 使用方法

```bash
# 1. プロジェクトのバックアップを作成
cd ..
cp -r profile-lp-maker profile-lp-maker-backup

# 2. プロジェクトディレクトリに戻る
cd profile-lp-maker

# 3. 削除したいキーを含むテキストファイルを作成
echo "sk-proj-your-old-api-key-here" > passwords.txt

# 4. BFGで履歴から削除
bfg --replace-text passwords.txt

# 5. Gitのクリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 6. 強制プッシュ（注意: 他の開発者に影響します）
git push --force --all
git push --force --tags

# 7. パスワードファイルを削除
del passwords.txt
```

---

## 🧹 方法2: git filter-branch（上級者向け）

### .env.localファイルを履歴から完全に削除

```bash
# 1. バックアップを作成
cd ..
cp -r profile-lp-maker profile-lp-maker-backup
cd profile-lp-maker

# 2. .env.localを履歴から削除
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 3. .envファイルも削除する場合
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 4. クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. 強制プッシュ
git push --force --all
git push --force --tags
```

---

## 🧹 方法3: git filter-repo（最も推奨される方法）

`git filter-repo`は`filter-branch`の改良版で、より高速で安全です。

### インストール

```bash
# Pythonがインストールされている場合
pip install git-filter-repo
```

### 使用方法

```bash
# 1. バックアップを作成
cd ..
cp -r profile-lp-maker profile-lp-maker-backup
cd profile-lp-maker

# 2. 特定のファイルを履歴から削除
git filter-repo --path .env.local --invert-paths
git filter-repo --path .env --invert-paths

# 3. 特定の文字列を置換
git filter-repo --replace-text <(echo "sk-proj-old-key==>REMOVED")

# 4. 強制プッシュ
git remote add origin <your-repo-url>
git push --force --all
git push --force --tags
```

---

## 📋 完全な手順（推奨フロー）

### ステップ1: 準備

```bash
# 1. すべての変更をコミット
git add .
git commit -m "Backup before cleanup"

# 2. バックアップを作成
cd ..
cp -r profile-lp-maker profile-lp-maker-backup
cd profile-lp-maker

# 3. 他の開発者に通知
# チームメンバーに「Git履歴を書き換えます」と連絡
```

### ステップ2: クリーンアップ実行

```bash
# BFGを使用する場合（推奨）
echo "sk-proj-xxxxx" > passwords.txt
bfg --replace-text passwords.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
del passwords.txt
```

### ステップ3: リモートに反映

```bash
# 強制プッシュ（注意: 他の開発者に影響）
git push --force --all
git push --force --tags
```

### ステップ4: 他の開発者の対応

チームメンバーは以下を実行:

```bash
# 古いリポジトリを削除
cd ..
rm -rf profile-lp-maker

# 新しくクローン
git clone <repository-url>
cd profile-lp-maker
```

---

## ✅ 確認方法

### 1. 履歴にキーが残っていないか確認

```bash
# APIキーを検索
git log -S "sk-proj-" --all --oneline

# 何も表示されなければOK
```

### 2. すべてのブランチとタグを確認

```bash
# すべてのブランチを確認
git log --all --full-history --grep="sk-proj-"

# すべてのファイルを検索
git grep "sk-proj-" $(git rev-list --all)
```

### 3. GitHubの場合: キャッシュをクリア

GitHubにプッシュしている場合、GitHubのキャッシュにも残っている可能性があります。

1. GitHubサポートに連絡: https://support.github.com/
2. 「センシティブデータの削除」をリクエスト
3. または、リポジトリを削除して新規作成

---

## 🚨 重要な注意事項

### 1. 強制プッシュの影響

- **他の開発者のローカルリポジトリが壊れます**
- 事前に必ず通知してください
- チームメンバーは再クローンが必要です

### 2. プルリクエストへの影響

- 既存のプルリクエストが無効になる可能性があります
- マージ前のブランチは再作成が必要です

### 3. CI/CDへの影響

- GitHub Actions、Vercel、その他のCIが失敗する可能性があります
- 再デプロイが必要になる場合があります

### 4. フォークへの影響

- あなたのリポジトリをフォークしている人には影響しません
- フォーク元にも古い履歴が残っている可能性があります

---

## 🔐 今後の予防策

### 1. .gitignoreの確認

`.gitignore`に以下が含まれていることを確認:

```gitignore
# 環境変数
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# APIキー
*.pem
secrets.json
```

### 2. Pre-commitフックの設定

```bash
# .git/hooks/pre-commit を作成
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# APIキーの検出
if git diff --cached | grep -E "sk-proj-|sk-[a-zA-Z0-9]{48}"; then
    echo "エラー: APIキーがコミットに含まれています！"
    exit 1
fi
EOF

# 実行権限を付与
chmod +x .git/hooks/pre-commit
```

### 3. git-secretsの導入

```bash
# インストール（Windowsの場合）
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
./install.ps1

# プロジェクトに設定
cd path/to/profile-lp-maker
git secrets --install
git secrets --register-aws
git secrets --add 'sk-proj-[a-zA-Z0-9]+'
```

### 4. GitHub Secret Scanningの有効化

GitHubのリポジトリ設定で:

1. Settings → Security → Code security and analysis
2. 「Secret scanning」を有効化
3. 「Push protection」を有効化

---

## 📞 トラブルシューティング

### エラー: "Cannot rewrite branches"

```bash
# .git/refs/original を削除
rm -rf .git/refs/original/
# 再試行
```

### エラー: "refusing to update checked out branch"

```bash
# 別のブランチに切り替え
git checkout -b temp-branch
# クリーンアップを実行
# 元のブランチに戻る
git checkout main
git branch -D temp-branch
```

### 強制プッシュが拒否される

```bash
# ブランチ保護を一時的に解除（GitHubの場合）
# Settings → Branches → Branch protection rules
# "Require pull request reviews before merging" を一時的に無効化
```

---

## 📚 参考資料

- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-secrets](https://github.com/awslabs/git-secrets)

