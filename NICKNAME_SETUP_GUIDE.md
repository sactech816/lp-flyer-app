# ニックネーム機能セットアップガイド

## 📋 概要

プロフィールページに、ランダムな5桁のslugに加えて、ユーザーが設定できる覚えやすい「ニックネーム」機能を追加しました。

## ✨ 機能の特徴

### 基本仕様
- **任意設定**: ニックネームは必須ではありません
- **覚えやすいURL**: `https://lp.makers.tokyo/p/abc123` のような分かりやすいURLが使えます
- **両方使える**: 既存のslug（5桁）とニックネームの両方でアクセス可能
- **変更制限**: 一度設定したニックネームは基本的に変更不可（管理者のみ変更可能）

### ニックネームのルール
```
✅ 使用可能文字: 英小文字 + 数字 + ハイフン
✅ 文字数: 3〜20文字
✅ 形式: ^[a-z0-9]+(-[a-z0-9]+)*$

例:
  ✅ abc123
  ✅ my-profile
  ✅ john-doe-2024
  ❌ ABC123 (大文字は自動的に小文字に変換)
  ❌ my_profile (アンダースコア不可)
  ❌ -myprofile (先頭にハイフン不可)
  ❌ my--profile (連続ハイフン不可)
```

### 予約語
以下のニックネームは使用できません:
- `demo-user`
- `new`
- `edit`
- `dashboard`
- `api`
- `admin`
- `settings`
- `profile`
- `user`
- `test`

## 🔧 セットアップ手順

### 1. データベースの更新

Supabaseダッシュボードで以下のSQLを実行してください:

```sql
-- profiles テーブルに nickname カラムを追加
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nickname TEXT UNIQUE;

-- インデックスを追加（検索高速化）
CREATE INDEX IF NOT EXISTS idx_profiles_nickname 
ON profiles(nickname) WHERE nickname IS NOT NULL;

-- コメント追加
COMMENT ON COLUMN profiles.nickname IS 'ユーザーが設定する覚えやすいニックネーム（任意、ユニーク、変更不可）';
```

または、プロジェクトルートの `add_nickname_column.sql` ファイルを実行してください。

### 2. 環境変数の設定（管理者機能を使う場合）

`.env.local` に管理者のユーザーIDを追加:

```env
# 管理者のユーザーID（カンマ区切りで複数指定可能）
ADMIN_USER_IDS=your-user-id-1,your-user-id-2
```

**ユーザーIDの確認方法:**
1. Supabaseダッシュボードにログイン
2. **Authentication** → **Users** に移動
3. 管理者にしたいユーザーのUUIDをコピー

## 📖 使い方

### ユーザー側の操作

1. **プロフィールエディタ**を開く
2. **設定**ボタン（⚙️）をクリック
3. 「ニックネーム（任意）」欄に希望のニックネームを入力
4. **保存**ボタンをクリック

### ニックネームの確認

設定後、以下の2つのURLでアクセス可能になります:
- `https://lp.makers.tokyo/p/7x9k2` （既存のslug）
- `https://lp.makers.tokyo/p/abc123` （ニックネーム）

### 変更について

- **一般ユーザー**: 一度設定すると変更不可
- **管理者**: いつでも変更可能（設定画面に「🔑 管理者」バッジが表示されます）

## 🔒 セキュリティと制約

### 重複チェック
- ニックネームはユニーク制約があり、他のユーザーと重複できません
- 保存時に自動的に重複チェックが行われます

### プロフィール削除時の挙動
- プロフィールを削除すると、そのニックネームも削除されます
- 削除されたニックネームは即座に他のユーザーが取得可能になります

### 管理者権限
- 環境変数 `ADMIN_USER_IDS` に登録されたユーザーのみ
- 自分のプロフィールのニックネームをいつでも変更可能
- 他のユーザーのニックネームは変更できません（将来的に実装可能）

## 🗂️ データベース構造

### profiles テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | BIGSERIAL | PRIMARY KEY | プロフィールID |
| slug | TEXT | UNIQUE, NOT NULL | ランダムな5桁の英数字 |
| nickname | TEXT | UNIQUE, NULL | ユーザー設定のニックネーム |
| content | JSONB | NOT NULL | ブロックデータ |
| settings | JSONB | - | 設定データ |
| user_id | UUID | FOREIGN KEY | ユーザーID |
| featured_on_top | BOOLEAN | DEFAULT true | トップページ掲載フラグ |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

### インデックス
- `idx_profiles_nickname`: nickname カラムの検索高速化（NULL除外）

## 🔍 技術的な詳細

### プロフィール取得ロジック

```typescript
// slug または nickname で検索
const { data } = await supabase
  .from('profiles')
  .select('id, slug, nickname, content, settings')
  .or(`slug.eq.${slug},nickname.eq.${slug}`)
  .single();
```

### バリデーション

```javascript
// ニックネームのバリデーション
const nicknameRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
```

### 保存時の処理フロー

1. ニックネームを小文字に変換
2. バリデーションチェック
3. 既存のニックネームと異なる場合:
   - 管理者以外は変更不可チェック
   - 重複チェック
4. データベースに保存

## 🐛 トラブルシューティング

### エラー: "このニックネームは既に使用されています"

**原因**: 他のユーザーが同じニックネームを使用している

**解決方法**: 別のニックネームを選択してください

### エラー: "ニックネームは変更できません"

**原因**: 一般ユーザーは一度設定したニックネームを変更できません

**解決方法**: 
- 管理者に変更を依頼する
- または、新しいプロフィールを作成する

### エラー: "ニックネームエラー: ..."

**原因**: ニックネームの形式が正しくありません

**解決方法**: 
- 英小文字、数字、ハイフンのみを使用
- 3〜20文字で入力
- ハイフンは単語の区切りのみ（先頭・末尾・連続は不可）

### ニックネームが設定できない

**確認事項**:
1. データベースに `nickname` カラムが追加されているか確認
2. ブラウザのキャッシュをクリア
3. アプリケーションを再起動

## 📝 実装ファイル一覧

### 修正されたファイル
1. `add_nickname_column.sql` - データベース更新SQL（新規）
2. `lib/types.ts` - Profile型にnickname追加
3. `lib/utils.js` - validateNickname, isAdmin関数追加
4. `app/p/[slug]/page.tsx` - slug/nickname両方で検索
5. `app/p/[slug]/layout.tsx` - slug/nickname両方で検索
6. `app/actions/profiles.ts` - nickname保存対応
7. `components/ProfileEditor.tsx` - ニックネーム入力UI追加

## 🎯 今後の拡張案

### Phase 1（実装済み）
- ✅ ニックネーム機能の基本実装
- ✅ 管理者権限による変更機能
- ✅ バリデーションと重複チェック

### Phase 2（将来実装）
- [ ] ニックネーム変更履歴の記録
- [ ] 削除後のクールダウン期間（30日間再取得不可）
- [ ] 不適切なニックネームのブロックリスト
- [ ] 管理者による他ユーザーのニックネーム変更機能

### Phase 3（将来実装）
- [ ] ニックネーム使用統計の表示
- [ ] 人気のニックネームランキング
- [ ] ニックネーム変更リクエスト機能

## 📞 サポート

問題が発生した場合は、以下の情報を添えてお問い合わせください:
- エラーメッセージ
- 実行したSQL（該当する場合）
- ブラウザのコンソールログ
- 環境情報（ブラウザ、OS）

---

**最終更新日**: 2024年12月10日
**バージョン**: 1.0.0

