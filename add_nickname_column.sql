-- ニックネーム機能の追加
-- profiles テーブルに nickname カラムを追加

-- 1. nickname カラムを追加
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nickname TEXT UNIQUE;

-- 2. インデックスを追加（検索高速化）
CREATE INDEX IF NOT EXISTS idx_profiles_nickname 
ON profiles(nickname) WHERE nickname IS NOT NULL;

-- 3. コメント追加
COMMENT ON COLUMN profiles.nickname IS 'ユーザーが設定する覚えやすいニックネーム（任意、ユニーク、変更不可）';

-- 4. 制約の確認
-- UNIQUE制約により、同じnicknameは登録できない
-- NULL は許可される（ニックネーム未設定のプロフィール）

-- 実行確認
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name = 'nickname';

-- インデックスの確認
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND indexname = 'idx_profiles_nickname';

