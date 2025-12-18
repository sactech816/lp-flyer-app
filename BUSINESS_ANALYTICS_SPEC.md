# ビジネスLP アナリティクス仕様書

## 概要

ビジネスLPのアナリティクスデータは、プロフィールLPと同じ`analytics`テーブルを使用しますが、識別方法が異なります。

## データ構造

### 使用テーブル

```
analytics テーブル
```

### カラム構成

| カラム名 | 型 | 説明 |
|----------|------|------|
| id | UUID | 主キー（自動生成） |
| profile_id | TEXT/UUID | プロフィールLP: UUID、ビジネスLP: slug（文字列） |
| event_type | TEXT | イベント種別 (`view`, `click`, `scroll`, `time`, `read`) |
| event_data | JSONB | イベント詳細データ |
| content_type | TEXT | コンテンツ種別 (`profile`, `business`, `quiz`) |
| created_at | TIMESTAMP | 作成日時 |

## ビジネスLPとプロフィールLPの区別

### 識別方法

| 項目 | プロフィールLP | ビジネスLP |
|------|---------------|-----------|
| `content_type` | `'profile'` | `'business'` |
| `profile_id` | UUID形式 | slug（文字列） |

### クエリ例

```sql
-- ビジネスLPのアナリティクス取得
SELECT * FROM analytics 
WHERE profile_id = 'my-business-lp-slug' 
AND content_type = 'business';

-- プロフィールLPのアナリティクス取得
SELECT * FROM analytics 
WHERE profile_id = '550e8400-e29b-41d4-a716-446655440000' 
AND content_type = 'profile';
```

## slugベース保存を採用した理由

### 背景

- `business_projects`テーブルの`id`カラムは`BIGSERIAL`型（数値）
- `analytics`テーブルの`profile_id`カラムは`UUID`型
- 型の不一致によりUUIDエラーが発生

### 解決策

slugをprofile_idカラムに保存する方式を採用しました。

**メリット:**

1. **DBスキーマ変更不要** - 既存テーブル構造を維持
2. **最小限のコード変更** - Server Actionsの修正のみ
3. **一意性の保証** - slugは`business_projects`テーブルでUNIQUE制約あり
4. **既存データとの互換性** - `content_type`で確実に区別可能

**他の選択肢と比較:**

| 方式 | 工数 | DB変更 | リスク |
|------|------|--------|--------|
| **A: slugベース（採用）** | 低 | 不要 | 低 |
| B: UUIDカラム追加 | 中 | 必要 | 中 |
| C: 専用テーブル作成 | 高 | 必要 | 中〜高 |

## 関連ファイル

### Server Actions

```
app/actions/business.ts
```

- `saveBusinessAnalytics(slug, eventType, eventData)` - アナリティクス保存
- `getBusinessAnalytics(slug)` - アナリティクス取得

### コンポーネント

```
components/BlockRenderer.tsx
```

- `saveAnalyticsForContentType()` - コンテンツタイプに応じたアナリティクス保存ヘルパー
- 各ブロックコンポーネントで`contentType`プロパティを使用

```
components/BusinessLPEditor.tsx
```

- アナリティクス取得時に`slug`を使用

## イベント種別

| event_type | 説明 | event_data例 |
|------------|------|-------------|
| `view` | ページ閲覧 | `{}` |
| `click` | リンク/ボタンクリック | `{ url: "https://..." }` |
| `scroll` | スクロール深度 | `{ scrollDepth: 75 }` |
| `time` | 滞在時間 | `{ timeSpent: 120 }` (秒) |
| `read` | 精読率 | `{ readPercentage: 80 }` |

## 集計指標

`getBusinessAnalytics()`が返す値:

| 指標 | 説明 | 計算方法 |
|------|------|---------|
| `views` | 総閲覧数 | `event_type='view'`のカウント |
| `clicks` | 総クリック数 | `event_type='click'`のカウント |
| `avgScrollDepth` | 平均スクロール深度(%) | scrollDepthの平均 |
| `avgTimeSpent` | 平均滞在時間(秒) | timeSpentの平均 |
| `readRate` | 精読率(%) | readPercentage>=50のビュー比率 |
| `clickRate` | クリック率(%) | clicks / views * 100 |

## 注意事項

1. **content_typeの設定を忘れない** - 必ず`'business'`を指定
2. **slugの一意性** - slugはビジネスプロジェクト作成時に一意性が保証される
3. **後方互換性** - 既存のプロフィールLPアナリティクスには影響なし

## 将来の拡張

- チラシ機能（有料オプション）追加時にcontent_type='flyer'を追加可能
- 統合ダッシュボードで全コンテンツタイプを横断集計可能

