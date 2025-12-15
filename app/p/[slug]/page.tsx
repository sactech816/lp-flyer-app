import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { Block, migrateOldContent } from '@/lib/types';
import { BlockRenderer } from '@/components/BlockRenderer';
import { ProfileViewTracker } from '@/components/ProfileViewTracker';
import { TrackingScripts } from '@/components/TrackingScripts';
import Link from 'next/link';

interface Profile {
  id: string;
  slug: string;
  content: Block[];
  settings?: {
    gtmId?: string;
    fbPixelId?: string;
    lineTagId?: string;
    theme?: {
      gradient?: string;
      backgroundImage?: string;
    };
  };
}

// サンプルプロフィールのデータ
const sampleProfiles = {
  'sample-business': {
    id: 'sample-business',
    slug: 'sample-business',
    name: 'ビジネス向けサンプル',
    blocks: [
      {
        type: 'header' as const,
        data: {
          avatar: '',
          name: '山田太郎',
          title: '企業の成長を支援するビジネスコンサルタント',
          category: 'business'
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: '私について',
          text: '15年以上の経験を持つビジネスコンサルタントとして、中小企業の経営課題解決をサポートしています。\n\n戦略立案から実行支援まで、企業の成長を総合的に支援します。',
          align: 'left' as const
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: '提供サービス',
          text: '• 経営戦略の立案\n• 業務プロセスの改善\n• 組織開発・人材育成\n• マーケティング戦略',
          align: 'left' as const
        }
      },
      {
        type: 'links' as const,
        data: {
          links: [
            { label: '公式サイト', url: 'https://example.com', style: '' },
            { label: 'お問い合わせ', url: 'https://example.com/contact', style: '' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/example', style: '' }
          ]
        }
      }
    ],
    theme: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  },
  'sample-creator': {
    id: 'sample-creator',
    slug: 'sample-creator',
    name: 'クリエイター向けサンプル',
    blocks: [
      {
        type: 'header' as const,
        data: {
          avatar: '',
          name: '佐藤花子',
          title: '心に響くビジュアルを創るイラストレーター',
          category: 'other'
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: 'About',
          text: 'フリーランスのイラストレーターとして活動しています。\n\n書籍の挿絵、広告イラスト、キャラクターデザインなど、幅広いジャンルで制作を行っています。',
          align: 'center' as const
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: '得意分野',
          text: '• キャラクターイラスト\n• 水彩タッチのイラスト\n• 書籍の挿絵\n• SNS用アイコン制作',
          align: 'left' as const
        }
      },
      {
        type: 'links' as const,
        data: {
          links: [
            { label: 'ポートフォリオ', url: 'https://example.com', style: '' },
            { label: 'X (Twitter)', url: 'https://x.com/example', style: '' },
            { label: 'Instagram', url: 'https://instagram.com/example', style: '' },
            { label: 'お仕事依頼', url: 'https://example.com/contact', style: '' }
          ]
        }
      }
    ],
    theme: { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
  },
  'sample-shop': {
    id: 'sample-shop',
    slug: 'sample-shop',
    name: '店舗向けサンプル',
    blocks: [
      {
        type: 'header' as const,
        data: {
          avatar: '',
          name: 'Cafe Harmony',
          title: '心地よい空間で楽しむ本格コーヒー',
          category: 'other'
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: 'ようこそ',
          text: '東京・渋谷にある隠れ家的なカフェです。\n\nこだわりの自家焙煎コーヒーと手作りスイーツで、ゆったりとした時間をお過ごしください。',
          align: 'center' as const
        }
      },
      {
        type: 'text_card' as const,
        data: {
          title: '営業時間',
          text: '平日: 10:00 - 20:00\n土日祝: 9:00 - 21:00\n定休日: 毎週火曜日',
          align: 'left' as const
        }
      },
      {
        type: 'links' as const,
        data: {
          links: [
            { label: '公式サイト', url: 'https://example.com', style: '' },
            { label: 'オンライン予約', url: 'https://example.com/reserve', style: '' },
            { label: 'Instagram', url: 'https://instagram.com/example', style: '' },
            { label: 'アクセス', url: 'https://maps.google.com', style: '' }
          ]
        }
      }
    ],
    theme: { gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
  }
};

// プロフィールデータを取得（slug または nickname で検索）
async function getProfile(slug: string): Promise<Profile | null> {
  if (!supabase) return null;
  
  // サンプルプロフィールの場合
  if (slug in sampleProfiles) {
    const sample = sampleProfiles[slug as keyof typeof sampleProfiles];
    const { generateBlockId } = await import('@/lib/types');
    
    const blocksWithIds = sample.blocks.map(block => ({
      ...block,
      id: generateBlockId()
    }));
    
    return {
      id: sample.id,
      slug: sample.slug,
      content: blocksWithIds as Block[],
      settings: {
        theme: sample.theme
      }
    };
  }
  
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

  // サンプルプロフィールかどうかを判定
  const isSampleProfile = slug.startsWith('sample-');
  
  return (
    <>
      <ProfileViewTracker profileId={profile.id} />
      <TrackingScripts settings={profile.settings} />
      
      {/* サンプルプロフィール選択バー */}
      {isSampleProfile && (
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-md">
          <div className="container mx-auto max-w-4xl px-4 py-3">
            <p className="text-xs text-gray-600 mb-2 text-center">
              📌 サンプルプロフィール - クリックして他のサンプルを見る
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link
                href="/p/sample-business"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  slug === 'sample-business'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ビジネス向け
              </Link>
              <Link
                href="/p/sample-creator"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  slug === 'sample-creator'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                クリエイター向け
              </Link>
              <Link
                href="/p/sample-shop"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  slug === 'sample-shop'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                店舗向け
              </Link>
            </div>
          </div>
        </div>
      )}
      
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

