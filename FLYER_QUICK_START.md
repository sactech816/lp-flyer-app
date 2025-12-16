# チラシ機能 クイックスタートガイド

## 5分で始めるチラシ機能

### 1. 必要なパッケージの確認

すべて既にインストール済みです✓

```json
{
  "qrcode.react": "^4.2.0",
  "puppeteer-core": "^24.33.0",
  "@sparticuz/chromium": "^143.0.0"
}
```

### 2. 環境変数の設定（オプション）

`.env.local`ファイルに以下を追加：

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

本番環境（Vercel）では自動的に設定されます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

### 4. チラシ機能を試す

1. ブラウザで `http://localhost:3000` を開く
2. ビジネスLPを作成または既存のLPを開く
3. ページ下部の「チラシを作成・印刷する」ボタンをクリック
4. レイアウトとカラーテーマを選択
5. 「印刷 / PDFで保存」または「PDFダウンロード」をクリック

## 機能一覧

### ✅ 実装済み機能

- [x] 3種類のレイアウトテンプレート
  - シンプルレイアウト
  - 2カラムレイアウト
  - 画像重視レイアウト
- [x] 4種類のカラーテーマ
  - ビジネス向け（ブルー系）
  - クリエイター向け（ピンク系）
  - 店舗向け（グリーン系）
  - カスタム（インディゴ系）
- [x] QRコード自動生成
- [x] A4サイズ対応（210mm × 297mm）
- [x] 印刷最適化CSS
- [x] ブラウザ印刷機能
- [x] サーバーサイドPDF生成（Puppeteer）
- [x] ビジネスLPからのリンク
- [x] レスポンシブUI
- [x] プレビューモード

## アクセス方法

### 直接URL

```
/b/{slug}/flyer
```

例: `/b/sample-business/flyer`

### クエリパラメータ

```
/b/{slug}/flyer?layout=two-column&theme=creative&print=true
```

パラメータ：
- `layout`: simple | two-column | image-focus
- `theme`: business | creative | shop | custom
- `print`: true（印刷モード、コントロール非表示）

## API使用方法

### PDF生成API

```javascript
// フロントエンドから呼び出し
const response = await fetch(
  `/api/generate-flyer-pdf?slug=${slug}&layout=${layout}&theme=${theme}`
);

if (response.ok) {
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flyer-${slug}.pdf`;
  a.click();
}
```

## トラブルシューティング

### PDF生成が動作しない（開発環境）

**原因**: Chromiumが見つからない

**解決策**: 
```bash
# @sparticuz/chromiumが自動的にChromiumをダウンロードします
# エラーが出る場合は、再インストール
npm install @sparticuz/chromium --force
```

### Vercelデプロイ後にPDF生成が失敗する

**原因**: タイムアウトまたはメモリ不足

**解決策**:
1. Vercel Proプランにアップグレード
2. `app/api/generate-flyer-pdf/route.ts`で`maxDuration`を設定
3. 画像サイズを最適化

### QRコードが表示されない

**原因**: `qrcode.react`パッケージの問題

**解決策**:
```bash
npm install qrcode.react@latest
```

## 次のステップ

### カスタマイズ

1. **新しいレイアウトの追加**
   - `components/FlyerRenderer.tsx`を編集
   - `renderCustomLayout()`関数を追加

2. **カラーテーマの追加**
   - `colorThemes`オブジェクトに新しいテーマを追加

3. **QRコードのカスタマイズ**
   - サイズ、エラー訂正レベル、色を変更

### 機能拡張

- [ ] ロゴ埋め込みQRコード
- [ ] 複数ページのチラシ
- [ ] テンプレートのプリセット保存
- [ ] チラシのプレビュー共有機能
- [ ] 印刷業者への直接発注機能

## サンプルビジネスLP

以下のサンプルでチラシ機能を試せます：

1. `/b/sample-business` - ビジネス向けサンプル
2. `/b/sample-creator` - クリエイター向けサンプル
3. `/b/sample-shop` - 店舗向けサンプル

各サンプルのチラシページ：
- `/b/sample-business/flyer`
- `/b/sample-creator/flyer`
- `/b/sample-shop/flyer`

## パフォーマンス

### PDF生成時間（目安）

- **開発環境**: 3-5秒
- **Vercel（Hobby）**: 5-10秒
- **Vercel（Pro）**: 2-4秒

### 最適化のヒント

1. 画像を事前に最適化（WebP、適切なサイズ）
2. 不要なブロックを削除
3. PDFキャッシュの実装（同じ設定の場合）

## サポート

詳細なドキュメント: `FLYER_FEATURE_GUIDE.md`

問題が発生した場合：
1. ブラウザのコンソールを確認
2. Vercelのログを確認
3. GitHubでIssueを作成

## まとめ

チラシ機能は、ビジネスLPをオフライン配布用の印刷物に変換する強力な機能です。QRコードでオンラインとオフラインをシームレスに連携し、マーケティング効果を最大化できます。

**今すぐ試してみましょう！** 🎉


