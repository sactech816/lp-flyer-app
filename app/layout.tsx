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
  title: "Profile LP Maker - ”あなた”らしいプロフィールを、3分で。",
  description: "ノーコードで誰でも簡単にあなたらしいプロフィールページを作成・公開できるプラットフォーム。AIアシスタント機能付き。",
  openGraph: {
    title: "Profile LP Maker - ”あなた”らしいプロフィールを、3分で。",
    description: "ノーコードで誰でも簡単に”あなた”らしいプロフィールページを作成・公開できるプラットフォーム。AIアシスタント機能付き。",
    type: "website",
    images: [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png` : "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profile LP Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile LP Maker - ”あなた”らしいプロフィールを、3分で。",
    description: "ノーコードで誰でも簡単に”あなた”らしいプロフィールページを作成・公開できるプラットフォーム。AIアシスタント機能付き。",
    images: [process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png` : "/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
