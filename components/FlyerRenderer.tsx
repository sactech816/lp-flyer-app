"use client";

import React, { useState } from 'react';
import { Block } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { AIFlyerGenerator, AIGenerationMode } from './AIFlyerGenerator';

export type FlyerLayout = 'simple' | 'two-column' | 'image-focus';
export type FlyerColorTheme = 'business' | 'creative' | 'shop' | 'custom';

interface FlyerRendererProps {
  blocks: Block[];
  slug: string;
  settings?: {
    theme?: {
      gradient?: string;
      backgroundImage?: string;
    };
  };
  initialLayout?: FlyerLayout;
  initialColorTheme?: FlyerColorTheme;
  showControls?: boolean;
  enableAI?: boolean;
}

// カラーテーマの定義
const colorThemes = {
  business: {
    primary: '#2563EB',
    secondary: '#1E40AF',
    accent: '#3B82F6',
    text: '#1F2937',
    border: '#DBEAFE',
    background: '#EFF6FF',
  },
  creative: {
    primary: '#EC4899',
    secondary: '#BE185D',
    accent: '#F472B6',
    text: '#1F2937',
    border: '#FCE7F3',
    background: '#FDF2F8',
  },
  shop: {
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    text: '#1F2937',
    border: '#D1FAE5',
    background: '#ECFDF5',
  },
  custom: {
    primary: '#4F46E5',
    secondary: '#4338CA',
    accent: '#6366F1',
    text: '#1F2937',
    border: '#E5E7EB',
    background: '#EEF2FF',
  },
};

