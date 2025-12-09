# アナリティクステスト手順

このドキュメントでは、アナリティクス機能が正しく動作しているかをテストする手順を説明します。

## 前提条件

1. `supabase_analytics_setup.sql`を実行済み
2. `migrate_analytics_add_content_type.sql`を実行済み
3. `.env.local`に環境変数を設定済み
4. アプリケーションが起動している（`npm run dev`）

## テスト手順

### 1. ブラウザの準備

1. Google ChromeまたはMicrosoft Edgeを開く
2. 開発者ツールを開く（F12キー）
3. Consoleタブを選択
4. コンソールをクリア（ゴミ箱アイコン）

### 2. プロフィールページにアクセス

1. プロフィールページのURLを開く
   ```
   http://localhost:3000/p/あなたのslug
   ```

2. コンソールに以下のログが表示されることを確認：
   ```
   [ProfileViewTracker] Initializing for profile: xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   [ProfileViewTracker] View tracked: { success: true, data: [...] }
   ```

**期待される結果：**
- ✅ `success: true`が表示される
- ✅ エラーメッセージが表示されない

**エラーが表示される場合：**
- ❌ `[Analytics] Save error:` → データベース設定を確認
- ❌ `Database not available` → 環境変数を確認
- ❌ `Invalid profile ID format` → プロフィールIDを確認

### 3. スクロールテスト

1. ページを下にスクロールする
2. ページの50%以上スクロールする
3. コンソールに以下のログが表示されることを確認：
   ```
   [ProfileViewTracker] Scroll milestone tracked: 25 { success: true }
   [ProfileViewTracker] Scroll milestone tracked: 50 { success: true }
   [ProfileViewTracker] Read tracked: 50 { success: true }
   ```

**期待される結果：**
- ✅ 25%, 50%, 75%, 100%のマイルストーンが記録される
- ✅ 50%以上で精読イベントが記録される

### 4. クリックテスト

1. ページ内のリンクをクリック（新しいタブで開く）
2. コンソールに以下のログが表示されることを確認：
   ```
   [LinkClick] Tracking click: https://...
   [LinkClick] Tracked: { success: true, data: [...] }
   ```

**期待される結果：**
- ✅ クリックイベントが記録される
- ✅ URLが正しく記録される

### 5. 滞在時間テスト

1. ページを開いたまま30秒以上待つ
2. コンソールに以下のログが表示されることを確認：
   ```
   [ProfileViewTracker] Time tracked: 30 { success: true }
   ```

**期待される結果：**
- ✅ 30秒ごとに滞在時間が記録される

### 6. Supabaseでデータを確認

