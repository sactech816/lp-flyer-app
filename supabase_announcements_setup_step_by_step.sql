-- ========================================
-- お知らせ機能のデータベーステーブル作成
-- 段階的実行版（エラーが出た場合はこちらを使用）
-- ========================================

-- ステップ1: 既存のテーブルを削除（必要な場合のみ）
-- 注意: 既存データが削除されます！
-- DROP TABLE IF EXISTS announcements CASCADE;

-- ステップ2: テーブルの作成（制約なし）
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL DEFAULT 'profile',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  link_url TEXT,
  link_text TEXT,
  is_active BOOLEAN DEFAULT true,
  announcement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ステップ3: 制約の追加
ALTER TABLE announcements 
ADD CONSTRAINT service_type_check 
CHECK (service_type IN ('quiz', 'profile', 'all'));

-- ステップ4: インデックスの作成
CREATE INDEX IF NOT EXISTS idx_announcements_service_type ON announcements(service_type);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(announcement_date DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

-- ステップ5: RLS（Row Level Security）を有効化
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ステップ6: 既存のポリシーを削除（再実行時のエラー防止）
DROP POLICY IF EXISTS "Anyone can read active announcements" ON announcements;
DROP POLICY IF EXISTS "Admin can read all announcements" ON announcements;
DROP POLICY IF EXISTS "Admin can insert announcements" ON announcements;
DROP POLICY IF EXISTS "Admin can update announcements" ON announcements;
DROP POLICY IF EXISTS "Admin can delete announcements" ON announcements;

-- ステップ7: ポリシーの作成
-- 全ユーザーが表示中のお知らせを閲覧可能
CREATE POLICY "Anyone can read active announcements"
  ON announcements
  FOR SELECT
  USING (is_active = true);

-- 管理者のみが全てのお知らせを閲覧可能
CREATE POLICY "Admin can read all announcements"
  ON announcements
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'info@kei-sho.co.jp'
  );

-- 管理者のみがお知らせを作成可能
CREATE POLICY "Admin can insert announcements"
  ON announcements
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'info@kei-sho.co.jp'
  );

-- 管理者のみがお知らせを更新可能
CREATE POLICY "Admin can update announcements"
  ON announcements
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'info@kei-sho.co.jp'
  );

-- 管理者のみがお知らせを削除可能
CREATE POLICY "Admin can delete announcements"
  ON announcements
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'info@kei-sho.co.jp'
  );

-- ステップ8: トリガー関数の作成
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ステップ9: トリガーの作成
DROP TRIGGER IF EXISTS trigger_announcements_updated_at ON announcements;
CREATE TRIGGER trigger_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();

-- ステップ10: コメントの追加
COMMENT ON TABLE announcements IS 'お知らせ管理テーブル（全サービス共通）';
COMMENT ON COLUMN announcements.id IS 'お知らせの一意識別子';
COMMENT ON COLUMN announcements.service_type IS 'サービス区分（quiz: 診断クイズ, profile: プロフィールLP, all: 全サービス共通）';
COMMENT ON COLUMN announcements.title IS 'お知らせのタイトル';
COMMENT ON COLUMN announcements.content IS 'お知らせの本文';
COMMENT ON COLUMN announcements.link_url IS '詳細リンクURL（任意）';
COMMENT ON COLUMN announcements.link_text IS 'リンクのテキスト（任意）';
COMMENT ON COLUMN announcements.is_active IS '表示状態（true: 表示中, false: 非表示）';
COMMENT ON COLUMN announcements.announcement_date IS 'お知らせの日付';
COMMENT ON COLUMN announcements.created_at IS '作成日時';
COMMENT ON COLUMN announcements.updated_at IS '最終更新日時';

-- ステップ11: サンプルデータの挿入（テスト用）
-- 既存データがある場合はスキップ
INSERT INTO announcements (service_type, title, content, link_url, link_text, is_active, announcement_date)
SELECT 'profile', 'プロフィールLPメーカーをリリースしました！', '誰でも簡単にプロフェッショナルなプロフィールページが作成できるようになりました。ぜひお試しください！', 'https://example.com', '詳細はこちら', true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = 'プロフィールLPメーカーをリリースしました！');

INSERT INTO announcements (service_type, title, content, is_active, announcement_date)
SELECT 'profile', '新機能: アナリティクス機能を追加', 'プロフィールページの閲覧数やクリック率を確認できるようになりました。', true, CURRENT_DATE - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = '新機能: アナリティクス機能を追加');

INSERT INTO announcements (service_type, title, content, is_active, announcement_date)
SELECT 'quiz', '診断クイズメーカーをリリースしました！', 'オリジナルの診断クイズを簡単に作成できるサービスです。', true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = '診断クイズメーカーをリリースしました！');

INSERT INTO announcements (service_type, title, content, is_active, announcement_date)
SELECT 'all', '【重要】メンテナンスのお知らせ', '2025年12月15日 2:00-4:00にシステムメンテナンスを実施します。この間、全サービスがご利用いただけません。', true, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM announcements WHERE title = '【重要】メンテナンスのお知らせ');

-- 完了メッセージ
DO $$
BEGIN
  RAISE NOTICE '✅ お知らせテーブルのセットアップが完了しました！';
  RAISE NOTICE '📊 Table Editor で announcements テーブルを確認してください。';
END $$;

