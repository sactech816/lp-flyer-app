import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel Pro以上で必要な場合

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const layout = searchParams.get('layout') || 'simple';
    const theme = searchParams.get('theme') || 'business';

    if (!slug) {
      return NextResponse.json(
        { error: 'slugパラメータが必要です' },
        { status: 400 }
      );
    }

    // 開発環境とVercel環境で異なる設定
    const isDev = process.env.NODE_ENV === 'development';
    
    let browser;
    let puppeteer;

    if (isDev) {
      // 開発環境: 通常のPuppeteerを使用（インストールされている場合）
      try {
        puppeteer = require('puppeteer');
        browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      } catch (error) {
        // 開発環境でPuppeteerがない場合は、puppeteer-coreにフォールバック
        puppeteer = require('puppeteer-core');
        const chromium = require('@sparticuz/chromium');
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      }
    } else {
      // 本番環境（Vercel）: @sparticuz/chromiumを使用
      puppeteer = require('puppeteer-core');
      const chromium = require('@sparticuz/chromium');
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    // A4サイズに設定（210mm x 297mm）
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

    console.log('Accessing flyer URL:', flyerUrl);

    await page.goto(flyerUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // 画像やフォントの読み込みを待つ
    await page.waitForTimeout(2000);

    // PDFを生成
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

    await browser.close();

    // PDFをレスポンスとして返す
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="flyer-${slug}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('PDF生成エラー:', error);
    
    return NextResponse.json(
      { 
        error: 'PDF生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: 'ブラウザの印刷機能（Ctrl+P）をご利用ください'
      },
      { status: 500 }
    );
  }
}


