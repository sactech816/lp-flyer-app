-- プロフィールLP購入履歴テーブルの作成
-- Supabaseのダッシュボードで実行してください

-- profile_purchasesテーブルを作成
CREATE TABLE IF NOT EXISTS public.profile_purchases (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL, -- プロフィールLPのID（UUID形式）
    stripe_session_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_profile_purchases_user_id ON public.profile_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_purchases_profile_id ON public.profile_purchases(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_purchases_stripe_session_id ON public.profile_purchases(stripe_session_id);

-- RLSを有効化
ALTER TABLE public.profile_purchases ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY "Users can view their own profile purchases"
ON public.profile_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert profile purchases"
ON public.profile_purchases
FOR INSERT
WITH CHECK (true);

-- コメント追加
COMMENT ON TABLE public.profile_purchases IS 'プロフィールLPの購入履歴（Pro機能開放）';
COMMENT ON COLUMN public.profile_purchases.user_id IS '購入したユーザーのID';
COMMENT ON COLUMN public.profile_purchases.profile_id IS '購入したプロフィールLPのID';
COMMENT ON COLUMN public.profile_purchases.stripe_session_id IS 'Stripe決済セッションID（重複防止用）';
COMMENT ON COLUMN public.profile_purchases.amount IS '決済金額（円）';
COMMENT ON COLUMN public.profile_purchases.created_at IS '購入日時';


