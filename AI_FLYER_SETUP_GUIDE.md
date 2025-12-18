# AI強化チラシ機能 セットアップガイド

## 概要

Gemini API（Imagen 3）を使用して、チラシのデザインをAIで強化する機能です。

## 機能

### 1. 背景画像生成（ハイブリッドモード）
- LPの情報を元に、AIで美しい背景画像を生成
- 既存のテンプレートと組み合わせて使用
- テキストの正確性が保証される

### 2. 完全AI生成（実験的）
- チラシ全体をAIで生成
- 日本語テキストの精度に課題がある場合あり
- 実験的機能として提供

## セットアップ

### 1. Gemini APIキーの取得

1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「Get API key」をクリック
4. APIキーを生成してコピー

### 2. 環境変数の設定

`.env.local` ファイルに以下を追加：

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 確認

開発サーバーを起動して、チラシページにアクセス：

```bash
npm run dev
```

`/b/[slug]/flyer` にアクセスし、「AIで背景を生成（Beta）」ボタンが表示されることを確認。

## 使い方

### 背景画像生成

1. チラシページにアクセス
2. 「AIで背景を生成（Beta）」ボタンをクリック
3. 生成モードで「背景のみ生成」を選択
4. デザインスタイルを選択（モダン、トラディショナル、ミニマル、ビビッド）
5. 「AIで画像を生成」をクリック
6. 生成された背景がチラシに適用される

### 完全AI生成（実験的）

1. 生成モードで「チラシ全体を生成（実験的）」を選択
2. 「AIで画像を生成」をクリック
3. 生成されたチラシ画像が表示される

※ 日本語テキストの精度に課題があるため、重要な情報は背景モードを推奨

## API仕様

### エンドポイント

```
POST /api/generate-flyer-image
```

### リクエストボディ

```json
{
  "mode": "background" | "full",
  "businessName": "ビジネス名",
  "title": "タイトル（オプション）",
  "description": "説明（オプション）",
  "services": ["サービス1", "サービス2"],
  "priceRange": "料金範囲（オプション）",
  "theme": "business" | "creative" | "shop" | "custom",
  "style": "modern" | "traditional" | "minimal" | "vibrant",
  "contactInfo": "連絡先（オプション）",
  "features": ["特徴1", "特徴2"]
}
```

### レスポンス

```json
{
  "success": true,
  "image": {
    "data": "base64エンコードされた画像データ",
    "mimeType": "image/png"
  },
  "mode": "background",
  "prompt": "使用されたプロンプト..."
}
```

## コスト

| 項目 | 費用 |
|------|------|
| Gemini API（画像生成） | 約$0.02〜0.04/画像 |
| 月間100枚生成の場合 | 約$2〜4/月 |

## トラブルシューティング

### 「Gemini API key not configured」エラー

**原因**: 環境変数が設定されていない

**解決策**:
1. `.env.local` に `GEMINI_API_KEY` を追加
2. 開発サーバーを再起動

### 「Image generation not available」エラー

**原因**: モデルが画像生成をサポートしていない

**解決策**:
1. APIキーの権限を確認
2. Gemini 2.0 Flash with image generation が有効か確認

### 生成が遅い

**原因**: AI画像生成には時間がかかる

**解決策**:
- 通常10〜30秒程度かかります
- ネットワーク状況により変動

### 日本語テキストが正しく表示されない

**原因**: AI画像生成の日本語サポートの制限

**解決策**:
- 「背景のみ生成」モードを使用
- テキストは既存テンプレートで表示

## ファイル構成

```
app/
  api/
    generate-flyer-image/
      route.ts          # AI画像生成APIエンドポイント
components/
  AIFlyerGenerator.tsx  # AI生成UIコンポーネント
  FlyerRenderer.tsx     # チラシレンダラー（AI機能統合済み）
lib/
  geminiClient.ts       # Gemini APIクライアント
```

## 関連ドキュメント

- [FLYER_FEATURE_GUIDE.md](./FLYER_FEATURE_GUIDE.md) - チラシ機能の完全ガイド
- [FLYER_IMPLEMENTATION_SUMMARY.md](./FLYER_IMPLEMENTATION_SUMMARY.md) - 実装サマリー

