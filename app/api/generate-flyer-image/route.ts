import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel Serverless Function の設定
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

interface FlyerGenerationRequest {
  mode: 'background' | 'full';
  businessName: string;
  title?: string;
  description?: string;
  services?: string[];
  priceRange?: string;
  theme?: 'business' | 'creative' | 'shop' | 'custom';
  style?: 'modern' | 'traditional' | 'minimal' | 'vibrant';
  contactInfo?: string;
  features?: string[];
}

// テーマに応じたプロンプト修飾子
const themeModifiers = {
  business: "professional corporate design with blue color scheme, clean geometric patterns, subtle gradients",
  creative: "artistic vibrant design with pink and purple gradients, dynamic flowing shapes, creative energy",
  shop: "warm inviting design with green accents, friendly organic shapes, welcoming atmosphere",
  custom: "elegant sophisticated design with indigo tones, refined patterns, premium feel"
};

// スタイルに応じたプロンプト修飾子
const styleModifiers = {
  modern: "minimalist flat design, geometric shapes, clean lines, contemporary aesthetic",
  traditional: "classic elegant patterns, ornate decorative elements, timeless sophistication",
  minimal: "ultra clean white space, subtle textures, simple refined elements",
  vibrant: "bold energetic colors, dynamic patterns, eye-catching visual impact"
};

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          hint: 'GEMINI_API_KEY環境変数を設定してください'
        },
        { status: 500 }
      );
    }

    const body: FlyerGenerationRequest = await request.json();
    const { 
      mode = 'background',
      businessName,
      title,
      description,
      services,
      priceRange,
      theme = 'business',
      style = 'modern',
      contactInfo,
      features
    } = body;

    if (!businessName) {
      return NextResponse.json(
        { error: 'businessName is required' },
        { status: 400 }
      );
    }

    // Gemini APIクライアントの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Imagen 3 モデルを使用（画像生成用）
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        // @ts-ignore - responseModalities is valid for image generation
        responseModalities: ["image", "text"],
      }
    });

    let prompt: string;

    if (mode === 'background') {
      // 背景画像生成用プロンプト
      prompt = `Generate a beautiful decorative background image for a business flyer.

Business: "${businessName}"
${title ? `Type: ${title}` : ''}

Design Style: ${themeModifiers[theme]}
Visual Approach: ${styleModifiers[style]}

CRITICAL Requirements:
- Abstract decorative pattern or gradient background ONLY
- DO NOT include any text, letters, numbers, or words
- Leave large open spaces for text overlay (especially center and bottom areas)
- Soft, professional appearance suitable for A4 print
- Portrait orientation (taller than wide, like A4 paper)
- High resolution, print quality
- Colors should be subtle and not overpower future text overlay
- Focus on corners and edges for decorative elements
- Keep the center relatively clean/light for content placement

This is ONLY a background - text will be added separately by software.`;

    } else {
      // フルチラシ生成用プロンプト（実験的）
      prompt = `Create a complete professional A4 flyer design.

Business Information:
- Name: ${businessName}
${title ? `- Tagline: ${title}` : ''}
${description ? `- About: ${description}` : ''}
${services?.length ? `- Services: ${services.join(', ')}` : ''}
${priceRange ? `- Pricing: ${priceRange}` : ''}
${features?.length ? `- Features: ${features.join(', ')}` : ''}
${contactInfo ? `- Contact: ${contactInfo}` : ''}

Design Requirements:
- Professional ${themeModifiers[theme]}
- ${styleModifiers[style]}
- A4 portrait format
- Clear visual hierarchy with prominent business name at top
- Include all provided information in an organized layout
- Reserve space for QR code in bottom-right corner (show as placeholder box)
- High contrast for readability
- Print-ready quality

IMPORTANT: Render all Japanese text accurately if the business name or content contains Japanese characters.`;
    }

    console.log('[generate-flyer-image] Generating image with prompt:', prompt.substring(0, 200) + '...');

    // 画像生成リクエスト
    const result = await model.generateContent(prompt);
    const response = result.response;

    // レスポンスから画像データを抽出
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts || parts.length === 0) {
      console.error('[generate-flyer-image] No parts in response');
      return NextResponse.json(
        { 
          error: 'No image generated',
          details: 'APIからの応答に画像データが含まれていません'
        },
        { status: 500 }
      );
    }

    // 画像パートを探す
    let imageData: string | null = null;
    let mimeType: string = 'image/png';

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
        mimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!imageData) {
      // テキストのみのレスポンスの場合
      const textContent = parts.find(p => p.text)?.text;
      console.error('[generate-flyer-image] No image data found. Text response:', textContent);
      
      return NextResponse.json(
        { 
          error: 'Image generation not available',
          details: 'このモデルでは画像生成がサポートされていない可能性があります',
          textResponse: textContent,
          hint: 'Gemini 2.0 Flash with image generation capabilities が必要です'
        },
        { status: 500 }
      );
    }

    console.log('[generate-flyer-image] Image generated successfully, size:', imageData.length);

    // Base64画像データを返す
    return NextResponse.json({
      success: true,
      image: {
        data: imageData,
        mimeType: mimeType
      },
      mode: mode,
      prompt: prompt.substring(0, 500) + '...'
    });

  } catch (error) {
    console.error('[generate-flyer-image] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('rate');
    const isModelError = errorMessage.includes('model') || errorMessage.includes('not found');
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: errorMessage,
        hint: isQuotaError 
          ? 'APIの利用制限に達した可能性があります。しばらく待ってから再試行してください。'
          : isModelError
          ? '画像生成モデルが利用できません。APIキーの権限を確認してください。'
          : 'エラーが発生しました。再度お試しください。'
      },
      { status: 500 }
    );
  }
}

// GET リクエストでAPIの状態を確認
export async function GET() {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    apiKeyConfigured: hasApiKey,
    supportedModes: ['background', 'full'],
    supportedThemes: ['business', 'creative', 'shop', 'custom'],
    supportedStyles: ['modern', 'traditional', 'minimal', 'vibrant']
  });
}

