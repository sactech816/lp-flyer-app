import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LPチラシメーカー（エルチラ）- ビジネスLP作成ツール | 無料でランディングページ制作",
  description: "LPチラシメーカー（エルチラ）は、ビジネス向けランディングページを簡単に作成できる無料ツール。テンプレートから選んで、あなたのビジネスに合わせてカスタマイズ。集客・販促に最適なLPを最短ルートで公開できます。",
  keywords: [
    "ランディングページ",
    "LP作成",
    "LPチラシメーカー",
    "エルチラ",
    "ビジネスLP",
    "無料LP作成",
    "ノーコード",
    "集客ツール",
    "販促ツール",
    "マーケティング",
    "チラシ作成",
    "ビジネスツール",
    "起業",
    "フリーランス",
    "個人事業主",
    "中小企業",
    "セールスページ",
    "プロモーション",
  ],
  authors: [{ name: "LPチラシメーカー（エルチラ）" }],
  creator: "LPチラシメーカー（エルチラ）",
  publisher: "LPチラシメーカー（エルチラ）",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LPチラシメーカー（エルチラ）- ビジネスLP作成ツール",
    description: "ビジネス向けランディングページを簡単に作成。テンプレートから選んで、あなたのビジネスに合わせてカスタマイズ。集客・販促に最適なLPを最短ルートで公開できます。",
    type: "website",
    locale: "ja_JP",
    siteName: "LPチラシメーカー（エルチラ）",
    images: [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png` : "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LPチラシメーカー（エルチラ）- ビジネスLP作成ツール",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LPチラシメーカー（エルチラ）- ビジネスLP作成ツール",
    description: "ビジネス向けランディングページを簡単に作成。テンプレートから選んで、集客・販促に最適なLPを最短ルートで公開。",
    images: [process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png` : "/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* 構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LPチラシメーカー（エルチラ）",
              "alternateName": "エルチラ",
              "description": "ビジネス向けランディングページを簡単に作成できる無料ツール。テンプレートから選んで、集客・販促に最適なLPを最短ルートで公開できます。",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://profile-lp-maker.vercel.app",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "ビジネスLP作成",
                "テンプレート豊富",
                "無料で利用可能",
                "ノーコード",
                "集客・販促ツール",
                "カスタマイズ可能",
                "レスポンシブデザイン"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              }
            })
          }}
        />
        {/* BreadcrumbList構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "ホーム",
                  "item": process.env.NEXT_PUBLIC_SITE_URL || "https://profile-lp-maker.vercel.app"
                }
              ]
            })
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-STZ669CKXC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-STZ669CKXC');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