export const FlyerRenderer: React.FC<FlyerRendererProps> = ({ 
  blocks, 
  slug, 
  settings,
  initialLayout = 'simple',
  initialColorTheme = 'business',
  showControls = true,
  enableAI = true,
}) => {
  const [layout, setLayout] = useState<FlyerLayout>(initialLayout);
  const [colorTheme, setColorTheme] = useState<FlyerColorTheme>(initialColorTheme);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiBackgroundImage, setAiBackgroundImage] = useState<string | null>(null);
  const [aiFullImage, setAiFullImage] = useState<string | null>(null);
  const [aiGenerationMode, setAiGenerationMode] = useState<'none' | 'background' | 'full'>('none');

  const lpUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/b/${slug}`;

  // AI画像生成完了ハンドラー
  const handleAIImageGenerated = (imageData: string, mimeType: string, mode: 'background' | 'full') => {
    const dataUrl = `data:${mimeType};base64,${imageData}`;
    
    if (mode === 'full') {
      // 完全AI生成モード
      setAiFullImage(dataUrl);
      setAiBackgroundImage(null);
      setAiGenerationMode('full');
    } else {
      // 背景のみモード
      setAiBackgroundImage(dataUrl);
      setAiFullImage(null);
      setAiGenerationMode('background');
    }
  };

  // AI画像エラーハンドラー
  const handleAIError = (error: string) => {
    console.error('[FlyerRenderer] AI生成エラー:', error);
    alert(`AI画像生成エラー: ${error}`);
  };

  // AI背景をクリア
  const clearAIBackground = () => {
    setAiBackgroundImage(null);
    setAiFullImage(null);
    setAiGenerationMode('none');
  };
  const theme = colorThemes[colorTheme];

  // ヘッダーブロックを取得
  const headerBlock = blocks.find(b => b.type === 'header');
  const headerData = headerBlock?.data as any;

  // テキストカードブロックを取得
  const textBlocks = blocks.filter(b => b.type === 'text_card');

  // 画像ブロックを取得
  const imageBlocks = blocks.filter(b => b.type === 'image');

  // リンクブロックを取得
  const linksBlock = blocks.find(b => b.type === 'links');
  const linksData = linksBlock?.data as any;

  // 料金表ブロックを取得
  const pricingBlock = blocks.find(b => b.type === 'pricing');
  const pricingData = pricingBlock?.data as any;

  // PDF生成ハンドラー
  const handleGeneratePDF = async () => {
    console.log('[FlyerRenderer] PDF生成開始');
    setIsGeneratingPDF(true);
    try {
      console.log('[FlyerRenderer] APIリクエスト送信:', `/api/generate-flyer-pdf?slug=${slug}&layout=${layout}&theme=${colorTheme}`);
      const response = await fetch(`/api/generate-flyer-pdf?slug=${slug}&layout=${layout}&theme=${colorTheme}`);
      
      console.log('[FlyerRenderer] レスポンス受信:', response.status, response.statusText);
      
      if (!response.ok) {
        // エラーレスポンスの詳細を取得
        let errorDetails;
        try {
          errorDetails = await response.json();
          console.error('[FlyerRenderer] エラー詳細:', errorDetails);
        } catch (e) {
          console.error('[FlyerRenderer] エラーレスポンスのJSON解析失敗');
          errorDetails = { error: 'レスポンスの解析に失敗しました' };
        }
        
        throw new Error(errorDetails.details || errorDetails.error || 'PDF生成に失敗しました');
      }
      
      console.log('[FlyerRenderer] PDFデータ取得中...');
      const blob = await response.blob();
      console.log('[FlyerRenderer] PDFサイズ:', blob.size, 'bytes');
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flyer-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('[FlyerRenderer] PDF生成成功！');
    } catch (error) {
      console.error('[FlyerRenderer] ❌ PDF生成エラー:', error);
      console.error('[FlyerRenderer] エラーの種類:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('[FlyerRenderer] エラーメッセージ:', error instanceof Error ? error.message : String(error));
      
      alert(
        'PDF生成に失敗しました。\n\n' +
        '代わりに以下の方法をお試しください：\n\n' +
        '1. 「印刷 / PDFで保存」ボタンをクリック\n' +
        '2. 印刷ダイアログで「PDFに保存」を選択\n' +
        '3. 保存先を指定して保存\n\n' +
        'エラー詳細: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsGeneratingPDF(false);
      console.log('[FlyerRenderer] PDF生成処理終了');
    }
  };

  // レイアウト別のレンダリング
  const renderContent = () => {
    switch (layout) {
      case 'two-column':
        return renderTwoColumnLayout();
      case 'image-focus':
        return renderImageFocusLayout();
      default:
        return renderSimpleLayout();
    }
  };

  // シンプルレイアウト
  const renderSimpleLayout = () => (
    <>
      {/* ヘッダー */}
      <div className="flyer-header">
        {headerData?.avatar && (
          <div style={{ marginBottom: '15px' }}>
            <img 
              src={headerData.avatar} 
              alt={headerData.name || ''} 
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                margin: '0 auto',
                border: `3px solid ${theme.primary}`
              }} 
            />
          </div>
        )}
        <h1 className="flyer-title">{headerData?.name || 'ビジネスLP'}</h1>
        {headerData?.title && (
          <p className="flyer-subtitle">{headerData.title}</p>
        )}
      </div>

      {/* テキストセクション */}
      {textBlocks.slice(0, 3).map((block, index) => {
        const data = block.data as any;
        return (
          <div key={block.id || index} className="flyer-section">
            {data.title && (
              <h2 className="flyer-section-title">{data.title}</h2>
            )}
            {data.text && (
              <div className="flyer-content">{data.text}</div>
            )}
          </div>
        );
      })}

      {/* 料金表 */}
      {pricingData?.plans && pricingData.plans.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title">料金プラン</h2>
          <div className="flyer-pricing">
            {pricingData.plans.slice(0, 3).map((plan: any) => (
              <div key={plan.id} className="flyer-price-card">
                <div className="flyer-price-title">{plan.title}</div>
                <div className="flyer-price-amount">{plan.price}</div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="flyer-price-features" style={{ listStyle: 'none', padding: 0 }}>
                    {plan.features.slice(0, 3).map((feature: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>✓ {feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター（QRコード + 連絡先） */}
      <div className="flyer-footer">
        <div className="flyer-contact">
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>お問い合わせ</h3>
          {linksData?.links && linksData.links.length > 0 && (
            <div className="flyer-links">
              {linksData.links.slice(0, 4).map((link: any, idx: number) => (
                <div key={idx} className="flyer-link-item">
                  {link.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flyer-qr">
          <QRCodeSVG 
            value={lpUrl} 
            size={120}
            level="H"
            includeMargin={true}
          />
          <div className="flyer-qr-label">
            詳細はこちら<br />
            <span style={{ fontSize: '10px' }}>{lpUrl}</span>
          </div>
        </div>
      </div>
    </>
  );

  // 2カラムレイアウト
  const renderTwoColumnLayout = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* 左カラム */}
        <div>
          <div className="flyer-header" style={{ textAlign: 'left', borderBottom: 'none' }}>
            {headerData?.avatar && (
              <img 
                src={headerData.avatar} 
                alt={headerData.name || ''} 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  marginBottom: '15px',
                  border: `3px solid ${theme.primary}`
                }} 
              />
            )}
            <h1 className="flyer-title" style={{ fontSize: '28px', textAlign: 'left' }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p className="flyer-subtitle" style={{ textAlign: 'left' }}>{headerData.title}</p>
            )}
          </div>

          {textBlocks.slice(0, 2).map((block, index) => {
            const data = block.data as any;
            return (
              <div key={block.id || index} className="flyer-section">
                {data.title && (
                  <h2 className="flyer-section-title">{data.title}</h2>
                )}
                {data.text && (
                  <div className="flyer-content">{data.text}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* 右カラム */}
        <div>
          {pricingData?.plans && pricingData.plans.length > 0 && (
            <div className="flyer-section">
              <h2 className="flyer-section-title">料金プラン</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pricingData.plans.slice(0, 3).map((plan: any) => (
                  <div key={plan.id} className="flyer-price-card">
                    <div className="flyer-price-title">{plan.title}</div>
                    <div className="flyer-price-amount">{plan.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flyer-qr" style={{ marginTop: '20px', textAlign: 'center' }}>
            <QRCodeSVG 
              value={lpUrl} 
              size={140}
              level="H"
              includeMargin={true}
            />
            <div className="flyer-qr-label">
              詳細はこちら<br />
              <span style={{ fontSize: '10px' }}>{lpUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="flyer-footer" style={{ marginTop: '20px' }}>
        <div className="flyer-contact" style={{ paddingRight: 0 }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>お問い合わせ</h3>
          {linksData?.links && linksData.links.length > 0 && (
            <div className="flyer-links">
              {linksData.links.slice(0, 4).map((link: any, idx: number) => (
                <div key={idx} className="flyer-link-item">
                  {link.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  // 画像重視レイアウト
  const renderImageFocusLayout = () => (
    <>
      {/* ヘッダー（コンパクト） */}
      <div className="flyer-header" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {headerData?.avatar && (
            <img 
              src={headerData.avatar} 
              alt={headerData.name || ''} 
              style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: `3px solid ${theme.primary}`
              }} 
            />
          )}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h1 className="flyer-title" style={{ fontSize: '26px', marginBottom: '5px' }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p className="flyer-subtitle" style={{ fontSize: '14px', marginBottom: 0 }}>{headerData.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* メイン画像 */}
      {imageBlocks.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={(imageBlocks[0].data as any).url} 
            alt={(imageBlocks[0].data as any).caption || ''} 
            style={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: `2px solid ${theme.border}`
            }} 
          />
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          {textBlocks.slice(0, 2).map((block, index) => {
            const data = block.data as any;
            return (
              <div key={block.id || index} className="flyer-section" style={{ marginBottom: '15px' }}>
                {data.title && (
                  <h2 className="flyer-section-title" style={{ fontSize: '18px' }}>{data.title}</h2>
                )}
                {data.text && (
                  <div className="flyer-content" style={{ fontSize: '13px' }}>{data.text}</div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <div className="flyer-qr" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <QRCodeSVG 
              value={lpUrl} 
              size={110}
              level="H"
              includeMargin={true}
            />
            <div className="flyer-qr-label" style={{ fontSize: '11px' }}>
              詳細はこちら
            </div>
          </div>

          {linksData?.links && linksData.links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {linksData.links.slice(0, 3).map((link: any, idx: number) => (
                <div key={idx} className="flyer-link-item" style={{ fontSize: '11px', padding: '6px' }}>
                  {link.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 料金表（コンパクト） */}
      {pricingData?.plans && pricingData.plans.length > 0 && (
        <div className="flyer-section" style={{ marginTop: '20px' }}>
          <h2 className="flyer-section-title" style={{ fontSize: '18px' }}>料金プラン</h2>
          <div className="flyer-pricing">
            {pricingData.plans.slice(0, 3).map((plan: any) => (
              <div key={plan.id} className="flyer-price-card" style={{ padding: '12px' }}>
                <div className="flyer-price-title" style={{ fontSize: '14px' }}>{plan.title}</div>
                <div className="flyer-price-amount" style={{ fontSize: '20px' }}>{plan.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* コントロールパネル（画面表示時のみ） */}
      {showControls && (
        <div className="no-print" style={{ 
          maxWidth: '210mm', 
          margin: '0 auto 20px', 
          padding: '16px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', color: '#1F2937' }} className="md:text-base">
            チラシ設定
          </h3>
          
          {/* レイアウト選択 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }} className="md:text-sm">
              レイアウト
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['simple', 'two-column', 'image-focus'] as FlyerLayout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: layout === l ? `2px solid ${theme.primary}` : '2px solid #E5E7EB',
                    background: layout === l ? theme.background : 'white',
                    color: layout === l ? theme.primary : '#6B7280',
                    fontSize: '12px',
                    fontWeight: layout === l ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '36px',
                    flex: '1 1 auto'
                  }}
                  className="md:text-sm md:px-4 md:py-2"
                >
                  {l === 'simple' ? 'シンプル' : l === 'two-column' ? '2カラム' : '画像重視'}
                </button>
              ))}
            </div>
          </div>

          {/* カラーテーマ選択 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#374151' }} className="md:text-sm">
              カラーテーマ
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['business', 'creative', 'shop', 'custom'] as FlyerColorTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setColorTheme(t)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: colorTheme === t ? `2px solid ${colorThemes[t].primary}` : '2px solid #E5E7EB',
                    background: colorTheme === t ? colorThemes[t].background : 'white',
                    color: colorTheme === t ? colorThemes[t].primary : '#6B7280',
                    fontSize: '12px',
                    fontWeight: colorTheme === t ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '36px',
                    flex: '1 1 auto'
                  }}
                  className="md:text-sm md:px-4 md:py-2"
                >
                  {t === 'business' ? 'ビジネス' : t === 'creative' ? 'クリエイター' : t === 'shop' ? '店舗' : 'カスタム'}
                </button>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="md:flex-row md:justify-center">
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: theme.primary,
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                minHeight: '44px'
              }}
              className="md:text-base md:px-6 md:py-3"
            >
              印刷 / PDFで保存
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              style={{
                backgroundColor: isGeneratingPDF ? '#9CA3AF' : theme.secondary,
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                minHeight: '44px'
              }}
              className="md:text-base md:px-6 md:py-3"
            >
              {isGeneratingPDF ? '生成中...' : 'PDFダウンロード'}
            </button>
          </div>
          <p style={{ marginTop: '8px', fontSize: '11px', color: '#6B7280', textAlign: 'center' }} className="md:text-xs">
            ブラウザの印刷機能で「PDFに保存」を選択するか、PDFダウンロードボタンをご利用ください
          </p>

          {/* AI生成ボタン */}
          {enableAI && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: showAIPanel 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea33 0%, #764ba233 100%)',
                  color: showAIPanel ? 'white' : '#667eea',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {showAIPanel ? 'AI生成パネルを閉じる' : 'AIで背景を生成（Beta）'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI生成パネル */}
      {showControls && showAIPanel && enableAI && (
        <div className="no-print" style={{ maxWidth: '210mm', margin: '0 auto 20px' }}>
          <AIFlyerGenerator
            blocks={blocks}
            slug={slug}
            theme={colorTheme}
            onImageGenerated={handleAIImageGenerated}
            onError={handleAIError}
          />
          
          {/* AI画像がある場合のコントロール */}
          {(aiBackgroundImage || aiFullImage) && (
            <div style={{
              padding: '12px',
              background: 'white',
              borderRadius: '8px',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ fontSize: '14px', color: '#1F2937' }}>
                  {aiGenerationMode === 'full' ? 'AI生成チラシが表示されています' : 'AI背景が適用されています'}
                </span>
                {aiGenerationMode === 'full' && (
                  <span style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    実験的
                  </span>
                )}
              </div>
              <button
                onClick={clearAIBackground}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #EF4444',
                  background: 'white',
                  color: '#EF4444',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                クリア
              </button>
            </div>
          )}
        </div>
      )}

      <div 
        className={`flyer-container ${aiBackgroundImage && aiGenerationMode === 'background' ? 'has-ai-background' : ''}`}
        style={{ 
          ['--theme-primary' as any]: theme.primary,
          ...(aiBackgroundImage && aiGenerationMode === 'background' ? {
            backgroundImage: `url(${aiBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : {})
        }}
      >
        {/* AI全体生成モードの場合は画像のみ表示 */}
        {aiFullImage && aiGenerationMode === 'full' ? (
          <div style={{ width: '100%', height: '100%' }}>
            <img 
              src={aiFullImage} 
              alt="AI生成チラシ" 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ) : (
          <>
        {/* 印刷用スタイル */}
        <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .flyer-container {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 20mm;
            page-break-after: always;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          img {
            max-width: 100%;
            page-break-inside: avoid;
          }
        }

        @media screen {
          .flyer-container {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            position: relative;
          }
        }

        /* AI背景適用時のテキスト可読性向上 */
        .flyer-container.has-ai-background .flyer-header,
        .flyer-container.has-ai-background .flyer-section,
        .flyer-container.has-ai-background .flyer-footer,
        .flyer-container.has-ai-background .flyer-price-card {
          background: rgba(255, 255, 255, 0.92);
          padding: 15px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }

        .flyer-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid ${theme.primary};
        }

        .flyer-title {
          font-size: 32px;
          font-weight: bold;
          color: ${theme.text};
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .flyer-subtitle {
          font-size: 18px;
          color: #6B7280;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .flyer-section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }

        .flyer-section-title {
          font-size: 20px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid ${theme.border};
        }

        .flyer-content {
          font-size: 14px;
          line-height: 1.8;
          color: ${theme.text};
          white-space: pre-wrap;
        }

        .flyer-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid ${theme.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          page-break-inside: avoid;
        }

        .flyer-qr {
          text-align: center;
        }

        .flyer-qr-label {
          font-size: 12px;
          color: #6B7280;
          margin-top: 8px;
          line-height: 1.4;
        }

        .flyer-contact {
          flex: 1;
          padding-right: 20px;
        }

        .flyer-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .flyer-link-item {
          font-size: 12px;
          color: ${theme.primary};
          padding: 8px;
          background: ${theme.background};
          border-radius: 6px;
          text-align: center;
          font-weight: 500;
        }

        .flyer-pricing {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .flyer-price-card {
          border: 2px solid ${theme.border};
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          background: ${theme.background};
        }

        .flyer-price-title {
          font-size: 16px;
          font-weight: bold;
          color: ${theme.text};
          margin-bottom: 8px;
        }

        .flyer-price-amount {
          font-size: 24px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 10px;
        }

        .flyer-price-features {
          font-size: 11px;
          color: #6B7280;
          text-align: left;
          line-height: 1.6;
        }
      `}</style>

        {renderContent()}
          </>
        )}
      </div>
    </>
  );
};

export default FlyerRenderer;
