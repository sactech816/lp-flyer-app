-- アナリティクステーブルのポリシーを修正
-- Supabaseのダッシュボード > SQL Editor で実行してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Analytics view owner" ON analytics;
DROP POLICY IF EXISTS "Analytics insert public" ON analytics;
DROP POLICY IF EXISTS "Anyone can read analytics" ON analytics;
DROP POLICY IF EXISTS "Anyone can insert analytics" ON analytics;

-- 新しいポリシーを作成（全ユーザーが読み取り・挿入可能）
CREATE POLICY "Anyone can read analytics"
  ON analytics
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert analytics"
  ON analytics
  FOR INSERT
  WITH CHECK (true);

-- プロフィール所有者のみが削除可能（オプション）
CREATE POLICY "Profile owner can delete analytics"
  ON analytics
  FOR DELETE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- 確認: ポリシー一覧を表示
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'analytics';
