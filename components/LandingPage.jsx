"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Smartphone, Code, Share2, ArrowRight, CheckCircle, Eye, Wand2, BookOpen, Store, Briefcase, ExternalLink, Heart, Coffee, ShoppingBag, GraduationCap, Laptop } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import AnnouncementBanner from './AnnouncementBanner';
import { templates, recommendedTemplates } from '../constants/templates';

const LandingPage = ({ user, setShowAuth, onNavigateToDashboard, onCreate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [publicBusinessProjects, setPublicBusinessProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 6;

  useEffect(() => {
    setIsLoading(false);
    // 公開されているビジネスLPを取得
    fetchPublicBusinessProjects();
  }, [currentPage]);

  const fetchPublicBusinessProjects = async () => {
    if (!supabase) return;
    try {
      const from = (currentPage - 1) * projectsPerPage;
      const to = from + projectsPerPage - 1;
      
      // featured_on_topがtrueのビジネスLPを取得
      let { data, error, count } = await supabase
        .from('business_projects')
        .select('*', { count: 'exact' })
        .eq('featured_on_top', true)
        .order('updated_at', { ascending: false })
        .range(from, to);
      
      // featured_on_topカラムがない場合は、すべてのビジネスLPを取得
      if (error && error.message?.includes('column')) {
        console.log('featured_on_topカラムがないため、すべてのビジネスLPを取得します');
        const result = await supabase
          .from('business_projects')
          .select('*', { count: 'exact' })
          .order('updated_at', { ascending: false })
          .range(from, to);
        data = result.data;
        error = result.error;
        count = result.count;
      }
      
      if (!error && data) {
        console.log('ビジネスLPを取得しました:', data.length, '件');
        setPublicBusinessProjects(data);
        setTotalProjects(count || 0);
      } else if (error) {
        console.error('ビジネスLP取得エラー:', error);
      }
    } catch (e) {
      console.error('ビジネスLP取得エラー:', e);
    }
  };

  // プロジェクト名を取得
  const getProjectName = (project) => {
    if (!project.content || !Array.isArray(project.content)) return '無題のビジネスLP';
    const headerBlock = project.content.find(b => b.type === 'header');
    return headerBlock?.data?.name || '無題のビジネスLP';
  };

  // プロジェクトの説明を取得
  const getProjectDescription = (project) => {
    if (!project.content || !Array.isArray(project.content)) return '';
    const textBlock = project.content.find(b => b.type === 'text' || b.type === 'text_card');
    const description = textBlock?.data?.text || '';
    // 最初の100文字まで表示
    return description.length > 100 ? description.substring(0, 100) + '...' : description;
  };

  // プロジェクトのカテゴリーを取得
  const getProjectCategory = (project) => {
    if (!project.content || !Array.isArray(project.content)) return null;
    const headerBlock = project.content.find(b => b.type === 'header');
    return headerBlock?.data?.category || null;
  };

  // プロジェクトのアバター画像を取得
  const getProjectAvatar = (project) => {
    if (!project.content || !Array.isArray(project.content)) return null;
    const headerBlock = project.content.find(b => b.type === 'header');
    return headerBlock?.data?.avatar || null;
  };

  // プロジェクトのテーマ（背景画像またはグラデーション）を取得
  const getProjectTheme = (project) => {
    const theme = project.settings?.theme;
    if (theme?.backgroundImage) {
      return { type: 'image', value: theme.backgroundImage };
    }
    if (theme?.gradient) {
      return { type: 'gradient', value: theme.gradient };
    }
    return null;
  };

  // カテゴリーの表示名とスタイルを取得
  const getCategoryInfo = (category) => {
    const categories = {
      fortune: { label: '占い', color: 'bg-purple-100 text-purple-700' },
      business: { label: 'ビジネス', color: 'bg-blue-100 text-blue-700' },
      study: { label: '学習', color: 'bg-green-100 text-green-700' },
      other: { label: 'その他', color: 'bg-gray-100 text-gray-700' }
    };
    return categories[category] || categories.other;
  };

  const handleGetStarted = (templateId = null) => {
    if (user) {
      // ログイン済みならダッシュボードへ（テンプレートIDを渡す）
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
      // ダッシュボードに遷移後、テンプレートIDがあればエディタで使用
      if (onCreate && templateId) {
        onCreate(templateId);
      }
    } else {
      // 未ログインの場合もエディタページに直接遷移
      if (onCreate) {
        onCreate(templateId);
      }
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      alert('ログアウトしました');
      window.location.reload();
    } catch (e) {
      console.error('ログアウトエラー:', e);
      alert('ログアウトに失敗しました');
    }
  };

  const handleSetPage = (page) => {
    window.location.href = `?page=${page}`;
  };

  return (
    <div className="profile-page-wrapper min-h-screen">
      {/* SEO用の隠しテキスト（検索エンジン向け） */}
      <div className="sr-only">
        <h1>LPチラシメーカー（エルチラ）- ビジネスLP作成ツール</h1>
        <p>LPチラシメーカー（エルチラ）は、ビジネス向けランディングページを簡単に作成できる無料ツール。テンプレートから選んで、集客・販促に最適なLPを最短ルートで公開。起業家、フリーランス、中小企業、個人事業主に最適。</p>
      </div>
      
      {/* お知らせバナー */}
      <AnnouncementBanner 
        serviceType="profile"
        onNavigateToAnnouncements={() => handleSetPage('announcements')}
      />
      
      {/* ヘッダーを追加 */}
      <Header 
        setPage={handleSetPage}
        user={user}
        onLogout={handleLogout}
        setShowAuth={setShowAuth}
      />
      
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 md:px-6 py-8 md:py-12 lg:py-20">
        {/* ヒーローセクション */}
        <section className="text-center mb-12 md:mb-20 lg:mb-32 animate-fade-in">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-4 md:mb-6 leading-tight px-2">
              集客・販促に使える<br className="sm:hidden"/>
              ビジネスLPを<br/>
              <span className="text-yellow-300">「テンプレート」から<br className="sm:hidden"/>最短ルートで作成</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white font-semibold px-4 drop-shadow-md mb-3 md:mb-4 leading-relaxed">
              文章の型は用意済み。<br/>
              あなたは、ビジネスに合わせて内容を書き換えるだけ。
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/90 px-4 drop-shadow-md mb-6 md:mb-8">
              「何を書けばいいかわからない」を解消し<br/>
              集客に効くLPをスムーズに公開できます。
            </p>
          </div>
          
          <div className="flex justify-center px-4">
            <button
              onClick={handleGetStarted}
              className="glass-card bg-white/95 hover:bg-white text-indigo-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 min-h-[44px]"
            >
              <Sparkles size={18} className="sm:w-5 sm:h-5"/>
              無料で作成する
              <ArrowRight size={18} className="sm:w-5 sm:h-5"/>
            </button>
          </div>
        </section>

        {/* テンプレート選択セクション */}
        <section className="mb-12 md:mb-20 lg:mb-32 animate-fade-in delay-1">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg px-2">
            業種別テンプレートで簡単作成
          </h3>
          <p className="text-center text-white/90 mb-8 md:mb-12 text-sm md:text-base px-4">
            あなたのビジネスに合ったテンプレートを選んで、すぐに作成開始
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {recommendedTemplates.map((template) => {
              // テンプレートIDに応じた色とアイコンを設定
              const getTemplateStyle = (id) => {
                const styles = {
                  'consultant': { 
                    bg: 'bg-blue-100', 
                    hover: 'group-hover:bg-blue-200', 
                    text: 'text-blue-600', 
                    button: 'bg-blue-600 hover:bg-blue-700',
                    Icon: Briefcase
                  },
                  'store': { 
                    bg: 'bg-green-100', 
                    hover: 'group-hover:bg-green-200', 
                    text: 'text-green-600', 
                    button: 'bg-green-600 hover:bg-green-700',
                    Icon: Store
                  },
                  'freelance': { 
                    bg: 'bg-indigo-100', 
                    hover: 'group-hover:bg-indigo-200', 
                    text: 'text-indigo-600', 
                    button: 'bg-indigo-600 hover:bg-indigo-700',
                    Icon: Laptop
                  },
                  'coach': { 
                    bg: 'bg-purple-100', 
                    hover: 'group-hover:bg-purple-200', 
                    text: 'text-purple-600', 
                    button: 'bg-purple-600 hover:bg-purple-700',
                    Icon: GraduationCap
                  },
                  'retail-ec': { 
                    bg: 'bg-pink-100', 
                    hover: 'group-hover:bg-pink-200', 
                    text: 'text-pink-600', 
                    button: 'bg-pink-600 hover:bg-pink-700',
                    Icon: ShoppingBag
                  },
                  'cafe-restaurant': { 
                    bg: 'bg-amber-100', 
                    hover: 'group-hover:bg-amber-200', 
                    text: 'text-amber-600', 
                    button: 'bg-amber-600 hover:bg-amber-700',
                    Icon: Coffee
                  },
                };
                return styles[id] || styles['consultant'];
              };
              
              const style = getTemplateStyle(template.id);
              const Icon = style.Icon;
              
              return (
                <div 
                  key={template.id} 
                  className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer group" 
                  onClick={() => handleGetStarted(template.id)}
                >
                  <div className={`${style.bg} w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 ${style.hover} transition-colors`}>
                    <Icon className={style.text} size={28}/>
                  </div>
                  <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                    {template.name}
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base mb-4 md:mb-6">
                    {template.description}
                  </p>
                  <button className={`w-full ${style.button} text-white py-2.5 md:py-3 rounded-lg font-bold transition-colors text-sm md:text-base min-h-[44px]`}>
                    このテンプレートで作成
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* 全テンプレート表示リンク */}
          <div className="text-center mt-8">
            <p className="text-white/80 text-sm mb-2">
              他にも「コーチ・講師」「物販・EC」「カフェ・飲食店」など全{templates.length}種類のテンプレートをご用意
            </p>
          </div>
        </section>

        {/* ビジネスLP事例セクション */}
        <section className="mb-12 md:mb-20 lg:mb-32 animate-fade-in delay-2">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg flex items-center justify-center gap-2 px-2">
            <Sparkles className="text-yellow-400" size={24}/>
            作成事例・ビジネスLP一覧
          </h2>
          <p className="text-sm md:text-base text-white text-center mb-8 md:mb-12 drop-shadow-md px-4">
            実際に作成されたビジネスLPの事例を確認してみましょう
          </p>
          
          {publicBusinessProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {publicBusinessProjects.map((project) => {
                const category = getProjectCategory(project);
                const categoryInfo = getCategoryInfo(category);
                const projectName = getProjectName(project);
                const description = getProjectDescription(project);
                const theme = getProjectTheme(project);
                
                // 背景スタイルを決定（テーマ > カテゴリー別グラデーション）
                const getBackgroundStyle = () => {
                  if (theme?.type === 'image') {
                    return {
                      backgroundImage: `url(${theme.value})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat'
                    };
                  }
                  if (theme?.type === 'gradient') {
                    return {
                      background: theme.value,
                      backgroundSize: '400% 400%'
                    };
                  }
                  // フォールバック: カテゴリー別グラデーション
                  const gradientClasses = 
                    category === 'fortune' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                    category === 'business' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                    category === 'study' ? 'bg-gradient-to-br from-green-400 to-teal-500' :
                    'bg-gradient-to-br from-gray-400 to-gray-500';
                  return { className: gradientClasses };
                };
                
                const backgroundStyle = getBackgroundStyle();
                
                return (
                  <a
                    key={project.id}
                    href={`/b/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer group"
                  >
                    {/* カードヘッダー（背景画像 or グラデーション背景） */}
                    <div 
                      className={`relative h-32 flex items-center justify-center ${backgroundStyle.className || ''}`}
                      style={backgroundStyle.className ? undefined : backgroundStyle}
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                      </div>
                      {!theme && (
                        <Sparkles className="text-white opacity-50" size={48}/>
                      )}
                    </div>
                    
                    {/* カードコンテンツ */}
                    <div className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {projectName}
                        </h3>
                        <ExternalLink className="text-indigo-600 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" size={18}/>
                      </div>
                      
                      {description && (
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3 md:mb-4">
                          {description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-1.5 md:gap-2 text-indigo-600 font-bold text-xs md:text-sm">
                          <Eye size={14} className="md:w-4 md:h-4"/>
                          LPを見る
                        </div>
                        <ArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" size={18}/>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            
            {/* ページネーション */}
            {totalProjects > projectsPerPage && (
              <div className="mt-8 md:mt-12 flex justify-center items-center gap-1.5 md:gap-2 px-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 md:px-4 py-2 rounded-lg font-bold transition-all text-sm md:text-base min-h-[44px] ${
                    currentPage === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'glass-card bg-white/90 hover:bg-white text-indigo-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  前へ
                </button>
                
                <div className="flex gap-1.5 md:gap-2">
                  {Array.from({ length: Math.ceil(totalProjects / projectsPerPage) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-lg font-bold transition-all text-sm md:text-base min-h-[44px] ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'glass-card bg-white/90 hover:bg-white text-indigo-600 shadow-md hover:shadow-lg'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalProjects / projectsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(totalProjects / projectsPerPage)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-bold transition-all text-sm md:text-base min-h-[44px] ${
                    currentPage === Math.ceil(totalProjects / projectsPerPage)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'glass-card bg-white/90 hover:bg-white text-indigo-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  次へ
                </button>
              </div>
            )}
          </>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Sparkles className="mx-auto mb-4 text-indigo-300" size={48}/>
              <p className="text-gray-700 text-lg">
                まだ公開されているビジネスLPがありません。<br/>
                あなたが最初のLPを作成してみませんか？
              </p>
            </div>
          )}
        </section>

        {/* 特徴セクション */}
        <section className="mb-12 md:mb-20 lg:mb-32 animate-fade-in delay-3">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg px-2">
            ずっと無料で使える、ビジネスLP作成ツール
          </h3>
          <p className="text-center text-white/90 mb-8 md:mb-12 text-sm md:text-base px-4">
            起業家、フリーランス、中小企業、個人事業主に最適
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* 特徴1: ノーコード編集 */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-indigo-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Code className="text-indigo-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                ノーコードで簡単作成
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                プログラミング知識は不要。直感的なエディタで、誰でもビジネスLPを作成できます。テンプレートから選んで、あなただけのLPを3分で。
              </p>
            </div>

            {/* 特徴2: AIアシスタント */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-purple-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Wand2 className="text-purple-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                AIアシスタント搭載
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                AIがあなたのビジネスや強みから、魅力的なキャッチコピーや説明文を自動生成。LP作成がさらに簡単に。
              </p>
            </div>

            {/* 特徴3: スマホ完全対応 */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-green-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Smartphone className="text-green-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                スマホ完全対応
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                レスポンシブデザインで、スマートフォンでもPCでも、キレイに表示。ビジネスLPをどこからでも確認できます。
              </p>
            </div>
          </div>
        </section>

        {/* 利用シーンセクション */}
        <section className="mb-12 md:mb-20 lg:mb-32 animate-fade-in delay-4">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-3 md:mb-4 drop-shadow-lg px-2">
            こんな方におすすめのビジネスLP作成ツール
          </h3>
          <p className="text-center text-white/90 mb-8 md:mb-12 text-sm md:text-base px-4">
            起業家、フリーランス、店舗経営者のビジネスをサポート
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* 利用シーン1: コンサル・士業 */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-orange-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Briefcase className="text-orange-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                コンサル・士業
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                サービス内容や実績、お客様の声をまとめて、見込み客へ訴求。問い合わせや相談予約へスムーズに誘導できます。
              </p>
            </div>

            {/* 利用シーン2: 店舗経営者 */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-blue-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Store className="text-blue-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                店舗経営者
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                メニュー、料金、アクセス、予約リンクを1ページに集約。QRコードでチラシやSNSから簡単に集客できます。
              </p>
            </div>

            {/* 利用シーン3: フリーランス */}
            <div className="glass-card rounded-2xl p-5 md:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-pink-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Wand2 className="text-pink-600" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3 accent-color">
                フリーランス
              </h4>
              <p className="text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base">
                ポートフォリオや実績、サービス内容をまとめたLP。営業資料として、クライアントへの提案に活用できます。
              </p>
            </div>
          </div>
        </section>

        {/* FAQセクション */}
        <section className="mb-12 md:mb-20 lg:mb-32 animate-fade-in delay-5">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-8 md:mb-12 drop-shadow-lg px-2">
            よくある質問
          </h3>
          
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            <details className="glass-card rounded-xl p-4 md:p-6 shadow-lg group">
              <summary className="font-bold text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                <span className="pr-2">LPチラシメーカー（エルチラ）は無料で使えますか？</span>
                <span className="text-indigo-600 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                はい、無料でご利用いただけます。ログインいただくと修正などができるようになります。また、寄付を行っていただくとHTMLダウンロードなどが行える機能が付与されます。</p>
            </details>
            
            <details className="glass-card rounded-xl p-4 md:p-6 shadow-lg group">
              <summary className="font-bold text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                <span className="pr-2">ログインしなくても使えますか？</span>
                <span className="text-indigo-600 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                はい、ログインなしでもビジネスLPを作成できます。ただし、ログインすると複数のLPを管理したり、後から編集したりできるようになります。
              </p>
            </details>
            
            <details className="glass-card rounded-xl p-4 md:p-6 shadow-lg group">
              <summary className="font-bold text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                <span className="pr-2">どんな人におすすめですか？</span>
                <span className="text-indigo-600 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                起業家、フリーランス、コンサルタント、士業、店舗経営者、個人事業主など、ビジネスの集客・販促を強化したい方におすすめです。ビジネスLP作成ツールとして、あなたのビジネスをサポートします。
              </p>
            </details>
            
            <details className="glass-card rounded-xl p-4 md:p-6 shadow-lg group">
              <summary className="font-bold text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                <span className="pr-2">他のLP作成ツールとの違いは？</span>
                <span className="text-indigo-600 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                LPチラシメーカー（エルチラ）は、ノーコードで簡単にビジネスLPを作成できる点に加え、AIアシスタント機能により、キャッチコピーや説明文を自動生成できます。また、テンプレートが豊富で、業種に合わせた最適なLPを素早く作成できます。
              </p>
            </details>
            
            <details className="glass-card rounded-xl p-4 md:p-6 shadow-lg group">
              <summary className="font-bold text-sm md:text-base lg:text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                <span className="pr-2">スマホでも作成できますか？</span>
                <span className="text-indigo-600 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
              </summary>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                はい、スマートフォンでも簡単にビジネスLPを作成・編集できます。レスポンシブデザインで、どのデバイスからでも快適にご利用いただけます。
              </p>
            </details>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="mt-12 md:mt-20 lg:mt-32 text-center animate-fade-in delay-6">
          <div className="glass-card rounded-2xl p-6 md:p-8 lg:p-12 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-900 drop-shadow-lg px-2">
              {user ? 'ビジネスLPを作成しましょう' : '今すぐ無料で始める'}
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-gray-800 mb-6 md:mb-8 drop-shadow-md px-2">
              {user 
                ? 'ダッシュボードから、新しいビジネスLPを作成できます。'
                : 'ログイン不要で、すぐにビジネスLPを作成できます。集客・販促に最適なLPを作って、あなたのビジネスを加速させましょう。'
              }
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 md:gap-3 mx-auto min-h-[44px]"
            >
              <Sparkles size={20} className="md:w-6 md:h-6"/>
              {user ? 'ダッシュボードへ' : '無料で作成する'}
              <ArrowRight size={20} className="md:w-6 md:h-6"/>
            </button>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 animate-fade-in delay-7">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="text-pink-500"/> LPチラシメーカー（エルチラ）
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  集客・販促を、もっと簡単に。<br/>
                  ビジネスLP作成ツール。<br/>
                  ずっと無料で使える、テンプレート豊富なLP作成サービス。
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 inline-block">メニュー</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => onCreate && onCreate()} className="text-gray-300 hover:text-white transition-colors">無料で作成</button></li>
                  <li><button onClick={() => setShowAuth && setShowAuth(true)} className="text-gray-300 hover:text-white transition-colors">ログイン</button></li>
                  <li><button onClick={() => window.location.href = '?page=profile-howto'} className="text-gray-300 hover:text-white transition-colors">使い方</button></li>
                  <li><button onClick={() => window.location.href = '?page=profile-effective'} className="text-gray-300 hover:text-white transition-colors">効果的な利用方法</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 inline-block">サポート・規約</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => window.location.href = '?page=contact'} className="text-gray-300 hover:text-white transition-colors">お問い合わせ</button></li>
                  <li><button onClick={() => window.location.href = '?page=legal'} className="text-gray-300 hover:text-white transition-colors">特定商取引法に基づく表記</button></li>
                  <li><button onClick={() => window.location.href = '?page=privacy'} className="text-gray-300 hover:text-white transition-colors">プライバシーポリシー</button></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} LPチラシメーカー（エルチラ）. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

