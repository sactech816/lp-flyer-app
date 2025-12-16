import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Pro以上で必要な場合

export async function GET(request: NextRequest) {
  try {
    console.log('[PDF] PDF生成リクエスト受信');
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const layout = searchParams.get('layout') || 'simple';
    const theme = searchParams.get('theme') || 'business';

    console.log('[PDF] パラメータ:', { slug, layout, theme });

    if (!slug) {
      console.error('[PDF] slugパラメータが不足');
      return NextResponse.json(
        { error: 'slugパラメータが必要です' },
        { status: 400 }
      );
    }

    // 開発環境とVercel環境で異なる設定
    const isDev = process.env.NODE_ENV === 'development';
    console.log('[PDF] 環境:', isDev ? '開発' : '本番');
    
    let browser;
    let puppeteer;

    console.log('[PDF] Puppeteer起動開始...');
    if (isDev) {
      // 開発環境: 通常のPuppeteerを使用（インストールされている場合）
      try {
        console.log('[PDF] 開発環境: puppeteerを試行');
        puppeteer = require('puppeteer');
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        console.log('[PDF] puppeteerの起動成功');
      } catch (error) {
        // 開発環境でPuppeteerがない場合は、puppeteer-coreにフォールバック
        console.log('[PDF] puppeteer起動失敗、puppeteer-coreにフォールバック');
        puppeteer = require('puppeteer-core');
        const chromium = require('@sparticuz/chromium');
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
        console.log('[PDF] puppeteer-coreの起動成功');
      }
    } else {
      // 本番環境（Vercel）: @sparticuz/chromiumを使用
      console.log('[PDF] 本番環境: puppeteer-core + @sparticuz/chromiumを使用');
      puppeteer = require('puppeteer-core');
      const chromium = require('@sparticuz/chromium');
      
      console.log('[PDF] Chromium実行パス取得中...');
      const executablePath = await chromium.executablePath();
      console.log('[PDF] Chromium実行パス:', executablePath);
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath,
        headless: chromium.headless,
      });
      console.log('[PDF] Chromiumの起動成功');
    }

    console.log('[PDF] 新しいページを作成');
    const page = await browser.newPage();

    // A4サイズに設定（210mm x 297mm）
    console.log('[PDF] ビューポート設定');
    await page.setViewport({
      width: 794, // 210mm @ 96dpi
      height: 1123, // 297mm @ 96dpi
      deviceScaleFactor: 2, // 高解像度
    });

    // チラシページにアクセス
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000';
    const flyerUrl = `${baseUrl}/b/${slug}/flyer?layout=${layout}&theme=${theme}&print=true`;

    console.log('[PDF] アクセスURL:', flyerUrl);
    console.log('[PDF] ページ読み込み開始...');

    await page.goto(flyerUrl, {
      waitUntil: 'networkidle0',
      timeout: 45000, // 30秒 → 45秒に延長
    });
    
    console.log('[PDF] ページ読み込み完了');

    // 画像やフォントの読み込みを待つ
    console.log('[PDF] リソース読み込み待機中（2秒）...');
    await page.waitForTimeout(2000);

    // PDFを生成
    console.log('[PDF] PDF生成開始...');
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: false,
    });

    console.log('[PDF] PDF生成完了、サイズ:', pdf.length, 'bytes');
    console.log('[PDF] ブラウザをクローズ');
    await browser.close();

    console.log('[PDF] レスポンス送信');
    // PDFをレスポンスとして返す
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="flyer-${slug}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('[PDF] ❌ PDF生成エラー:', error);
    console.error('[PDF] エラーの種類:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[PDF] エラーメッセージ:', error instanceof Error ? error.message : String(error));
    console.error('[PDF] スタックトレース:', error instanceof Error ? error.stack : 'スタックなし');
    
    return NextResponse.json(
      { 
        error: 'PDF生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined,
        hint: 'ブラウザの印刷機能（Ctrl+P）をご利用ください'
      },
      { status: 500 }
    );
  }
}


