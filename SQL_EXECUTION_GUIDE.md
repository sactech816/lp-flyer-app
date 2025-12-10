# 🚀 お知らせ機能 SQL実行ガイド

## ⚠️ エラーが出ている方へ

「`column "service_type" does not exist`」エラーが出る場合は、このガイドに従ってください。

---

## 📋 実行手順（3ステップ）

### ステップ1: 現在の状態を確認

1. Supabaseダッシュボードを開く
2. 左メニュー > **SQL Editor** をクリック
3. **New query** をクリック
4. 以下のファイルの内容をコピー＆ペースト:

```
check_announcements_table.sql
```

5. **Run** をクリック

**結果の見方:**
- ✅ 「テーブルは存在しません」→ ステップ2へ進む
- ⚠️ 「テーブルは既に存在します」→ ステップ2へ進む（既存データは削除されます）

---

### ステップ2: クリーンインストールを実行

1. SQL Editorで **New query** をクリック
2. 以下のファイルの内容を**全て**コピー＆ペースト:

```
supabase_announcements_setup_clean.sql
```

3. **Run** をクリック

**重要:**
- このSQLは既存の `announcements` テーブルを削除してから再作成します
- 既存データがある場合は削除されます（注意！）

**実行結果:**
```
✅ セットアップ完了！
sample_data_count: 4
next_step: Table Editor で announcements テーブルを確認してください
```

このメッセージが表示されれば成功です！

---

### ステップ3: テーブルの確認

1. 左メニュー > **Table Editor** をクリック
2. テーブル一覧から **announcements** を探す
3. クリックして開く

**確認ポイント:**
- ✅ `service_type` カラムが存在する
- ✅ 4件のサンプルデータが挿入されている
- ✅ カラムは全部で10個ある

---

## 🎯 実行後の動作確認

### 1. アプリをリロード
ブラウザでアプリケーションをリロードしてください。

### 2. お知らせページにアクセス
1. 管理者アカウントでログイン（`info@kei-sho.co.jp`）
2. ヘッダーの「お知らせ」をクリック
3. 4件のサンプルお知らせが表示されることを確認

### 3. お知らせを作成
1. 「新規作成」ボタンをクリック
2. フォームに入力:
   - サービス区分: プロフィールLPメーカー
   - タイトル: テスト投稿
   - 本文: これはテストです
3. 「作成する」ボタンをクリック

**期待される結果:**
- ✅ 「お知らせを作成しました」メッセージが表示される
- ✅ リストに新しいお知らせが追加される
- ❌ エラーが出ない

---

## 🐛 それでもエラーが出る場合

### エラー1: 「permission denied」
**原因:** 管理者権限がない  
**解決策:** `info@kei-sho.co.jp` でログインしているか確認

### エラー2: 「relation "announcements" already exists」
**原因:** テーブルが既に存在する  
**解決策:** 
1. `check_announcements_table.sql` を実行して状態確認
2. `supabase_announcements_setup_clean.sql` の1行目を確認:
   ```sql
   DROP TABLE IF EXISTS announcements CASCADE;
   ```
   この行が実行されているか確認

### エラー3: 「could not find the 'service_type' column」（アプリ側）
**原因:** ブラウザのキャッシュが古い  
**解決策:**
1. ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
2. アプリをリロード（Ctrl+F5）
3. 開発サーバーを再起動:
   ```bash
   # ターミナルで Ctrl+C で停止
   npm run dev
   ```

### エラー4: SQLが途中で止まる
**原因:** SQL全体がコピーされていない  
**解決策:**
1. `supabase_announcements_setup_clean.sql` を開く
2. **Ctrl+A** で全選択
3. **Ctrl+C** でコピー
4. SQL Editorに貼り付け
5. 最後の行まで貼り付けられているか確認

---

## 📊 ファイル一覧と用途

| ファイル名 | 用途 | いつ使う？ |
|-----------|------|----------|
| `check_announcements_table.sql` | 現在の状態確認 | エラーが出る前に実行 |
| `supabase_announcements_setup_clean.sql` | クリーンインストール | **これを実行してください！** |
| `supabase_announcements_setup.sql` | 通常版（修正済み） | 初回セットアップ時 |
| `supabase_announcements_setup_step_by_step.sql` | 段階的実行版 | 使用非推奨（エラーが出る） |

---

## ✅ 成功の確認方法

以下が全て ✅ になれば成功です:

- [ ] SQL実行時に「✅ セットアップ完了！」が表示された
- [ ] Table Editor で `announcements` テーブルが見える
- [ ] `service_type` カラムが存在する
- [ ] 4件のサンプルデータが表示される
- [ ] アプリのお知らせページでサンプルが表示される
- [ ] お知らせを新規作成できる
- [ ] エラーメッセージが出ない

---

## 🆘 サポート

上記の手順で解決しない場合:

1. SQL実行時のエラーメッセージ全文をコピー
2. `check_announcements_table.sql` の実行結果をコピー
3. 開発チームに連絡

---

**最終更新:** 2025年12月10日  
**推奨実行ファイル:** `supabase_announcements_setup_clean.sql`

