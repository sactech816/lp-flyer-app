-- アナリティクス機能の動作確認用SQL
-- Supabaseダッシュボードの「SQL Editor」で実行してください

-- ============================================
-- 1. テーブル構造の確認
-- ============================================
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'analytics'
ORDER BY ordinal_position;

-- 期待される結果:
-- column_name   | data_type | column_default | is_nullable
-- --------------+-----------+----------------+-------------
-- id            | uuid      | gen_random_uuid() | NO
-- profile_id    | uuid      | NULL           | NO
-- event_type    | text      | NULL           | NO
-- event_data    | jsonb     | '{}'::jsonb    | YES
-- created_at    | timestamp | now()          | YES
-- content_type  | text      | 'profile'      | YES

-- ============================================
-- 2. RLSポリシーの確認
-- ============================================
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

-- 期待される結果:
-- 最低でも以下の2つのポリシーが存在すること:
-- - Anyone can read analytics (SELECT)
-- - Anyone can insert analytics (INSERT)

-- ============================================
-- 3. インデックスの確認
-- ============================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'analytics'
ORDER BY indexname;

-- 期待される結果:
-- - idx_analytics_profile_id
-- - idx_analytics_event_type
-- - idx_analytics_created_at
-- - idx_analytics_content_type (オプション)

-- ============================================
-- 4. データの存在確認
-- ============================================
SELECT 
    content_type,
    event_type,
    COUNT(*) as count
FROM analytics
GROUP BY content_type, event_type
ORDER BY content_type, event_type;

-- 期待される結果:
-- content_type | event_type | count
-- -------------+------------+-------
-- profile      | view       | 1以上
-- profile      | click      | 0以上
-- profile      | scroll     | 0以上
-- profile      | time       | 0以上
-- profile      | read       | 0以上

-- ============================================
-- 5. 最新の10件のイベントを表示
-- ============================================
SELECT 
    id,
    profile_id,
    event_type,
    event_data,
    content_type,
    created_at
FROM analytics
WHERE content_type = 'profile'
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 6. プロフィールごとのイベント集計
-- ============================================
SELECT 
    p.slug as profile_slug,
    a.event_type,
    COUNT(*) as count
FROM analytics a
LEFT JOIN profiles p ON a.profile_id = p.id
WHERE a.content_type = 'profile'
GROUP BY p.slug, a.event_type
ORDER BY p.slug, a.event_type;

-- ============================================
-- 7. 特定のプロフィールの詳細確認
-- ============================================
-- ※ 'your-slug' を実際のslugに置き換えてください
SELECT 
    a.event_type,
    a.event_data,
    a.created_at
FROM analytics a
JOIN profiles p ON a.profile_id = p.id
WHERE p.slug = 'your-slug'
  AND a.content_type = 'profile'
ORDER BY a.created_at DESC
LIMIT 20;

-- ============================================
-- 8. アナリティクスの統計（ダッシュボードと同じ計算）
-- ============================================
-- ※ 'your-slug' を実際のslugに置き換えてください
WITH profile_analytics AS (
    SELECT 
        a.*
    FROM analytics a
    JOIN profiles p ON a.profile_id = p.id
    WHERE p.slug = 'your-slug'
      AND a.content_type = 'profile'
)
SELECT 
    -- アクセス数
    (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'view') as views,
    
    -- クリック数
    (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'click') as clicks,
    
    -- クリック率
    CASE 
        WHEN (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'view') > 0 
        THEN ROUND((SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'click')::numeric / 
                   (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'view')::numeric * 100)
        ELSE 0 
    END as click_rate,
    
    -- 精読率
    CASE 
        WHEN (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'view') > 0 
        THEN ROUND((SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'read')::numeric / 
                   (SELECT COUNT(*) FROM profile_analytics WHERE event_type = 'view')::numeric * 100)
        ELSE 0 
    END as read_rate,
    
    -- 平均滞在時間
    COALESCE(
        (SELECT ROUND(AVG((event_data->>'timeSpent')::numeric)) 
         FROM profile_analytics 
         WHERE event_type = 'time' AND event_data->>'timeSpent' IS NOT NULL),
        0
    ) as avg_time_spent,
    
    -- 平均スクロール深度
    COALESCE(
        (SELECT ROUND(AVG((event_data->>'scrollDepth')::numeric)) 
         FROM profile_analytics 
         WHERE event_type = 'scroll' AND event_data->>'scrollDepth' IS NOT NULL),
        0
    ) as avg_scroll_depth;

-- ============================================
-- トラブルシューティング用クエリ
-- ============================================

-- content_typeがNULLまたは'quiz'のレコードを確認
SELECT 
    id,
    profile_id,
    event_type,
    content_type,
    created_at
FROM analytics
WHERE content_type IS NULL OR content_type != 'profile'
ORDER BY created_at DESC
LIMIT 10;

-- 古いデータを'profile'に更新（必要な場合のみ実行）
-- UPDATE analytics 
-- SET content_type = 'profile' 
-- WHERE profile_id IN (SELECT id FROM profiles)
--   AND (content_type IS NULL OR content_type != 'profile');

-- ============================================
-- データのクリーンアップ（注意: データが削除されます）
-- ============================================

-- テストデータを削除（実行前に確認してください）
-- DELETE FROM analytics 
-- WHERE profile_id = 'テスト用のプロフィールID';

-- 古いデータを削除（30日以上前のデータ）
-- DELETE FROM analytics 
-- WHERE created_at < NOW() - INTERVAL '30 days';

-- ============================================
-- パフォーマンスチェック
-- ============================================

-- 各プロフィールのイベント数を確認
SELECT 
    p.slug,
    COUNT(*) as total_events,
    COUNT(CASE WHEN a.event_type = 'view' THEN 1 END) as views,
    COUNT(CASE WHEN a.event_type = 'click' THEN 1 END) as clicks,
    COUNT(CASE WHEN a.event_type = 'scroll' THEN 1 END) as scrolls,
    COUNT(CASE WHEN a.event_type = 'time' THEN 1 END) as times,
    COUNT(CASE WHEN a.event_type = 'read' THEN 1 END) as reads
FROM analytics a
JOIN profiles p ON a.profile_id = p.id
WHERE a.content_type = 'profile'
GROUP BY p.slug
ORDER BY total_events DESC;

-- ============================================
-- 診断結果の判定
-- ============================================

-- このクエリで問題を自動判定
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics' AND column_name = 'content_type')
        THEN '❌ content_typeカラムが存在しません。migrate_analytics_add_content_type.sqlを実行してください。'
        
        WHEN NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Anyone can read analytics')
        THEN '❌ 読み取りポリシーが存在しません。supabase_analytics_setup.sqlを実行してください。'
        
        WHEN NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'analytics' AND policyname = 'Anyone can insert analytics')
        THEN '❌ 挿入ポリシーが存在しません。supabase_analytics_setup.sqlを実行してください。'
        
        WHEN NOT EXISTS (SELECT 1 FROM analytics WHERE content_type = 'profile')
        THEN '⚠️ プロフィールのアナリティクスデータが記録されていません。プロフィールページにアクセスしてください。'
        
        ELSE '✅ アナリティクス機能は正常に動作しています。'
    END as diagnosis;


