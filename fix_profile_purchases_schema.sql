-- profile_purchasesテーブルのprofile_idカラムをBIGINTからUUIDに変更
-- Supabaseのダッシュボードで実行してください

-- 1. 既存データがある場合は削除（テスト環境の場合）
-- TRUNCATE TABLE public.profile_purchases;

-- 2. profile_idカラムの型を変更
ALTER TABLE public.profile_purchases 
DROP COLUMN profile_id;

ALTER TABLE public.profile_purchases 
ADD COLUMN profile_id UUID NOT NULL;

-- 3. インデックスを再作成
DROP INDEX IF EXISTS idx_profile_purchases_profile_id;
CREATE INDEX idx_profile_purchases_profile_id ON public.profile_purchases(profile_id);

-- 4. 確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profile_purchases' 
  AND table_schema = 'public';

