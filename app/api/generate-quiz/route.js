import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAIインスタンスを遅延初期化（ビルド時エラーを防ぐ）
function getOpenAI() {
  // セキュリティ: サーバー側の環境変数のみを使用（NEXT_PUBLIC_は使用しない）
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。環境変数 OPENAI_API_KEY を設定してください。');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

export async function POST(req) {
  try {
    const { theme, mode, prompt } = await req.json();

    if (!theme || !prompt) {
      return NextResponse.json({ error: 'テーマとプロンプトが必要です' }, { status: 400 });
    }

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'あなたはクイズ・診断作成の専門家です。JSON形式で返答してください。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    console.log('[AI生成] OpenAI APIからの生の応答:', content);
    
    if (!content) {
      return NextResponse.json(
        { error: 'AIからの応答が空でした。もう一度お試しください。' },
        { status: 500 }
      );
    }
    
    // JSONを抽出（```json で囲まれている場合がある）
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    // JSONの開始位置と終了位置を見つける
    const startIndex = jsonStr.indexOf('{');
    const endIndex = jsonStr.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      console.error('[AI生成] JSONの開始/終了が見つかりません:', jsonStr);
      return NextResponse.json(
        { error: 'AIからの応答の解析に失敗しました。もう一度お試しください。' },
        { status: 500 }
      );
    }

    jsonStr = jsonStr.substring(startIndex, endIndex + 1);

    let result;
    try {
      result = JSON.parse(jsonStr);
      console.log('[AI生成] パース成功:', result);
    } catch (parseError) {
      console.error('[AI生成] JSON Parse Error:', parseError);
      console.error('[AI生成] Content:', content);
      return NextResponse.json(
        { error: 'AIからの応答の解析に失敗しました。もう一度お試しください。' },
        { status: 500 }
      );
    }

    // 結果の検証と整形
    const response = {
      title: result.title || '',
      description: result.description || '',
      questions: result.questions || [],
      results: result.results || [],
    };
    
    console.log('[AI生成] 最終レスポンス:', response);

    return NextResponse.json(response);
  } catch (err) {
    console.error('OpenAI API Error:', err);
    
    // エラータイプに応じたメッセージを返す
    let errorMessage = 'AI生成に失敗しました';
    if (err.message?.includes('API key') || err.message?.includes('APIキーが設定されていません')) {
      errorMessage = 'OpenAI APIキーが設定されていません。管理者にお問い合わせください。';
    } else if (err.message?.includes('rate limit')) {
      errorMessage = 'APIの利用制限に達しました。しばらく待ってから再度お試しください。';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

