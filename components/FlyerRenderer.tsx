"use client";

import React, { useState } from 'react';
import { Block } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { AIFlyerGenerator, AIGenerationMode } from './AIFlyerGenerator';

export type FlyerLayout = 'simple' | 'two-column' | 'image-focus' | 'full-info' | 'professional' | 'modern-grid';
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
  initialLayout = 'professional',
  initialColorTheme = 'business',
  showControls = true,
  enableAI = true, // AI機能を有効化（Gemini API課金済み）
}) => {
  const [layout, setLayout] = useState<FlyerLayout>(initialLayout);
  const [colorTheme, setColorTheme] = useState<FlyerColorTheme>(initialColorTheme);
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

  // FAQブロックを取得
  const faqBlock = blocks.find(b => b.type === 'faq');
  const faqData = faqBlock?.data as any;

  // お客様の声ブロックを取得
  const testimonialBlock = blocks.find(b => b.type === 'testimonial');
  const testimonialData = testimonialBlock?.data as any;

  // 特徴ブロックを取得
  const featuresBlock = blocks.find(b => b.type === 'features');
  const featuresData = featuresBlock?.data as any;

  // ヒーローブロックを取得
  const heroBlock = blocks.find(b => b.type === 'hero');
  const heroData = heroBlock?.data as any;

  // チェックリストブロックを取得
  const checklistBlock = blocks.find(b => b.type === 'checklist_section');
  const checklistData = checklistBlock?.data as any;


  // レイアウト別のレンダリング
  const renderContent = () => {
    switch (layout) {
      case 'two-column':
        return renderTwoColumnLayout();
      case 'image-focus':
        return renderImageFocusLayout();
      case 'full-info':
        return renderFullInfoLayout();
      case 'professional':
        return renderProfessionalLayout();
      case 'modern-grid':
        return renderModernGridLayout();
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
      {textBlocks.slice(0, 5).map((block, index) => {
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

      {/* 特徴（featuresブロックがある場合） */}
      {featuresData?.items && featuresData.items.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title">{featuresData.title || '特徴'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {featuresData.items.slice(0, 4).map((item: any) => (
              <div key={item.id} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '6px',
                fontSize: '11px',
                padding: '6px',
                background: theme.background,
                borderRadius: '4px'
              }}>
                <span style={{ color: theme.primary }}>{item.icon || '✓'}</span>
                <div>
                  <strong>{item.title}</strong>
                  {item.description && (
                    <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#6B7280' }}>
                      {item.description.slice(0, 40)}{item.description.length > 40 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 料金表 */}
      {pricingData?.plans && pricingData.plans.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title">料金プラン</h2>
          <div className="flyer-pricing">
            {pricingData.plans.slice(0, 4).map((plan: any) => (
              <div key={plan.id} className="flyer-price-card">
                <div className="flyer-price-title">{plan.title}</div>
                <div className="flyer-price-amount">{plan.price}</div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="flyer-price-features" style={{ listStyle: 'none', padding: 0 }}>
                    {plan.features.slice(0, 5).map((feature: string, idx: number) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>✓ {feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* お客様の声（testimonialブロックがある場合） */}
      {testimonialData?.items && testimonialData.items.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title">お客様の声</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {testimonialData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '8px',
                background: '#FAFAFA',
                borderRadius: '4px',
                borderLeft: `2px solid ${theme.accent}`
              }}>
                <p style={{ 
                  fontSize: '10px', 
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  "{item.comment.slice(0, 60)}{item.comment.length > 60 ? '...' : ''}"
                </p>
                <p style={{ 
                  fontSize: '9px', 
                  color: '#6B7280',
                  margin: '4px 0 0',
                  textAlign: 'right'
                }}>
                  — {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ（faqブロックがある場合） */}
      {faqData?.items && faqData.items.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title">よくある質問</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {faqData.items.slice(0, 3).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '6px 8px',
                background: theme.background,
                borderRadius: '4px'
              }}>
                <p style={{ fontSize: '10px', fontWeight: 'bold', margin: 0 }}>
                  Q. {item.question}
                </p>
                <p style={{ fontSize: '9px', color: '#6B7280', margin: '2px 0 0' }}>
                  A. {item.answer.slice(0, 60)}{item.answer.length > 60 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター（QRコード + 連絡先） */}
      <div className="flyer-footer">
        <div className="flyer-contact">
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>お問い合わせ</h3>
          {linksData?.links && linksData.links.length > 0 && (
            <div className="flyer-links">
              {linksData.links.slice(0, 6).map((link: any, idx: number) => (
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
            size={90}
            level="H"
            includeMargin={true}
          />
          <div className="flyer-qr-label">
            詳細はこちら<br />
            <span style={{ fontSize: '8px' }}>{lpUrl}</span>
          </div>
        </div>
      </div>
    </>
  );

  // 2カラムレイアウト
  const renderTwoColumnLayout = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
        {/* 左カラム */}
        <div>
          <div className="flyer-header" style={{ textAlign: 'left', borderBottom: 'none', marginBottom: '10px', paddingBottom: '8px' }}>
            {headerData?.avatar && (
              <img 
                src={headerData.avatar} 
                alt={headerData.name || ''} 
                style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  marginBottom: '10px',
                  border: `2px solid ${theme.primary}`
                }} 
              />
            )}
            <h1 className="flyer-title" style={{ fontSize: '22px', textAlign: 'left' }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p className="flyer-subtitle" style={{ textAlign: 'left', fontSize: '12px' }}>{headerData.title}</p>
            )}
          </div>

          {textBlocks.slice(0, 3).map((block, index) => {
            const data = block.data as any;
            return (
              <div key={block.id || index} className="flyer-section" style={{ marginBottom: '10px' }}>
                {data.title && (
                  <h2 className="flyer-section-title" style={{ fontSize: '14px' }}>{data.title}</h2>
                )}
                {data.text && (
                  <div className="flyer-content" style={{ fontSize: '11px' }}>{data.text}</div>
                )}
              </div>
            );
          })}

          {/* 特徴 */}
          {featuresData?.items && featuresData.items.length > 0 && (
            <div className="flyer-section" style={{ marginBottom: '10px' }}>
              <h2 className="flyer-section-title" style={{ fontSize: '14px' }}>{featuresData.title || '特徴'}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {featuresData.items.slice(0, 4).map((item: any) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '10px'
                  }}>
                    <span style={{ color: theme.primary }}>{item.icon || '✓'}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右カラム */}
        <div>
          {pricingData?.plans && pricingData.plans.length > 0 && (
            <div className="flyer-section" style={{ marginBottom: '10px' }}>
              <h2 className="flyer-section-title" style={{ fontSize: '14px' }}>料金プラン</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pricingData.plans.slice(0, 4).map((plan: any) => (
                  <div key={plan.id} className="flyer-price-card" style={{ padding: '8px' }}>
                    <div className="flyer-price-title" style={{ fontSize: '12px' }}>{plan.title}</div>
                    <div className="flyer-price-amount" style={{ fontSize: '16px' }}>{plan.price}</div>
                    {plan.features && plan.features.length > 0 && (
                      <div style={{ fontSize: '9px', color: '#6B7280' }}>
                        {plan.features.slice(0, 3).join(' / ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* お客様の声 */}
          {testimonialData?.items && testimonialData.items.length > 0 && (
            <div className="flyer-section" style={{ marginBottom: '10px' }}>
              <h2 className="flyer-section-title" style={{ fontSize: '14px' }}>お客様の声</h2>
              {testimonialData.items.slice(0, 2).map((item: any) => (
                <div key={item.id} style={{ 
                  padding: '6px',
                  background: '#FAFAFA',
                  borderRadius: '4px',
                  marginBottom: '6px',
                  borderLeft: `2px solid ${theme.accent}`
                }}>
                  <p style={{ fontSize: '9px', fontStyle: 'italic', margin: 0 }}>
                    "{item.comment.slice(0, 50)}..."
                  </p>
                  <p style={{ fontSize: '8px', color: '#6B7280', margin: '2px 0 0', textAlign: 'right' }}>
                    — {item.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flyer-qr" style={{ marginTop: '10px', textAlign: 'center' }}>
            <QRCodeSVG 
              value={lpUrl} 
              size={100}
              level="H"
              includeMargin={true}
            />
            <div className="flyer-qr-label">
              詳細はこちら<br />
              <span style={{ fontSize: '8px' }}>{lpUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      {faqData?.items && faqData.items.length > 0 && (
        <div className="flyer-section" style={{ marginBottom: '10px' }}>
          <h2 className="flyer-section-title" style={{ fontSize: '14px' }}>よくある質問</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {faqData.items.slice(0, 4).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '6px',
                background: theme.background,
                borderRadius: '4px'
              }}>
                <p style={{ fontSize: '9px', fontWeight: 'bold', margin: 0 }}>Q. {item.question}</p>
                <p style={{ fontSize: '8px', color: '#6B7280', margin: '2px 0 0' }}>
                  A. {item.answer.slice(0, 40)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター */}
      <div className="flyer-footer" style={{ marginTop: '10px', paddingTop: '10px' }}>
        <div className="flyer-contact" style={{ paddingRight: 0, flex: 1 }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>お問い合わせ</h3>
          {linksData?.links && linksData.links.length > 0 && (
            <div className="flyer-links">
              {linksData.links.slice(0, 6).map((link: any, idx: number) => (
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
      <div className="flyer-header" style={{ marginBottom: '12px', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {headerData?.avatar && (
            <img 
              src={headerData.avatar} 
              alt={headerData.name || ''} 
              style={{ 
                width: '55px', 
                height: '55px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: `2px solid ${theme.primary}`
              }} 
            />
          )}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h1 className="flyer-title" style={{ fontSize: '20px', marginBottom: '3px' }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p className="flyer-subtitle" style={{ fontSize: '11px', marginBottom: 0 }}>{headerData.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* メイン画像 */}
      {imageBlocks.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <img 
            src={(imageBlocks[0].data as any).url} 
            alt={(imageBlocks[0].data as any).caption || ''} 
            style={{ 
              width: '100%', 
              height: 'auto',
              maxHeight: '150px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: `1px solid ${theme.border}`
            }} 
          />
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '10px' }}>
        <div>
          {textBlocks.slice(0, 3).map((block, index) => {
            const data = block.data as any;
            return (
              <div key={block.id || index} className="flyer-section" style={{ marginBottom: '8px' }}>
                {data.title && (
                  <h2 className="flyer-section-title" style={{ fontSize: '13px' }}>{data.title}</h2>
                )}
                {data.text && (
                  <div className="flyer-content" style={{ fontSize: '10px' }}>{data.text}</div>
                )}
              </div>
            );
          })}

          {/* 特徴 */}
          {featuresData?.items && featuresData.items.length > 0 && (
            <div className="flyer-section" style={{ marginBottom: '8px' }}>
              <h2 className="flyer-section-title" style={{ fontSize: '13px' }}>{featuresData.title || '特徴'}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {featuresData.items.slice(0, 4).map((item: any) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '9px'
                  }}>
                    <span style={{ color: theme.primary }}>{item.icon || '✓'}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flyer-qr" style={{ textAlign: 'center', marginBottom: '10px' }}>
            <QRCodeSVG 
              value={lpUrl} 
              size={80}
              level="H"
              includeMargin={true}
            />
            <div className="flyer-qr-label" style={{ fontSize: '9px' }}>
              詳細はこちら
            </div>
          </div>

          {linksData?.links && linksData.links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {linksData.links.slice(0, 4).map((link: any, idx: number) => (
                <div key={idx} className="flyer-link-item" style={{ fontSize: '9px', padding: '4px' }}>
                  {link.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 料金表（コンパクト） */}
      {pricingData?.plans && pricingData.plans.length > 0 && (
        <div className="flyer-section" style={{ marginBottom: '10px' }}>
          <h2 className="flyer-section-title" style={{ fontSize: '13px' }}>料金プラン</h2>
          <div className="flyer-pricing">
            {pricingData.plans.slice(0, 4).map((plan: any) => (
              <div key={plan.id} className="flyer-price-card" style={{ padding: '8px' }}>
                <div className="flyer-price-title" style={{ fontSize: '11px' }}>{plan.title}</div>
                <div className="flyer-price-amount" style={{ fontSize: '15px' }}>{plan.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* お客様の声 */}
      {testimonialData?.items && testimonialData.items.length > 0 && (
        <div className="flyer-section" style={{ marginBottom: '10px' }}>
          <h2 className="flyer-section-title" style={{ fontSize: '13px' }}>お客様の声</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {testimonialData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '6px',
                background: '#FAFAFA',
                borderRadius: '4px',
                borderLeft: `2px solid ${theme.accent}`
              }}>
                <p style={{ fontSize: '9px', fontStyle: 'italic', margin: 0 }}>
                  "{item.comment.slice(0, 40)}..."
                </p>
                <p style={{ fontSize: '8px', color: '#6B7280', margin: '2px 0 0', textAlign: 'right' }}>
                  — {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {faqData?.items && faqData.items.length > 0 && (
        <div className="flyer-section">
          <h2 className="flyer-section-title" style={{ fontSize: '13px' }}>よくある質問</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {faqData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '4px 6px',
                background: theme.background,
                borderRadius: '3px'
              }}>
                <p style={{ fontSize: '9px', fontWeight: 'bold', margin: 0 }}>Q. {item.question}</p>
                <p style={{ fontSize: '8px', color: '#6B7280', margin: '1px 0 0' }}>
                  A. {item.answer.slice(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  // フル情報レイアウト（A4いっぱいに情報を詰め込む）
  const renderFullInfoLayout = () => (
    <div className="full-info-layout">
      {/* ヘッダー（コンパクト） */}
      <div className="flyer-header-compact">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {headerData?.avatar && (
            <img 
              src={headerData.avatar} 
              alt={headerData.name || ''} 
              style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: `2px solid ${theme.primary}`
              }} 
            />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: 'bold', 
              color: theme.text,
              margin: 0,
              lineHeight: 1.2
            }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '2px 0 0 0'
              }}>{headerData.title}</p>
            )}
          </div>
        </div>
      </div>

      {/* キャッチコピー（ヒーローまたは最初のテキスト） */}
      {(heroData || textBlocks.length > 0) && (
        <div style={{ 
          background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}15 100%)`,
          padding: '10px 12px',
          borderRadius: '6px',
          marginBottom: '12px',
          borderLeft: `3px solid ${theme.primary}`
        }}>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: '600',
            color: theme.text,
            margin: 0,
            lineHeight: 1.5
          }}>
            {heroData?.headline || (textBlocks[0]?.data as any)?.title || ''}
          </p>
          {(heroData?.subheadline || (textBlocks[0]?.data as any)?.text) && (
            <p style={{ 
              fontSize: '11px', 
              color: '#6B7280',
              margin: '4px 0 0 0',
              lineHeight: 1.4
            }}>
              {heroData?.subheadline || (textBlocks[0]?.data as any)?.text?.slice(0, 100)}
              {((textBlocks[0]?.data as any)?.text?.length > 100) ? '...' : ''}
            </p>
          )}
        </div>
      )}

      {/* 2カラム: 特徴・強み + 料金プラン */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        {/* 左カラム: 特徴・強み */}
        <div>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: `1px solid ${theme.border}`
          }}>
            {featuresData?.title || checklistData?.title || '特徴・強み'}
          </h3>
          
          {/* 特徴ブロックがある場合 */}
          {featuresData?.items && featuresData.items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {featuresData.items.slice(0, 4).map((item: any) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '6px',
                  fontSize: '10px',
                  lineHeight: 1.4
                }}>
                  <span style={{ color: theme.primary, flexShrink: 0 }}>
                    {item.icon || '✓'}
                  </span>
                  <div>
                    <strong style={{ color: theme.text }}>{item.title}</strong>
                    {item.description && (
                      <span style={{ color: '#6B7280', marginLeft: '4px' }}>
                        {item.description.slice(0, 30)}{item.description.length > 30 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : checklistData?.items && checklistData.items.length > 0 ? (
            /* チェックリストブロックがある場合 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {checklistData.items.slice(0, 4).map((item: any) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '6px',
                  fontSize: '10px',
                  lineHeight: 1.4
                }}>
                  <span style={{ color: theme.primary, flexShrink: 0 }}>
                    {item.icon || '✓'}
                  </span>
                  <span style={{ color: theme.text }}>{item.title}</span>
                </div>
              ))}
            </div>
          ) : textBlocks.length > 1 ? (
            /* テキストブロックから特徴を抽出 */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {textBlocks.slice(1, 5).map((block, index) => {
                const data = block.data as any;
                return (
                  <div key={block.id || index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '6px',
                    fontSize: '10px',
                    lineHeight: 1.4
                  }}>
                    <span style={{ color: theme.primary, flexShrink: 0 }}>✓</span>
                    <span style={{ color: theme.text }}>
                      {data.title || data.text?.slice(0, 40)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: '10px', color: '#9CA3AF' }}>特徴情報がありません</p>
          )}
        </div>

        {/* 右カラム: 料金プラン */}
        <div>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: `1px solid ${theme.border}`
          }}>
            料金プラン
          </h3>
          
          {pricingData?.plans && pricingData.plans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pricingData.plans.slice(0, 3).map((plan: any) => (
                <div key={plan.id} style={{ 
                  padding: '8px',
                  background: plan.isRecommended ? `${theme.primary}10` : theme.background,
                  borderRadius: '4px',
                  border: plan.isRecommended ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme.text }}>
                      {plan.title}
                      {plan.isRecommended && (
                        <span style={{ 
                          fontSize: '8px', 
                          background: theme.primary, 
                          color: 'white',
                          padding: '1px 4px',
                          borderRadius: '2px',
                          marginLeft: '4px'
                        }}>おすすめ</span>
                      )}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary }}>
                      {plan.price}
                    </span>
                  </div>
                  {plan.features && plan.features.length > 0 && (
                    <div style={{ fontSize: '9px', color: '#6B7280' }}>
                      {plan.features.slice(0, 2).join(' / ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '10px', color: '#9CA3AF' }}>料金情報がありません</p>
          )}
        </div>
      </div>

      {/* お客様の声 */}
      {testimonialData?.items && testimonialData.items.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: `1px solid ${theme.border}`
          }}>
            お客様の声
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {testimonialData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '8px',
                background: '#FAFAFA',
                borderRadius: '4px',
                borderLeft: `2px solid ${theme.accent}`
              }}>
                <p style={{ 
                  fontSize: '10px', 
                  color: theme.text,
                  margin: 0,
                  lineHeight: 1.5,
                  fontStyle: 'italic'
                }}>
                  "{item.comment.slice(0, 60)}{item.comment.length > 60 ? '...' : ''}"
                </p>
                <p style={{ 
                  fontSize: '9px', 
                  color: '#6B7280',
                  margin: '4px 0 0 0',
                  textAlign: 'right'
                }}>
                  — {item.name}{item.role ? ` (${item.role})` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* よくある質問 */}
      {faqData?.items && faqData.items.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: `1px solid ${theme.border}`
          }}>
            よくある質問
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {faqData.items.slice(0, 3).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '6px 8px',
                background: theme.background,
                borderRadius: '4px'
              }}>
                <p style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold',
                  color: theme.text,
                  margin: 0
                }}>
                  Q. {item.question}
                </p>
                <p style={{ 
                  fontSize: '9px', 
                  color: '#6B7280',
                  margin: '2px 0 0 0',
                  lineHeight: 1.4
                }}>
                  A. {item.answer.slice(0, 80)}{item.answer.length > 80 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター: 連絡先 + QRコード */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '12px',
        paddingTop: '10px',
        borderTop: `2px solid ${theme.border}`,
        marginTop: 'auto'
      }}>
        {/* 連絡先 */}
        <div>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: 'bold', 
            color: theme.text,
            marginBottom: '6px'
          }}>
            お問い合わせ・ご予約
          </h3>
          {linksData?.links && linksData.links.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '4px' 
            }}>
              {linksData.links.slice(0, 6).map((link: any, idx: number) => (
                <div key={idx} style={{ 
                  fontSize: '9px',
                  color: theme.primary,
                  padding: '4px 6px',
                  background: theme.background,
                  borderRadius: '3px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {link.label}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '10px', color: '#9CA3AF' }}>連絡先情報がありません</p>
          )}
        </div>

        {/* QRコード */}
        <div style={{ textAlign: 'center' }}>
          <QRCodeSVG 
            value={lpUrl} 
            size={70}
            level="H"
            includeMargin={false}
          />
          <p style={{ 
            fontSize: '8px', 
            color: '#6B7280',
            margin: '4px 0 0 0'
          }}>
            詳細はこちら
          </p>
        </div>
      </div>
    </div>
  );

  // プロフェッショナルレイアウト（商用向け・AI生成対応）
  const renderProfessionalLayout = () => (
    <div className="professional-layout">
      {/* ヘッダーバナー */}
      <div style={{ 
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '16px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {headerData?.avatar && (
          <img 
            src={headerData.avatar} 
            alt={headerData.name || ''} 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '12px', 
              objectFit: 'cover',
              border: '3px solid white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }} 
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0,
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {headerData?.name || 'ビジネスLP'}
          </h1>
          {headerData?.title && (
            <p style={{ 
              fontSize: '14px', 
              margin: '6px 0 0 0',
              opacity: 0.95
            }}>{headerData.title}</p>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <QRCodeSVG 
            value={lpUrl} 
            size={80}
            level="H"
            includeMargin={false}
            bgColor="white"
            fgColor={theme.primary}
          />
          <p style={{ fontSize: '9px', marginTop: '4px', opacity: 0.9 }}>詳細はこちら</p>
        </div>
      </div>

      {/* キャッチコピー */}
      {(heroData?.headline || textBlocks[0]) && (
        <div style={{ 
          background: `${theme.primary}08`,
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '16px',
          borderLeft: `4px solid ${theme.primary}`
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: theme.text,
            margin: '0 0 8px 0',
            lineHeight: 1.4
          }}>
            {heroData?.headline || (textBlocks[0]?.data as any)?.title || ''}
          </h2>
          {(heroData?.subheadline || (textBlocks[0]?.data as any)?.text) && (
            <p style={{ 
              fontSize: '13px', 
              color: '#4B5563',
              margin: 0,
              lineHeight: 1.6
            }}>
              {heroData?.subheadline || (textBlocks[0]?.data as any)?.text}
            </p>
          )}
        </div>
      )}

      {/* 3カラムグリッド: 特徴・料金・お客様の声 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* 特徴 */}
        <div style={{ 
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${theme.primary}`
          }}>
            ✨ 特徴・強み
          </h3>
          {featuresData?.items && featuresData.items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuresData.items.slice(0, 4).map((item: any) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '8px',
                  fontSize: '11px',
                  lineHeight: 1.5
                }}>
                  <span style={{ 
                    color: theme.primary, 
                    fontSize: '16px',
                    flexShrink: 0
                  }}>
                    {item.icon || '✓'}
                  </span>
                  <div>
                    <strong style={{ color: theme.text, display: 'block' }}>{item.title}</strong>
                    {item.description && (
                      <span style={{ color: '#6B7280', fontSize: '10px' }}>
                        {item.description.slice(0, 50)}{item.description.length > 50 ? '...' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {textBlocks.slice(1, 5).map((block, index) => {
                const data = block.data as any;
                return (
                  <div key={block.id || index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px',
                    fontSize: '11px'
                  }}>
                    <span style={{ color: theme.primary, fontSize: '16px' }}>✓</span>
                    <span style={{ color: theme.text }}>
                      {data.title || data.text?.slice(0, 40)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 料金プラン */}
        <div style={{ 
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${theme.primary}`
          }}>
            💰 料金プラン
          </h3>
          {pricingData?.plans && pricingData.plans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pricingData.plans.slice(0, 3).map((plan: any) => (
                <div key={plan.id} style={{ 
                  padding: '12px',
                  background: plan.isRecommended ? `${theme.primary}08` : '#F9FAFB',
                  borderRadius: '6px',
                  border: plan.isRecommended ? `2px solid ${theme.primary}` : '1px solid #E5E7EB'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: theme.text }}>
                      {plan.title}
                    </span>
                    {plan.isRecommended && (
                      <span style={{ 
                        fontSize: '9px', 
                        background: theme.primary, 
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>人気</span>
                    )}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.primary, marginBottom: '6px' }}>
                    {plan.price}
                  </div>
                  {plan.features && plan.features.length > 0 && (
                    <div style={{ fontSize: '9px', color: '#6B7280', lineHeight: 1.4 }}>
                      {plan.features.slice(0, 2).join(' / ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', margin: '20px 0' }}>
              料金情報はお問い合わせください
            </p>
          )}
        </div>

        {/* お客様の声 */}
        <div style={{ 
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${theme.primary}`
          }}>
            💬 お客様の声
          </h3>
          {testimonialData?.items && testimonialData.items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {testimonialData.items.slice(0, 2).map((item: any) => (
                <div key={item.id} style={{ 
                  padding: '10px',
                  background: '#FAFAFA',
                  borderRadius: '6px',
                  borderLeft: `3px solid ${theme.accent}`
                }}>
                  <p style={{ 
                    fontSize: '10px', 
                    color: theme.text,
                    margin: 0,
                    lineHeight: 1.5,
                    fontStyle: 'italic'
                  }}>
                    "{item.comment.slice(0, 70)}{item.comment.length > 70 ? '...' : ''}"
                  </p>
                  <p style={{ 
                    fontSize: '9px', 
                    color: '#6B7280',
                    margin: '6px 0 0 0',
                    textAlign: 'right'
                  }}>
                    — {item.name}{item.role ? ` (${item.role})` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', margin: '20px 0' }}>
              お客様の声を募集中
            </p>
          )}
        </div>
      </div>

      {/* FAQ（2カラム） */}
      {faqData?.items && faqData.items.length > 0 && (
        <div style={{ 
          background: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `2px solid ${theme.primary}`
          }}>
            ❓ よくある質問
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {faqData.items.slice(0, 4).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '10px',
                background: `${theme.primary}05`,
                borderRadius: '6px',
                border: `1px solid ${theme.border}`
              }}>
                <p style={{ 
                  fontSize: '11px', 
                  fontWeight: 'bold',
                  color: theme.text,
                  margin: '0 0 4px 0'
                }}>
                  Q. {item.question}
                </p>
                <p style={{ 
                  fontSize: '10px', 
                  color: '#6B7280',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  A. {item.answer.slice(0, 80)}{item.answer.length > 80 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* フッター（連絡先） */}
      <div style={{ 
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
        padding: '16px 20px',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          margin: '0 0 10px 0'
        }}>
          📞 お問い合わせ・ご予約
        </h3>
        {linksData?.links && linksData.links.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px' 
          }}>
            {linksData.links.slice(0, 6).map((link: any, idx: number) => (
              <div key={idx} style={{ 
                fontSize: '11px',
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}>
                {link.label}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '12px', margin: 0, opacity: 0.9 }}>
            お気軽にお問い合わせください
          </p>
        )}
      </div>
    </div>
  );

  // モダングリッドレイアウト（画像・カード重視）
  const renderModernGridLayout = () => (
    <div className="modern-grid-layout">
      {/* コンパクトヘッダー */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: `3px solid ${theme.primary}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {headerData?.avatar && (
            <img 
              src={headerData.avatar} 
              alt={headerData.name || ''} 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '12px', 
                objectFit: 'cover',
                border: `2px solid ${theme.primary}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          )}
          <div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: theme.text,
              margin: 0,
              lineHeight: 1.2
            }}>
              {headerData?.name || 'ビジネスLP'}
            </h1>
            {headerData?.title && (
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>{headerData.title}</p>
            )}
          </div>
        </div>
        <QRCodeSVG 
          value={lpUrl} 
          size={70}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* メインビジュアル + キャッチコピー */}
      {imageBlocks.length > 0 && (
        <div style={{ 
          position: 'relative',
          marginBottom: '16px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={(imageBlocks[0].data as any).url} 
            alt={(imageBlocks[0].data as any).caption || ''} 
            style={{ 
              width: '100%', 
              height: '180px',
              objectFit: 'cover'
            }} 
          />
          {(heroData?.headline || textBlocks[0]) && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '20px 16px 16px',
              color: 'white'
            }}>
              <h2 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {heroData?.headline || (textBlocks[0]?.data as any)?.title || ''}
              </h2>
            </div>
          )}
        </div>
      )}

      {/* カードグリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {/* 特徴カード */}
        {featuresData?.items && featuresData.items.length > 0 && featuresData.items.slice(0, 4).map((item: any) => (
          <div key={item.id} style={{ 
            background: 'white',
            padding: '14px',
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s'
          }}>
            <div style={{ 
              fontSize: '24px',
              marginBottom: '8px',
              color: theme.primary
            }}>
              {item.icon || '✨'}
            </div>
            <h4 style={{ 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: theme.text,
              margin: '0 0 4px 0'
            }}>
              {item.title}
            </h4>
            {item.description && (
              <p style={{ 
                fontSize: '10px', 
                color: '#6B7280',
                margin: 0,
                lineHeight: 1.4
              }}>
                {item.description.slice(0, 50)}{item.description.length > 50 ? '...' : ''}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 料金プラン（横並び） */}
      {pricingData?.plans && pricingData.plans.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: theme.primary,
            marginBottom: '10px'
          }}>
            料金プラン
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pricingData.plans.length, 3)}, 1fr)`, gap: '10px' }}>
            {pricingData.plans.slice(0, 3).map((plan: any) => (
              <div key={plan.id} style={{ 
                background: plan.isRecommended 
                  ? `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}15 100%)`
                  : 'white',
                padding: '14px',
                borderRadius: '10px',
                border: plan.isRecommended ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                textAlign: 'center',
                position: 'relative'
              }}>
                {plan.isRecommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: theme.primary,
                    color: 'white',
                    fontSize: '9px',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    おすすめ
                  </div>
                )}
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: theme.text, marginBottom: '6px' }}>
                  {plan.title}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.primary, marginBottom: '6px' }}>
                  {plan.price}
                </div>
                {plan.features && plan.features.length > 0 && (
                  <div style={{ fontSize: '9px', color: '#6B7280', lineHeight: 1.3 }}>
                    {plan.features.slice(0, 2).map((f: string, i: number) => (
                      <div key={i}>✓ {f}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* お客様の声 + FAQ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* お客様の声 */}
        {testimonialData?.items && testimonialData.items.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: theme.primary,
              marginBottom: '8px'
            }}>
              お客様の声
            </h3>
            {testimonialData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '10px',
                background: '#FAFAFA',
                borderRadius: '8px',
                marginBottom: '8px',
                borderLeft: `3px solid ${theme.accent}`
              }}>
                <p style={{ 
                  fontSize: '10px', 
                  fontStyle: 'italic',
                  margin: '0 0 4px 0',
                  lineHeight: 1.4
                }}>
                  "{item.comment.slice(0, 60)}..."
                </p>
                <p style={{ 
                  fontSize: '9px', 
                  color: '#6B7280',
                  margin: 0,
                  textAlign: 'right'
                }}>
                  — {item.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        {faqData?.items && faqData.items.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: theme.primary,
              marginBottom: '8px'
            }}>
              よくある質問
            </h3>
            {faqData.items.slice(0, 2).map((item: any) => (
              <div key={item.id} style={{ 
                padding: '8px 10px',
                background: `${theme.primary}08`,
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                <p style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold',
                  margin: '0 0 3px 0'
                }}>
                  Q. {item.question}
                </p>
                <p style={{ 
                  fontSize: '9px', 
                  color: '#6B7280',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  A. {item.answer.slice(0, 60)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      <div style={{ 
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
        padding: '14px 16px',
        borderRadius: '10px',
        color: 'white',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          お問い合わせ
        </h3>
        {linksData?.links && linksData.links.length > 0 ? (
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center'
          }}>
            {linksData.links.slice(0, 5).map((link: any, idx: number) => (
              <span key={idx} style={{ 
                fontSize: '10px',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                {link.label}
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '11px', margin: 0 }}>お気軽にお問い合わせください</p>
        )}
      </div>
    </div>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {(['professional', 'modern-grid', 'full-info', 'two-column', 'simple', 'image-focus'] as FlyerLayout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: layout === l ? `2px solid ${theme.primary}` : '2px solid #E5E7EB',
                    background: layout === l ? theme.background : 'white',
                    color: layout === l ? theme.primary : '#6B7280',
                    fontSize: '12px',
                    fontWeight: layout === l ? 'bold' : 'normal',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minHeight: '40px'
                  }}
                  className="md:text-sm"
                >
                  {l === 'professional' ? '🏢 プロフェッショナル' : 
                   l === 'modern-grid' ? '🎨 モダングリッド' :
                   l === 'full-info' ? '📋 フル情報' :
                   l === 'two-column' ? '📰 2カラム' :
                   l === 'simple' ? '📄 シンプル' : '🖼️ 画像重視'}
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
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                minHeight: '44px',
                width: '100%'
              }}
              className="md:text-base md:px-8 md:py-4"
            >
              🖨️ 印刷 / PDFで保存
            </button>
          </div>
          <p style={{ marginTop: '8px', fontSize: '11px', color: '#6B7280', textAlign: 'center' }} className="md:text-xs">
            印刷ダイアログで「PDFに保存」を選択すると、PDFファイルとして保存できます
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
            padding: 12mm;
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
            padding: 12mm;
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

        /* フル情報レイアウト用スタイル */
        .full-info-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: calc(297mm - 24mm);
        }

        .flyer-header-compact {
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 2px solid ${theme.primary};
        }

        .flyer-header {
          text-align: center;
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 2px solid ${theme.primary};
        }

        .flyer-title {
          font-size: 26px;
          font-weight: bold;
          color: ${theme.text};
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .flyer-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .flyer-section {
          margin-bottom: 12px;
          page-break-inside: avoid;
        }

        .flyer-section-title {
          font-size: 16px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid ${theme.border};
        }

        .flyer-content {
          font-size: 12px;
          line-height: 1.6;
          color: ${theme.text};
          white-space: pre-wrap;
        }

        .flyer-footer {
          margin-top: 15px;
          padding-top: 12px;
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
          font-size: 10px;
          color: #6B7280;
          margin-top: 6px;
          line-height: 1.3;
        }

        .flyer-contact {
          flex: 1;
          padding-right: 15px;
        }

        .flyer-links {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
          margin-top: 8px;
        }

        .flyer-link-item {
          font-size: 10px;
          color: ${theme.primary};
          padding: 6px;
          background: ${theme.background};
          border-radius: 4px;
          text-align: center;
          font-weight: 500;
        }

        .flyer-pricing {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .flyer-price-card {
          border: 1px solid ${theme.border};
          border-radius: 6px;
          padding: 10px;
          text-align: center;
          background: ${theme.background};
        }

        .flyer-price-title {
          font-size: 13px;
          font-weight: bold;
          color: ${theme.text};
          margin-bottom: 4px;
        }

        .flyer-price-amount {
          font-size: 18px;
          font-weight: bold;
          color: ${theme.primary};
          margin-bottom: 6px;
        }

        .flyer-price-features {
          font-size: 9px;
          color: #6B7280;
          text-align: left;
          line-height: 1.5;
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
