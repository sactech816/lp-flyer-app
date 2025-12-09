# アナリティクスが表示されない問題のデバッグガイド

## 問題の症状
ダッシュボードで以下の項目が0のまま表示される：
- アクセス数
- クリック数
- クリック率
- 精読率
- 滞在時間

## 原因の確認手順

### 1. ブラウザのコンソールログを確認

1. プロフィールページ（`/p/あなたのslug`）を開く
2. ブラウザの開発者ツール（F12キー）を開く
3. Consoleタブを選択
4. 以下のようなログが表示されるか確認：

```
[ProfileViewTracker] Initializing for profile: xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
[ProfileViewTracker] View tracked: { success: true, data: [...] }
```

**エラーが表示される場合：**
- `[Analytics] Save error:` → Supabaseの設定に問題があります
- `Invalid profile ID format` → プロフィールIDがUUID形式ではありません
- `Database not available` → Supabase接続に問題があります

### 2. Supabaseでanalyticsテーブルを確認

1. [Supabaseダッシュボード](https://app.supabase.com)にログイン
2. プロジェクトを選択
3. 左側メニューから「Table Editor」を選択
4. `analytics`テーブルを探す

**テーブルが存在しない場合：**
→ `supabase_analytics_setup.sql`を実行してください

**テーブルは存在するがデータが0件の場合：**
→ RLSポリシーに問題がある可能性があります

### 3. content_typeカラムの確認

Supabaseダッシュボードで以下のSQLを実行：

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'analytics'
ORDER BY ordinal_position;
```

**`content_type`カラムが存在しない場合：**
→ `migrate_analytics_add_content_type.sql`を実行してください

### 4. RLSポリシーの確認

Supabaseダッシュボードで以下を確認：

1. 左側メニューから「Authentication」→「Policies」を選択
2. `analytics`テーブルのポリシーを確認
3. 以下の2つのポリシーが存在するか確認：
   - `Anyone can read analytics` (SELECT)
   - `Anyone can insert analytics` (INSERT)

**ポリシーが存在しない場合：**
→ `supabase_analytics_setup.sql`を再実行してください

### 5. 環境変数の確認

`.env.local`ファイルに以下が設定されているか確認：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**設定されていない場合：**
1. Supabaseダッシュボードから「Settings」→「API」を開く
2. 「Project URL」と「anon public」キーをコピー
3. `.env.local`に貼り付け
4. アプリケーションを再起動（`npm run dev`）

## 解決手順

### ステップ1: analyticsテーブルの作成

Supabaseダッシュボードの「SQL Editor」で以下を実行：

```sql
-- supabase_analytics_setup.sql の内容をコピーして実行
```

または、プロジェクトルートの`supabase_analytics_setup.sql`ファイルの内容を実行してください。

### ステップ2: content_typeカラムの追加

Supabaseダッシュボードの「SQL Editor」で以下を実行：

```sql
-- migrate_analytics_add_content_type.sql の内容をコピーして実行
```

または、プロジェクトルートの`migrate_analytics_add_content_type.sql`ファイルの内容を実行してください。

### ステップ3: アプリケーションの再起動

```bash
# 開発サーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

### ステップ4: 動作確認

1. プロフィールページ（`/p/あなたのslug`）を開く
2. ページをスクロールする
3. リンクをクリックする
4. 30秒以上滞在する
5. ダッシュボードに戻って数値が更新されているか確認

## よくある問題と解決策

### Q1: コンソールに`[Analytics] Save error: permission denied`と表示される

**A:** RLSポリシーが正しく設定されていません。

解決方法：
```sql
-- Supabaseダッシュボードで実行
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read analytics" ON analytics;
DROP POLICY IF EXISTS "Anyone can insert analytics" ON analytics;

CREATE POLICY "Anyone can read analytics"
  ON analytics FOR SELECT USING (true);

CREATE POLICY "Anyone can insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);
```

### Q2: コンソールに`[Analytics] Invalid UUID format`と表示される

**A:** プロフィールIDがUUID形式ではありません。

解決方法：
1. Supabaseダッシュボードの「Table Editor」で`profiles`テーブルを開く
2. `id`カラムがUUID型であることを確認
3. 古いプロフィールを削除して新しく作成する

### Q3: データは記録されているがダッシュボードに表示されない

**A:** `content_type`カラムが存在しないか、値が正しくありません。

解決方法：
```sql
-- Supabaseダッシュボードで実行
-- content_typeカラムを追加
ALTER TABLE analytics 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'profile' 
CHECK (content_type IN ('quiz', 'profile'));

-- 既存のプロフィールLPデータを更新
UPDATE analytics 
SET content_type = 'profile' 
WHERE content_type IS NULL OR content_type = 'quiz';
```

### Q4: デモページ（demo-user）のアクセスがカウントされる

**A:** これは正常な動作です。デモページのアクセスは意図的にカウントされないようになっています。

確認方法：
- コンソールに`[ProfileViewTracker] Skipping demo profile`と表示される
- `profileId === 'demo'`の場合はトラッキングがスキップされる

### Q5: リアルタイムで更新されない

**A:** ダッシュボードは自動更新されません。

解決方法：
- ページをリロード（F5キー）する
- または、ダッシュボードから別のページに移動して戻る

## データベースの直接確認

Supabaseダッシュボードで以下のSQLを実行して、データが正しく記録されているか確認：

```sql
-- 最新の10件のイベントを表示
SELECT 
    id,
    profile_id,
    event_type,
    event_data,
    content_type,
    created_at
FROM analytics
ORDER BY created_at DESC
LIMIT 10;

-- プロフィールごとのイベント集計
SELECT 
    profile_id,
    content_type,
    event_type,
    COUNT(*) as count
FROM analytics
WHERE content_type = 'profile'
GROUP BY profile_id, content_type, event_type
ORDER BY profile_id, event_type;

-- 特定のプロフィールのアナリティクスを確認
SELECT 
    event_type,
    event_data,
    created_at
FROM analytics
WHERE profile_id = 'あなたのプロフィールID'
  AND content_type = 'profile'
ORDER BY created_at DESC;
```

## サポート

上記の手順で解決しない場合は、以下の情報を添えてお問い合わせください：

1. ブラウザのコンソールログ（エラーメッセージ）
2. Supabaseのテーブル構造（上記のSQLの実行結果）
3. 環境変数が正しく設定されているか
4. 使用しているブラウザとバージョン


