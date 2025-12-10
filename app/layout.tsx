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
  title: "プロフィールLPメーカー - ずっと無料のSNSプロフィールリンクまとめ | Profile LP Maker",
  description: "まとめよう、活動のすべてを。プロフィールLPメーカーはSNSや作品投稿サイトの情報を集約して、公開プロフィールがサッとかんたんに作れるサービス。最新の作品や情報をひとつのページにまとめて、あなたの活動をサポートします。litlink、profu.link、POTOFUの代わりに。",
  keywords: [
    "プロフィールリンク",
    "SNSまとめ",
    "プロフィール作成",
    "リンクまとめ",
    "無料プロフィール",
    "litlink 代替",
    "profu.link",
    "POTOFU",
    "ポトフ",
    "プロフリ",
    "SNSプロフィール",
    "プロフィールページ",
    "ランディングページ",
    "LP作成",
    "ノーコード",
    "インフルエンサー",
    "クリエイター",
    "アーティスト",
    "ビジネスプロフィール",
  ],
  authors: [{ name: "Profile LP Maker" }],
  creator: "Profile LP Maker",
  publisher: "Profile LP Maker",
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
    title: "プロフィールLPメーカー - ずっと無料のSNSプロフィールリンクまとめ",
    description: "まとめよう、活動のすべてを。SNSや作品投稿サイトの情報を集約して、公開プロフィールがサッとかんたんに作れるサービス。最新の作品や情報をひとつのページにまとめて、あなたの活動をサポートします。",
    type: "website",
    locale: "ja_JP",
    siteName: "プロフィールLPメーカー",
    images: [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png` : "/og-image.png",
        width: 1200,
        height: 630,
        alt: "プロフィールLPメーカー - SNSプロフィールリンクまとめ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "プロフィールLPメーカー - ずっと無料のSNSプロフィールリンクまとめ",
    description: "まとめよう、活動のすべてを。SNSや作品投稿サイトの情報を集約して、公開プロフィールがサッとかんたんに作れるサービス。",
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
              "name": "プロフィールLPメーカー",
              "alternateName": "Profile LP Maker",
              "description": "まとめよう、活動のすべてを。SNSや作品投稿サイトの情報を集約して、公開プロフィールがサッとかんたんに作れるサービス。",
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
                "SNSリンクまとめ",
                "プロフィールページ作成",
                "無料で利用可能",
                "ノーコード",
                "AIアシスタント",
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
