-- ========================================
-- announcements テーブルの状態確認
-- エラーが出る前に、まずこれを実行してください
-- ========================================

-- 1. テーブルが存在するか確認
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'announcements'
    ) 
    THEN '⚠️ announcements テーブルは既に存在します'
    ELSE '✅ announcements テーブルは存在しません（新規作成可能）'
  END as table_status;

-- 2. テーブルが存在する場合、カラム一覧を表示
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'announcements'
ORDER BY ordinal_position;

-- 3. テーブルが存在する場合、既存のポリシーを表示
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
WHERE tablename = 'announcements';

-- 4. テーブルが存在する場合、データ件数を表示
SELECT 
  COUNT(*) as data_count,
  '既存データがある場合、DROP TABLE で削除されます' as warning
FROM announcements;

-- ========================================
-- 実行結果の見方:
-- ========================================
-- 
-- 【ケース1】テーブルが存在しない場合
--   → supabase_announcements_setup_clean.sql を実行
-- 
-- 【ケース2】テーブルは存在するが service_type カラムがない場合
--   → supabase_announcements_setup_clean.sql を実行
--   → 既存データは削除されます（注意！）
-- 
-- 【ケース3】テーブルも service_type カラムも存在する場合
--   → 既にセットアップ済みです
--   → アプリをリロードしてください
-- 
-- ========================================

