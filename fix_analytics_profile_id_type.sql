-- アナリティクステーブルのprofile_idカラムをTEXT型に変更
-- ビジネスLPではslugを使用するため、UUID型では保存できない問題を修正
-- Supabaseのダッシュボードで実行してください

-- ステップ1: profile_idに依存しているRLSポリシーを削除
DROP POLICY IF EXISTS "Profile owner can delete analytics" ON analytics;

-- ステップ2: 外部キー制約を削除
ALTER TABLE analytics DROP CONSTRAINT IF EXISTS analytics_profile_id_fkey;

-- ステップ3: profile_idカラムの型をTEXTに変更
-- 既存のUUIDデータは自動的にTEXTに変換されます
ALTER TABLE analytics 
ALTER COLUMN profile_id TYPE TEXT;

-- ステップ4: RLSポリシーを再作成（TEXT型に対応）
-- 注意: 外部キー制約は再作成しません（ビジネスLPのslugも保存するため）
CREATE POLICY "Profile owner can delete analytics"
  ON analytics
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id::TEXT FROM profiles WHERE user_id = auth.uid()
    )
  );

-- ステップ5: content_typeカラムが存在しない場合は追加
-- （ビジネスLPとプロフィールLPを区別するため）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'analytics' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE analytics ADD COLUMN content_type TEXT DEFAULT 'profile';
  END IF;
END $$;

-- ステップ6: content_typeにインデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_analytics_content_type ON analytics(content_type);

-- 確認用クエリ
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'analytics';

