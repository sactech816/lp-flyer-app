import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { Block, migrateOldContent } from '@/lib/types';
import { BlockRenderer } from '@/components/BlockRenderer';
import { ProfileViewTracker } from '@/components/ProfileViewTracker';
import { TrackingScripts } from '@/components/TrackingScripts';

interface Profile {
  id: string;
  slug: string;
  content: Block[];
  settings?: {
    gtmId?: string;
    fbPixelId?: string;
    lineTagId?: string;
  };
}

// プロフィールデータを取得（slug または nickname で検索）
async function getProfile(slug: string): Promise<Profile | null> {
  if (!supabase) return null;
  
  // デモページの場合はランダムテンプレートを返す
  if (slug === 'demo-user') {
    const { templates } = await import('@/constants/templates');
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // テンプレートのブロックをコピーしてIDを再生成
    const { generateBlockId } = await import('@/lib/types');
    const demoBlocks = randomTemplate.blocks.map(block => ({
      ...block,
      id: generateBlockId()
    })).map(block => {
      if (block.type === 'faq') {
        return {
          ...block,
          data: {
            items: block.data.items.map((item: any) => ({
              ...item,
              id: generateBlockId()
            }))
          }
        };
      } else if (block.type === 'pricing') {
        return {
          ...block,
          data: {
            plans: block.data.plans.map((plan: any) => ({
              ...plan,
              id: generateBlockId()
            }))
          }
        };
      } else if (block.type === 'testimonial') {
        return {
          ...block,
          data: {
            items: block.data.items.map((item: any) => ({
              ...item,
              id: generateBlockId()
            }))
          }
        };
      }
      return block;
    });
    
    return {
      id: 'demo',
      slug: 'demo-user',
      content: demoBlocks,
      settings: {}
    } as Profile;
  }
  
  // slug または nickname で検索
  const { data, error } = await supabase
    .from('profiles')
    .select('id, slug, nickname, content, settings')
    .or(`slug.eq.${slug},nickname.eq.${slug}`)
    .single();

  if (error || !data) return null;
  return data as Profile;
}

// メタデータを生成
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  
  if (!profile) {
    return {
      title: 'プロフィールページ',
      description: 'プロフィールランディングページ',
    };
  }
  
  // 後方互換性のため、マイグレーション
  const migratedContent = migrateOldContent(profile.content);
  const headerBlock = migratedContent.find((b): b is Extract<Block, { type: 'header' }> => b.type === 'header');
  const name = headerBlock?.data.name || 'プロフィール';
  const description = headerBlock?.data.title || 'プロフィールランディングページ';
  const avatar = headerBlock?.data.avatar || null;
  
  // ベースURLを取得（環境変数から、またはデフォルト値）
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lp.makers.tokyo';
  const ogImage = avatar ? avatar : `${baseUrl}/og-image.png`;
  const profileUrl = `${baseUrl}/p/${slug}`;
  
  return {
    title: `${name} - プロフィールページ | プロフィールLPメーカー`,
    description: `${description} | プロフィールLPメーカーで作成されたプロフィールページ。SNSリンクまとめ、無料で使えるプロフィールリンクツール。`,
    keywords: [
      name,
      'プロフィール',
      'プロフィールページ',
      'SNSリンクまとめ',
      'プロフィールリンク',
      'リンクまとめ',
      'プロフィールLPメーカー',
    ],
    authors: [{ name }],
    creator: name,
    publisher: 'プロフィールLPメーカー',
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${name} - プロフィールページ`,
      description,
      url: profileUrl,
      siteName: 'プロフィールLPメーカー',
      locale: 'ja_JP',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - プロフィールページ`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}


export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) {
    notFound();
  }

  // 後方互換性のため、マイグレーション
  const migratedContent = migrateOldContent(profile.content);

  return (
    <>
      <ProfileViewTracker profileId={profile.id} />
      <TrackingScripts settings={profile.settings} />
      <div className="container mx-auto max-w-lg p-4 md:p-8">
        <div className="w-full space-y-6 md:space-y-8">
          {migratedContent.map((block, index) => (
            <div key={block.id || index} className={index > 0 ? `delay-${Math.min(index, 10)}` : ''}>
              <BlockRenderer block={block} profileId={profile.id} />
            </div>
          ))}
        </div>
      </div>
      
      {/* コピーライトとリンク */}
      <footer className="text-center py-6 animate-fade-in delay-10">
        <p className="text-sm text-white/90 drop-shadow-md mb-2">
          &copy; {new Date().getFullYear()} プロフィールLPメーカー. All rights reserved.
        </p>
        <a 
          href="https://lp.makers.tokyo/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-white/80 hover:text-white/100 drop-shadow-md transition-colors underline inline-block mb-2"
        >
          プロフィールLPメーカーで作成
        </a>
        <p className="text-xs text-white/70 drop-shadow-md">
          無料でSNSプロフィールリンクをまとめる
        </p>
      </footer>
    </>
  );
}

