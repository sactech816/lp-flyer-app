# チラシ機能 完全ガイド

## 概要

ビジネスLPメーカーのチラシ機能は、作成したビジネスLPをA4サイズのチラシに変換し、印刷またはPDFで保存できる機能です。

## 主な機能

### 1. 複数のレイアウトテンプレート

- **シンプルレイアウト**: 標準的な1カラムレイアウト
- **2カラムレイアウト**: 左右に情報を分けた見やすいレイアウト
- **画像重視レイアウト**: 画像を大きく表示するレイアウト

### 2. カラーテーマ

- **ビジネス向け**: ブルー系の落ち着いたカラー
- **クリエイター向け**: ピンク系の華やかなカラー
- **店舗向け**: グリーン系の親しみやすいカラー
- **カスタム**: インディゴ系のデフォルトカラー

### 3. QRコード自動生成

- LPのURLを含むQRコードを自動生成
- エラー訂正レベル: H（高）
- サイズ調整可能

### 4. 印刷最適化

- A4サイズ（210mm × 297mm）対応
- 印刷用CSS（`@media print`）
- カラー印刷とモノクロ印刷の両対応
- 高解像度出力（2x deviceScaleFactor）

### 5. PDF生成機能

#### ブラウザ印刷機能
- `Ctrl+P`（Windows）または `Cmd+P`（Mac）
- 「PDFに保存」を選択

#### サーバーサイドPDF生成
- Puppeteer + Chromiumを使用
- ワンクリックでPDFダウンロード
- Vercel環境に最適化

## 使い方

### 1. ビジネスLPからチラシページへ移動

ビジネスLPページの下部に表示される「チラシを作成・印刷する」ボタンをクリック。

### 2. レイアウトとカラーテーマを選択

チラシページ上部のコントロールパネルで：
- レイアウトを選択（シンプル / 2カラム / 画像重視）
- カラーテーマを選択（ビジネス / クリエイター / 店舗 / カスタム）

### 3. 印刷またはPDFで保存

#### 方法1: ブラウザの印刷機能
1. 「印刷 / PDFで保存」ボタンをクリック
2. 印刷ダイアログで「PDFに保存」を選択
3. 保存先を指定して保存

#### 方法2: サーバーサイドPDF生成
1. 「PDFダウンロード」ボタンをクリック
2. 自動的にPDFがダウンロードされます

## 技術仕様

### ファイル構成

```
app/
  b/
    [slug]/
      flyer/
        page.tsx          # チラシページ（サーバーコンポーネント）
      page.tsx            # ビジネスLPページ（チラシリンク追加）
  api/
    generate-flyer-pdf/
      route.ts            # PDF生成APIエンドポイント
components/
  FlyerRenderer.tsx       # チラシレンダラー（クライアントコンポーネント）
```

### 依存パッケージ

```json
{
  "qrcode.react": "^4.2.0",
  "puppeteer-core": "^22.0.0",
  "@sparticuz/chromium": "^latest"
}
```

### 環境変数

```env
# サイトのベースURL（PDF生成時に使用）
NEXT_PUBLIC_SITE_URL=https://lp.makers.tokyo

# Vercel環境では自動設定
VERCEL_URL=your-project.vercel.app
```

## PDF生成API

### エンドポイント

```
GET /api/generate-flyer-pdf
```

### クエリパラメータ

| パラメータ | 必須 | デフォルト | 説明 |
|-----------|------|-----------|------|
| slug | ✓ | - | ビジネスLPのslug |
| layout | - | simple | レイアウト（simple / two-column / image-focus） |
| theme | - | business | カラーテーマ（business / creative / shop / custom） |

### レスポンス

- **成功**: PDFファイル（application/pdf）
- **エラー**: JSONエラーメッセージ

### 使用例

```javascript
const response = await fetch(
  '/api/generate-flyer-pdf?slug=my-business&layout=simple&theme=business'
);
const blob = await response.blob();
// PDFをダウンロード
```

## Vercelデプロイ時の注意事項

### 1. Serverless Function制限

- **メモリ**: デフォルト1024MB（Pro: 3008MB）
- **実行時間**: デフォルト10秒（Pro: 60秒）
- **ペイロードサイズ**: 4.5MB

PDF生成は重い処理なので、Proプラン推奨。

### 2. maxDuration設定

`app/api/generate-flyer-pdf/route.ts`で設定：

```typescript
export const maxDuration = 60; // Vercel Pro以上で必要
```

### 3. Chromiumバイナリ

`@sparticuz/chromium`パッケージが自動的にChromiumをダウンロード・実行します。

## トラブルシューティング

### PDF生成が失敗する

**原因**: Puppeteerの初期化エラー、タイムアウト、メモリ不足

**解決策**:
1. ブラウザの印刷機能を使用（フォールバック）
2. Vercel Proプランにアップグレード
3. `maxDuration`を増やす
4. 画像サイズを最適化

### QRコードが表示されない

**原因**: `qrcode.react`パッケージ未インストール

**解決策**:
```bash
npm install qrcode.react
```

### 印刷時にレイアウトが崩れる

**原因**: 印刷用CSSが適用されていない

**解決策**:
- ブラウザの印刷設定で「背景のグラフィック」を有効化
- A4サイズを選択
- 余白を「なし」に設定

## カスタマイズ

### レイアウトの追加

`components/FlyerRenderer.tsx`に新しいレイアウト関数を追加：

```typescript
const renderCustomLayout = () => (
  // カスタムレイアウトのJSX
);
```

### カラーテーマの追加

```typescript
const colorThemes = {
  // ...既存のテーマ
  myTheme: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    text: '#1F2937',
    border: '#E5E7EB',
    background: '#FFF5F5',
  },
};
```

## パフォーマンス最適化

### 1. 画像の最適化

- WebP形式を使用
- 適切なサイズにリサイズ（最大800px推奨）
- 遅延読み込み

### 2. PDF生成のキャッシュ

同じslug・layout・themeの組み合わせでPDFをキャッシュ：

```typescript
// Redis、CDN、またはファイルシステムにキャッシュ
const cacheKey = `flyer-${slug}-${layout}-${theme}`;
```

### 3. レート制限

API Routeにレート制限を追加：

```typescript
// 例: Vercel KVを使用
import { kv } from '@vercel/kv';

const rateLimitKey = `rate-limit:${ip}`;
const count = await kv.incr(rateLimitKey);
if (count > 10) {
  return new Response('Too many requests', { status: 429 });
}
```

## セキュリティ

### 1. 入力検証

slugパラメータを検証：

```typescript
if (!/^[a-z0-9-]+$/.test(slug)) {
  return new Response('Invalid slug', { status: 400 });
}
```

### 2. SSRF対策

内部URLへのアクセスを防止：

```typescript
const url = new URL(flyerUrl);
if (url.hostname === 'localhost' || url.hostname.startsWith('192.168.')) {
  throw new Error('Invalid URL');
}
```

## まとめ

チラシ機能により、ビジネスLPをオフライン配布用の印刷物として活用できます。QRコードでオンラインとオフラインをシームレスに連携し、マーケティング効果を最大化します。

## サポート

問題が発生した場合は、以下を確認してください：

1. ブラウザのコンソールエラー
2. Vercelのログ（本番環境）
3. パッケージのバージョン
4. 環境変数の設定

それでも解決しない場合は、GitHubのIssueを作成してください。


