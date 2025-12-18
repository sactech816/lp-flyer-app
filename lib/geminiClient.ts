import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini APIクライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 画像生成用のモデル（Gemini 2.0 Flash）
export const getImageGenerationModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
    }
  });
};

// テキスト生成用のモデル
export const getTextModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// チラシ用のプロンプト生成
export interface FlyerPromptData {
  businessName: string;
  title?: string;
  description?: string;
  services?: string[];
  priceRange?: string;
  theme?: 'business' | 'creative' | 'shop' | 'custom';
  style?: 'modern' | 'traditional' | 'minimal' | 'vibrant';
}

export const generateFlyerBackgroundPrompt = (data: FlyerPromptData): string => {
  const themeDescriptions = {
    business: "professional, corporate, blue tones, clean lines",
    creative: "artistic, vibrant, pink and purple gradients, dynamic",
    shop: "warm, inviting, green accents, friendly atmosphere",
    custom: "elegant, indigo tones, sophisticated design"
  };

  const styleDescriptions = {
    modern: "minimalist, geometric shapes, flat design",
    traditional: "classic patterns, ornate details, timeless",
    minimal: "clean white space, subtle textures, simple",
    vibrant: "bold colors, energetic patterns, eye-catching"
  };

  const theme = themeDescriptions[data.theme || 'business'];
  const style = styleDescriptions[data.style || 'modern'];

  return `Create a beautiful A4 flyer background design for a business called "${data.businessName}".
Business type: ${data.title || 'Professional Service'}
Theme: ${theme}
Style: ${style}

Requirements:
- Abstract, decorative background suitable for overlaying text
- Leave large areas of light/white space for text content
- Professional and elegant appearance
- No text or letters in the image
- High quality, print-ready design
- Subtle gradients and patterns
- A4 portrait orientation (210mm x 297mm aspect ratio)

The design should complement but not overpower text that will be placed on top.`;
};

export const generateFullFlyerPrompt = (data: FlyerPromptData & {
  contactInfo?: string;
  features?: string[];
}): string => {
  return `Create a professional A4 flyer design for:

Business Name: ${data.businessName}
${data.title ? `Tagline: ${data.title}` : ''}
${data.description ? `Description: ${data.description}` : ''}
${data.services?.length ? `Services: ${data.services.join(', ')}` : ''}
${data.priceRange ? `Price Range: ${data.priceRange}` : ''}
${data.features?.length ? `Key Features: ${data.features.join(', ')}` : ''}
${data.contactInfo ? `Contact: ${data.contactInfo}` : ''}

Design Requirements:
- A4 portrait format (210mm x 297mm)
- Professional, modern design
- Clear visual hierarchy
- Include placeholder for QR code in bottom right
- Eye-catching header section
- Easy to read layout
- Print-ready quality

Note: Include all text in Japanese if the business name contains Japanese characters.`;
};

export default genAI;