1. [Supabaseダッシュボード](https://app.supabase.com)にログイン
2. 「Table Editor」→「analytics」を開く
3. 最新のデータを確認

**期待される結果：**
- ✅ `event_type`が`view`のレコードが1件以上ある
- ✅ `event_type`が`click`のレコードがある（リンクをクリックした場合）
- ✅ `event_type`が`scroll`のレコードがある（スクロールした場合）
- ✅ `event_type`が`time`のレコードがある（30秒以上滞在した場合）
- ✅ `event_type`が`read`のレコードがある（50%以上スクロールした場合）
- ✅ `content_type`が`profile`になっている

### 7. ダッシュボードで確認

1. ダッシュボード（`/dashboard`）にアクセス
2. プロフィール一覧を確認

**期待される結果：**
- ✅ アクセス数が1以上
- ✅ クリック数が表示される（クリックした場合）
- ✅ クリック率が表示される（クリックした場合）
- ✅ 精読率が表示される（50%以上スクロールした場合）
- ✅ 滞在時間が表示される（30秒以上滞在した場合）

## SQLでデータを直接確認

Supabaseダッシュボードの「SQL Editor」で以下を実行：

```sql
-- 1. 最新の10件のイベントを表示
SELECT 
    event_type,
    event_data,
    content_type,
    created_at
FROM analytics
WHERE profile_id = 'あなたのプロフィールID'
ORDER BY created_at DESC
LIMIT 10;

-- 2. イベントタイプごとの集計
SELECT 
    event_type,
    COUNT(*) as count
FROM analytics
WHERE profile_id = 'あなたのプロフィールID'
  AND content_type = 'profile'
GROUP BY event_type
ORDER BY event_type;

-- 3. 期待される結果
-- event_type | count
-- -----------+-------
-- click      | 1以上（リンクをクリックした場合）
-- read       | 1（50%以上スクロールした場合）
-- scroll     | 1-4（25%, 50%, 75%, 100%）
-- time       | 1以上（30秒以上滞在した場合）
-- view       | 1以上
```

## トラブルシューティング

### ケース1: コンソールに何も表示されない

**原因：**
- プロフィールIDが`demo`になっている
- JavaScriptが無効になっている
- `ProfileViewTracker`コンポーネントが読み込まれていない

**解決方法：**
1. URLを確認（`/p/demo-user`ではないか）
2. ブラウザのJavaScript設定を確認
3. ページをリロード（Ctrl+Shift+R）

### ケース2: `[Analytics] Save error: column "content_type" does not exist`

**原因：**
- `content_type`カラムが追加されていない

**解決方法：**
```sql
-- Supabaseダッシュボードで実行
ALTER TABLE analytics 
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'profile' 
CHECK (content_type IN ('quiz', 'profile'));

CREATE INDEX IF NOT EXISTS idx_analytics_content_type ON analytics(content_type);
```

### ケース3: データは記録されているがダッシュボードに表示されない

**原因：**
- `content_type`が`profile`ではない
- `getAnalytics`関数が`content_type = 'profile'`でフィルタリングしている

**解決方法：**
```sql
-- Supabaseダッシュボードで実行
-- 既存のデータを更新
UPDATE analytics 
SET content_type = 'profile' 
WHERE profile_id IN (
    SELECT id FROM profiles
)
AND (content_type IS NULL OR content_type != 'profile');
```

### ケース4: `[Analytics] Invalid UUID format`

**原因：**
- プロフィールIDがUUID形式ではない

**解決方法：**
1. Supabaseダッシュボードで`profiles`テーブルを確認
2. `id`カラムがUUID型であることを確認
3. 古いプロフィールを削除して新しく作成

### ケース5: リアルタイムで更新されない

**原因：**
- ダッシュボードは自動更新されない

**解決方法：**
- ページをリロード（F5キー）

## 成功の確認

すべてのテストが成功すると、以下のようになります：

### コンソールログ
```
[ProfileViewTracker] Initializing for profile: xxxxx-xxxx-xxxx
[ProfileViewTracker] View tracked: { success: true, data: [...] }
[ProfileViewTracker] Scroll milestone tracked: 25 { success: true }
[ProfileViewTracker] Scroll milestone tracked: 50 { success: true }
[ProfileViewTracker] Read tracked: 50 { success: true }
[LinkClick] Tracking click: https://...
[LinkClick] Tracked: { success: true }
[ProfileViewTracker] Time tracked: 30 { success: true }
```

### Supabaseのデータ
```
event_type | count
-----------+-------
view       | 1
scroll     | 2
read       | 1
click      | 1
time       | 1
```

### ダッシュボード
```
アクセス数: 1
クリック数: 1
クリック率: 100%
精読率: 100%
滞在時間: 30秒
```

## 次のステップ

テストが成功したら：

1. 本番環境でも同じ設定を行う
2. Google Tag Manager、Facebook Pixel、LINE Tagの設定を追加
3. 定期的にアナリティクスデータを確認する

テストが失敗した場合：

1. `ANALYTICS_DEBUG.md`を参照
2. エラーメッセージをコピーして原因を特定
3. Supabaseの設定を再確認


