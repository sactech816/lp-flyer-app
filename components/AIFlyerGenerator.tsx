"use client";

import React, { useState, useCallback } from 'react';
import { Block } from '@/lib/types';

export type AIGenerationMode = 'background' | 'full';
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
      features: [],
    };
  }, [blocks]);

  // AI画像生成
  const generateImage = async () => {
    setState({ isGenerating: true, progress: '準備中...', error: null });

    try {
      const businessInfo = extractBusinessInfo();

      setState(prev => ({ ...prev, progress: 'AIで画像を生成中...' }));

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
        onImageGenerated(result.image.data, result.image.mimeType, mode);
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

  const modeLabels = {
    background: '背景のみ生成',
    full: 'チラシ全体を生成（実験的）',
  };

  const styleLabels = {
    modern: 'モダン',
    traditional: 'トラディショナル',
    minimal: 'ミニマル',
    vibrant: 'ビビッド',
  };

  return (
    <div className="ai-flyer-generator" style={{
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      marginBottom: '16px',
    }}>
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
          AI画像生成（Gemini）
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
      <div style={{ marginBottom: '12px' }}>
        <label style={{
          display: 'block',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          marginBottom: '6px',
        }}>
          生成モード
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(Object.keys(modeLabels) as AIGenerationMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={state.isGenerating}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === m ? 'white' : 'rgba(255,255,255,0.2)',
                color: mode === m ? '#667eea' : 'white',
                fontSize: '12px',
                fontWeight: mode === m ? 'bold' : 'normal',
                cursor: state.isGenerating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: state.isGenerating ? 0.5 : 1,
              }}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* スタイル選択 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          marginBottom: '6px',
        }}>
          デザインスタイル
        </label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.keys(styleLabels) as AIStyle[]).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              disabled={state.isGenerating}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: style === s ? 'white' : 'rgba(255,255,255,0.2)',
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
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          background: state.isGenerating 
            ? 'rgba(255,255,255,0.3)' 
            : 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: state.isGenerating ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {state.isGenerating ? (
          <>
            <svg 
              className="animate-spin" 
              width="20" 
              height="20" 
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            AIで画像を生成
          </>
        )}
      </button>

      {/* エラー表示 */}
      {state.error && (
        <div style={{
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '12px',
        }}>
          <strong>エラー:</strong> {state.error}
        </div>
      )}

      {/* 注意事項 */}
      <p style={{
        marginTop: '12px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '10px',
        lineHeight: 1.5,
      }}>
        ※ AI生成には数秒〜数十秒かかります。
        {mode === 'full' && ' 完全生成モードでは日本語テキストの精度に課題がある場合があります。'}
      </p>

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

