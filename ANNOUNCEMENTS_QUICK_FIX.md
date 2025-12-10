# ⚠️ お知らせ機能エラー解決ガイド

## エラー: Could not find the 'service_type' column

### 原因
データベースに `announcements` テーブルがまだ作成されていません。

### 解決手順

#### ステップ1: Supabaseにアクセス
1. https://supabase.com にアクセス
2. プロジェクトを選択
3. 左メニューから「SQL Editor」をクリック

#### ステップ2: SQLを実行
1. 「New query」をクリック
2. `supabase_announcements_setup.sql` の内容を全てコピー
3. SQL Editorに貼り付け
4. 「Run」ボタンをクリック

#### ステップ3: 確認
1. 左メニューから「Table Editor」をクリック
2. `announcements` テーブルが表示されることを確認
3. テーブルをクリックして、以下のカラムがあることを確認:
   - id
   - service_type ← これが重要！
   - title
   - content
   - link_url
   - link_text
   - is_active
   - announcement_date
   - created_at
   - updated_at

#### ステップ4: アプリをリロード
ブラウザでアプリをリロードして、再度お知らせ作成を試してください。

---

## 代替方法: 手動でテーブル作成

SQL Editorが使えない場合、Table Editorから手動で作成:

1. Table Editor > New table
2. テーブル名: `announcements`
3. 以下のカラムを追加:

| Name | Type | Default | Options |
|------|------|---------|---------|
| id | uuid | gen_random_uuid() | Primary Key |
| service_type | text | 'profile' | Not null |
| title | text | - | Not null |
| content | text | - | Not null |
| link_url | text | - | Nullable |
| link_text | text | - | Nullable |
| is_active | bool | true | Not null |
| announcement_date | date | now() | Not null |
| created_at | timestamptz | now() | Not null |
| updated_at | timestamptz | now() | Not null |

4. RLS (Row Level Security) を有効化
5. Policies を追加（SQL Editorで `supabase_announcements_setup.sql` のポリシー部分を実行）

---

## トラブルシューティング

### エラーが続く場合
1. ブラウザのキャッシュをクリア
2. アプリを再起動（`npm run dev` を停止して再実行）
3. Supabaseのスキーマキャッシュをリフレッシュ

### それでも解決しない場合
Supabaseのプロジェクト設定 > API > Schema cache を確認し、
必要に応じてキャッシュをクリアしてください。

