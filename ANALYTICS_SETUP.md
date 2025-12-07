# アナリティクス機能セットアップガイド

このドキュメントでは、プロフィールLPメーカーのアナリティクス機能を有効にする手順を説明します。

## 🎯 トラッキング機能

- **アクセス数（ページビュー）**: プロフィールページが表示された回数
- **クリック数**: リンク、ボタン、Kindle本、LINE登録などのクリック数
- **クリック率**: クリック数 ÷ アクセス数 × 100
- **精読率**: ページを50%以上スクロールした割合
- **滞在時間**: ページに滞在した平均時間（秒）

## 📋 セットアップ手順

### 1. Supabaseでデータベーステーブルを作成

1. Supabaseダッシュボード（https://app.supabase.com）にログイン
2. プロジェクトを選択
3. 左側メニューから「SQL Editor」を選択
4. 以下のSQLファイルの内容を実行:

```sql
-- ファイル: supabase_analytics_setup.sql の内容をコピーして実行
```

または、直接以下のコマンドを実行:

```sql
-- アナリティクステーブルの作成
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'scroll', 'time', 'read')),
  event_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);

-- RLSポリシーの設定
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can read analytics"
  ON analytics FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert analytics"
  ON analytics FOR INSERT WITH CHECK (true);
```

### 2. 環境変数の確認

`.env.local` ファイルに以下の環境変数が設定されていることを確認:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. アプリケーションの再起動

```bash
npm run dev
```

## 🧪 動作確認

### 1. コンソールログの確認

1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブを選択
3. プロフィールページを開く
4. 以下のようなログが表示されることを確認:

```
[ProfileViewTracker] Initializing for profile: xxxxx
[ProfileViewTracker] View tracked: { success: true }
[ProfileViewTracker] Scroll milestone tracked: 25
[ProfileViewTracker] Scroll milestone tracked: 50
[LinkClick] Tracking click: https://...
[ProfileViewTracker] Time tracked: 30
```

### 2. Supabaseでデータを確認

1. Supabaseダッシュボードの「Table Editor」を開く
2. `analytics` テーブルを選択
3. データが記録されていることを確認

### 3. ダッシュボードで確認

1. ログインしてダッシュボードに移動
2. プロフィール一覧に以下の情報が表示されることを確認:
   - アクセス数
   - クリック数
   - クリック率
   - 精読率
   - 滞在時間

## 🐛 トラブルシューティング

### アナリティクスが記録されない場合

1. **コンソールエラーを確認**
   - ブラウザの開発者ツールでエラーメッセージを確認
   - `[Analytics]` で始まるログを探す

2. **Supabaseの接続を確認**
   - 環境変数が正しく設定されているか
   - Supabaseプロジェクトが有効か

3. **RLSポリシーを確認**
   - `analytics` テーブルのRLSポリシーが正しく設定されているか
   - Supabaseダッシュボードの「Authentication」→「Policies」で確認

4. **テーブルが存在するか確認**
   - Supabaseダッシュボードの「Table Editor」で `analytics` テーブルが存在するか確認

### データが0のままの場合

1. **実際にプロフィールページにアクセスしているか確認**
   - `/p/[slug]` のURLでアクセスしているか（ダッシュボードではなく）

2. **十分な時間待っているか確認**
   - クリック率や滞在時間は、複数のイベントが記録された後に計算される
   - 最低でも1回のページビューとクリックが必要

3. **ブラウザのキャッシュをクリア**
   - キャッシュが原因で古いコードが実行されている可能性

## 📊 データ構造

### analytics テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー |
| profile_id | UUID | プロフィールID |
| event_type | TEXT | イベントタイプ（view/click/scroll/time/read） |
| event_data | JSONB | イベントの詳細データ |
| created_at | TIMESTAMP | 作成日時 |

### event_data の構造

```json
// view イベント
{}

// click イベント
{
  "url": "https://example.com"
}

// scroll イベント
{
  "scrollDepth": 50  // パーセント
}

// time イベント
{
  "timeSpent": 120  // 秒
}

// read イベント
{
  "readPercentage": 75  // パーセント
}
```

## 🔄 アップデート履歴

- **2025-12-07**: 初版作成、ログ強化、トラッキング改善

