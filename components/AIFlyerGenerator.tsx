"use client";

import React, { useState, useCallback } from 'react';
import { Block } from '@/lib/types';

export type AIGenerationMode = 'background' | 'full' | 'full-no-text';
export type AIStyle = 'modern' | 'traditional' | 'minimal' | 'vibrant';

interface AIFlyerGeneratorProps {
  blocks: Block[];
  slug: string;
  theme: 'business' | 'creative' | 'shop' | 'custom';
  onImageGenerated: (imageData: string, mimeType: string, mode: AIGenerationMode) => void;
  onError: (error: string) => void;
}

interface GenerationState {
  isGenerating: boolean;
  progress: string;
  error: string | null;
}

// モード情報
const modeInfo = {
  background: {
    label: '🎨 背景のみ生成',
    description: 'AI背景 + テンプレートでテキスト表示',
    recommended: true,
    warning: null,
  },
  'full-no-text': {
    label: '🖼️ デザインのみ（テキストなし）',
    description: 'レイアウトデザインを生成（テキストは後で追加）',
    recommended: false,
    warning: null,
  },
  full: {
    label: '📄 チラシ全体を生成',
    description: 'テキスト含むチラシ全体をAIで生成',
    recommended: false,
    warning: '⚠️ 日本語テキストが文字化けする可能性があります',
  },
};

const styleLabels = {
  modern: 'モダン',
  traditional: 'トラディショナル',
  minimal: 'ミニマル',
  vibrant: 'ビビッド',
};

export const AIFlyerGenerator: React.FC<AIFlyerGeneratorProps> = ({
  blocks,
  slug,
  theme,
  onImageGenerated,
  onError,
}) => {
  const [mode, setMode] = useState<AIGenerationMode>('background');
  const [style, setStyle] = useState<AIStyle>('modern');
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: '',
    error: null,
  });

  // ブロックからビジネス情報を抽出
  const extractBusinessInfo = useCallback(() => {
    const headerBlock = blocks.find(b => b.type === 'header');
    const headerData = headerBlock?.data as any;

    const textBlocks = blocks.filter(b => b.type === 'text_card');
    const descriptions = textBlocks
      .map(b => (b.data as any).text)
      .filter(Boolean)
      .slice(0, 2);

    const pricingBlock = blocks.find(b => b.type === 'pricing');
    const pricingData = pricingBlock?.data as any;
    const priceRange = pricingData?.plans?.[0]?.price;

    const linksBlock = blocks.find(b => b.type === 'links');
    const linksData = linksBlock?.data as any;
    const contactInfo = linksData?.links
      ?.map((l: any) => l.label)
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');

    const featuresBlock = blocks.find(b => b.type === 'features');
    const featuresData = featuresBlock?.data as any;

    return {
      businessName: headerData?.name || 'ビジネス',
      title: headerData?.title || '',
      description: descriptions.join(' '),
      priceRange: priceRange || '',
      contactInfo: contactInfo || '',
      services: textBlocks
        .map(b => (b.data as any).title)
        .filter(Boolean)
        .slice(0, 5),
      features: featuresData?.items?.map((i: any) => i.title).filter(Boolean).slice(0, 5) || [],
    };
  }, [blocks]);

  // AI画像生成
  const generateImage = async () => {
    setState({ isGenerating: true, progress: '準備中...', error: null });

    try {
      const businessInfo = extractBusinessInfo();

      setState(prev => ({ ...prev, progress: 'AIで画像を生成中...（10〜30秒）' }));

      const response = await fetch('/api/generate-flyer-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          theme,
          style,
          ...businessInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || '画像生成に失敗しました');
      }

      const result = await response.json();

      if (result.success && result.image) {
        setState(prev => ({ ...prev, progress: '完了！' }));
        // full-no-text の場合も background として扱う（背景として使用）
        const effectiveMode = mode === 'full-no-text' ? 'background' : mode;
        onImageGenerated(result.image.data, result.image.mimeType, effectiveMode as 'background' | 'full');
      } else {
        throw new Error(result.error || '画像データが取得できませんでした');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      setState(prev => ({ ...prev, error: errorMessage }));
      onError(errorMessage);
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const currentModeInfo = modeInfo[mode];

  return (
    <div className="ai-flyer-generator" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      marginBottom: '16px',
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <h3 style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          margin: 0,
        }}>
          AI画像生成（Gemini 2.0）
        </h3>
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '10px',
          padding: '2px 8px',
          borderRadius: '10px',
        }}>
          Beta
        </span>
      </div>

      {/* 生成モード選択 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          marginBottom: '8px',
          fontWeight: 'bold',
        }}>
          生成モード
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(Object.keys(modeInfo) as AIGenerationMode[]).map((m) => {
            const info = modeInfo[m];
            const isSelected = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                disabled={state.isGenerating}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid white' : '2px solid transparent',
                  background: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                  color: isSelected ? '#667eea' : 'white',
                  fontSize: '13px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: state.isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: state.isGenerating ? 0.5 : 1,
                  textAlign: 'left',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{info.label}</span>
                  {info.recommended && (
                    <span style={{
                      background: isSelected ? '#10B981' : 'rgba(16, 185, 129, 0.8)',
                      color: 'white',
                      fontSize: '9px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                    }}>
                      推奨
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '10px',
                  margin: '4px 0 0 0',
                  opacity: 0.8,
                  color: isSelected ? '#6B7280' : 'rgba(255,255,255,0.8)',
                }}>
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 警告表示 */}
      {currentModeInfo.warning && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(251, 191, 36, 0.2)',
          borderRadius: '8px',
          marginBottom: '12px',
          border: '1px solid rgba(251, 191, 36, 0.5)',
        }}>
          <p style={{
            fontSize: '11px',
            color: '#FCD34D',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {currentModeInfo.warning}
          </p>
        </div>
      )}

      {/* スタイル選択 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          marginBottom: '8px',
          fontWeight: 'bold',
        }}>
          デザインスタイル
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {(Object.keys(styleLabels) as AIStyle[]).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              disabled={state.isGenerating}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: style === s ? '2px solid white' : '2px solid transparent',
                background: style === s ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
                color: style === s ? '#667eea' : 'white',
                fontSize: '11px',
                fontWeight: style === s ? 'bold' : 'normal',
                cursor: state.isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: state.isGenerating ? 0.5 : 1,
              }}
            >
              {styleLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* 生成ボタン */}
      <button
        onClick={generateImage}
        disabled={state.isGenerating}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          background: state.isGenerating 
            ? 'rgba(255,255,255,0.3)' 
            : 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
          color: 'white',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: state.isGenerating ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          boxShadow: state.isGenerating ? 'none' : '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {state.isGenerating ? (
          <>
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            {state.progress}
          </>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            ✨ AIで画像を生成
          </>
        )}
      </button>

      {/* エラー表示 */}
      {state.error && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '12px',
          border: '1px solid rgba(239, 68, 68, 0.5)',
        }}>
          <strong>❌ エラー:</strong> {state.error}
        </div>
      )}

      {/* 情報・ヒント */}
      <div style={{
        marginTop: '14px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '10px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          💡 <strong>ヒント:</strong> 日本語テキストを正確に表示したい場合は「背景のみ生成」モードを使用し、
          テキストはテンプレートで表示することをお勧めします。A4比率（210×297mm）で生成されます。
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AIFlyerGenerator;
