import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { Block, migrateOldContent } from '@/lib/types';
import { FlyerRenderer } from '@/components/FlyerRenderer';
import Link from 'next/link';

interface BusinessProject {
  id: string;
  slug: string;
  content: Block[];
  settings?: {
    theme?: {
      gradient?: string;
      backgroundImage?: string;
    };
  };
}

// ビジネスプロジェクトデータを取得
async function getBusinessProject(slug: string): Promise<BusinessProject | null> {
  if (!supabase) return null;
  
  const { data, error } = await supabase
    .from('business_projects')
    .select('id, slug, content, settings')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as BusinessProject;
}

// メタデータを生成
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getBusinessProject(slug);
  
  if (!project) {
    return {
      title: 'チラシ印刷',
      description: 'ビジネスLPのチラシ印刷ページ',
    };
  }
  
  const migratedContent = migrateOldContent(project.content);
  const headerBlock = migratedContent.find((b): b is Extract<Block, { type: 'header' }> => b.type === 'header');
  const name = headerBlock?.data.name || 'ビジネスLP';
  
  return {
    title: `${name} - チラシ印刷 | ビジネスLPメーカー`,
    description: `${name}のチラシ印刷ページ。印刷またはPDFで保存できます。`,
    robots: {
      index: false, // チラシページは検索エンジンにインデックスしない
      follow: false,
    },
  };
}

export default async function FlyerPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  
  const project = await getBusinessProject(slug);

  if (!project) {
    notFound();
  }

  // 後方互換性のため、マイグレーション
  const migratedContent = migrateOldContent(project.content);
  
  // プロジェクト名を取得
  const headerBlock = migratedContent.find((b): b is Extract<Block, { type: 'header' }> => b.type === 'header');
  const projectName = headerBlock?.data.name || '無題のビジネスLP';

  // クエリパラメータから設定を取得
  const layout = (search.layout as string) || 'professional';
  const theme = (search.theme as string) || 'business';
  const isPrintMode = search.print === 'true';

  return (
    <>
      {/* ヘッダー（画面表示時のみ） */}
      {!isPrintMode && (
        <div className="no-print bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4 shadow-lg">
          <div className="container mx-auto max-w-6xl px-3 md:px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
              <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                <Link
                  href="/business/dashboard"
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm md:text-base min-h-[44px]"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-semibold">ダッシュボードに戻る</span>
                </Link>
                <div className="flex-1 md:flex-none">
                  <h1 className="text-base md:text-xl font-bold truncate">{projectName} - チラシ</h1>
                  <p className="text-xs md:text-sm text-white/80">プロフェッショナルなレイアウトで印刷・PDF保存</p>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2 text-xs md:text-sm">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>6種類のプロフェッショナルレイアウトから選択可能</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div style={{ 
        background: isPrintMode ? 'white' : 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)', 
        minHeight: isPrintMode ? 'auto' : '100vh', 
        paddingBottom: isPrintMode ? '0' : '40px' 
      }}>
        <FlyerRenderer 
          blocks={migratedContent}
          slug={slug}
          settings={project.settings}
          initialLayout={layout as any}
          initialColorTheme={theme as any}
          showControls={!isPrintMode}
        />
      </div>

      {/* フッター（画面表示時のみ） */}
      {!isPrintMode && (
        <div className="no-print bg-gray-800 text-white py-4 md:py-6">
          <div className="container mx-auto max-w-4xl px-3 md:px-4 text-center">
            <p className="text-xs md:text-sm mb-2">
              このチラシは <strong>ビジネスLPメーカー</strong> で作成されました
            </p>
            <a 
              href="https://lp.makers.tokyo/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-xs md:text-sm underline min-h-[44px] inline-flex items-center"
            >
              あなたもビジネスLPを作成する
            </a>
          </div>
        </div>
      )}
    </>
  );
}


