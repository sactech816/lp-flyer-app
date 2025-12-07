-- アナリティクステーブルの作成
-- Supabaseのダッシュボードで実行してください

-- 既存のテーブルを削除（必要な場合）
-- DROP TABLE IF EXISTS analytics;

-- アナリティクステーブルの作成
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'scroll', 'time', 'read')),
  event_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON analytics(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);

-- RLS（Row Level Security）ポリシーの設定
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能（アナリティクスの表示用）
CREATE POLICY IF NOT EXISTS "Anyone can read analytics"
  ON analytics
  FOR SELECT
  USING (true);

-- 全ユーザーが挿入可能（トラッキング用）
CREATE POLICY IF NOT EXISTS "Anyone can insert analytics"
  ON analytics
  FOR INSERT
  WITH CHECK (true);

-- プロフィール所有者のみが削除可能
CREATE POLICY IF NOT EXISTS "Profile owner can delete analytics"
  ON analytics
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- コメント追加
COMMENT ON TABLE analytics IS 'プロフィールページのアナリティクスデータ';
COMMENT ON COLUMN analytics.profile_id IS '対象プロフィールのID';
COMMENT ON COLUMN analytics.event_type IS 'イベントタイプ: view(閲覧), click(クリック), scroll(スクロール), time(滞在時間), read(精読)';
COMMENT ON COLUMN analytics.event_data IS 'イベントの詳細データ（JSON形式）';
COMMENT ON COLUMN analytics.created_at IS 'イベント発生日時';

