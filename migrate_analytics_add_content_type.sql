-- アナリティクステーブルにcontent_typeカラムを追加
-- 診断クイズとプロフィールLPを区別するため
-- Supabaseのダッシュボード > SQL Editor で実行してください

-- 1. content_typeカラムを追加（既存データには'quiz'を設定）
ALTER TABLE analytics 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'quiz' CHECK (content_type IN ('quiz', 'profile'));

-- 2. content_typeカラムにインデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_analytics_content_type ON analytics(content_type);

-- 3. 既存のデータを確認（診断クイズのデータとして扱う）
UPDATE analytics 
SET content_type = 'quiz' 
WHERE content_type IS NULL;

-- 4. profile_idカラムの名前を変更してより汎用的にする（オプション）
-- ※この変更を行う場合は、アプリケーションコードも修正が必要です
-- ALTER TABLE analytics RENAME COLUMN profile_id TO content_id;

-- 5. コメントを追加
COMMENT ON COLUMN analytics.content_type IS 'コンテンツタイプ: quiz(診断クイズ), profile(プロフィールLP)';

-- 6. 確認: テーブル構造を表示
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'analytics'
ORDER BY ordinal_position;

-- 7. 確認: データのサンプルを表示
SELECT 
    content_type,
    event_type,
    COUNT(*) as count
FROM analytics
GROUP BY content_type, event_type
ORDER BY content_type, event_type;
