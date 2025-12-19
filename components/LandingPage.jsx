"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Smartphone, Code, ArrowRight, Eye, Wand2, Store, Briefcase, ExternalLink, Coffee, ShoppingBag, GraduationCap, Laptop, Zap, Layers, ChevronDown, Check } from 'lucide-react';
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
      fortune: { label: '占い', badgeClass: 'category-badge-purple' },
      business: { label: 'ビジネス', badgeClass: 'category-badge-blue' },
      study: { label: '学習', badgeClass: 'category-badge-green' },
      other: { label: 'その他', badgeClass: 'category-badge-coral' }
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
    <div className="landing-page-wrapper geometric-bg">
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
      
      {/* ========================================
          ヒーローセクション
          ======================================== */}
      <section className="hero-geometric relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 relative z-10">
          <div className="text-center">
            {/* バッジ */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 md:mb-8">
              <Zap className="text-yellow-400" size={16} />
              <span className="text-sm md:text-base text-white font-medium">無料でずっと使える</span>
            </div>
            
            {/* メインコピー */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tight">
              <span className="text-white">集客・販促に使える</span>
              <br />
              <span className="gradient-text">ビジネスLP</span>
              <span className="text-white">を</span>
              <br className="md:hidden" />
              <span className="text-white">最短ルートで</span>
            </h2>
            
            {/* サブコピー */}
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              テンプレートを選んで、内容を書き換えるだけ。
            </p>
            <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto">
              「何を書けばいいかわからない」を解消し、集客に効くLPをスムーズに公開
            </p>
            
            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleGetStarted()}
                className="glow-button-coral text-base md:text-lg px-8 py-4 rounded-full font-bold flex items-center justify-center gap-3 min-h-[56px] transition-all"
              >
                <Sparkles size={20} />
                無料で作成する
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setShowAuth && setShowAuth(true)}
                className="bg-transparent border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all min-h-[56px]"
              >
                ログイン
              </button>
            </div>
          </div>
        </div>
        
        {/* 装飾用のジオメトリック要素 */}
        <div className="absolute top-20 left-10 w-20 h-20 border-2 border-blue-500/20 rotate-45 hidden lg:block"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-coral-500/20 rounded-full hidden lg:block"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rotate-12 hidden lg:block"></div>
      </section>

      {/* セクションディバイダー */}
      <div className="section-divider"></div>

      {/* ========================================
          テンプレート選択セクション
          ======================================== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          {/* セクションヘッダー */}
          <div className="text-center mb-12 md:mb-16">
            <span className="category-badge category-badge-blue mb-4 inline-block">Templates</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              業種別テンプレートで<span className="gradient-text-blue">簡単作成</span>
            </h3>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              あなたのビジネスに合ったテンプレートを選んで、すぐに作成開始
            </p>
          </div>
          
          {/* テンプレートカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recommendedTemplates.map((template) => {
              // テンプレートIDに応じた色とアイコンを設定
              const getTemplateStyle = (id) => {
                const styles = {
                  'consultant': { 
                    gradient: 'from-blue-500 to-blue-600',
                    iconBg: 'bg-blue-500/20',
                    iconColor: 'text-blue-400',
                    Icon: Briefcase
                  },
                  'store': { 
                    gradient: 'from-emerald-500 to-emerald-600',
                    iconBg: 'bg-emerald-500/20',
                    iconColor: 'text-emerald-400',
                    Icon: Store
                  },
                  'freelance': { 
                    gradient: 'from-indigo-500 to-indigo-600',
                    iconBg: 'bg-indigo-500/20',
                    iconColor: 'text-indigo-400',
                    Icon: Laptop
                  },
                  'coach': { 
                    gradient: 'from-purple-500 to-purple-600',
                    iconBg: 'bg-purple-500/20',
                    iconColor: 'text-purple-400',
                    Icon: GraduationCap
                  },
                  'retail-ec': { 
                    gradient: 'from-pink-500 to-pink-600',
                    iconBg: 'bg-pink-500/20',
                    iconColor: 'text-pink-400',
                    Icon: ShoppingBag
                  },
                  'cafe-restaurant': { 
                    gradient: 'from-amber-500 to-amber-600',
                    iconBg: 'bg-amber-500/20',
                    iconColor: 'text-amber-400',
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
                  className="dark-card p-6 md:p-8 cursor-pointer group"
                  onClick={() => handleGetStarted(template.id)}
                >
                  {/* アイコン */}
                  <div className={`${style.iconBg} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-5 transition-transform group-hover:scale-110`}>
                    <Icon className={style.iconColor} size={28}/>
                  </div>
                  
                  {/* テンプレート名 */}
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">
                    {template.name}
                  </h4>
                  
                  {/* 説明 */}
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-5 md:mb-6">
                    {template.description}
                  </p>
                  
                  {/* ボタン */}
                  <button className={`w-full bg-gradient-to-r ${style.gradient} text-white py-3 rounded-lg font-bold transition-all text-sm md:text-base min-h-[44px] flex items-center justify-center gap-2 group-hover:shadow-lg`}>
                    このテンプレートで作成
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
          
          {/* 追加情報 */}
          <div className="text-center mt-10 md:mt-12">
            <p className="text-slate-500 text-sm md:text-base">
              他にも全<span className="text-white font-bold">{templates.length}</span>種類のテンプレートをご用意
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          ビジネスLP事例セクション（ライトセクション）
          ======================================== */}
      <section className="light-section py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          {/* セクションヘッダー */}
          <div className="text-center mb-12 md:mb-16">
            <span className="category-badge category-badge-coral mb-4 inline-block">Examples</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              作成事例・ビジネスLP一覧
            </h3>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              実際に作成されたビジネスLPの事例を確認してみましょう
            </p>
          </div>
          
          {publicBusinessProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {publicBusinessProjects.map((project) => {
                  const category = getProjectCategory(project);
                  const categoryInfo = getCategoryInfo(category);
                  const projectName = getProjectName(project);
                  const description = getProjectDescription(project);
                  const theme = getProjectTheme(project);
                  
                  // 背景スタイルを決定
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
                      };
                    }
                    // フォールバック
                    return {
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                    };
                  };
                  
                  const backgroundStyle = getBackgroundStyle();
                  
                  return (
                    <a
                      key={project.id}
                      href={`/b/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bold-card overflow-hidden group"
                    >
                      {/* カードヘッダー */}
                      <div 
                        className="relative h-36 flex items-center justify-center"
                        style={backgroundStyle}
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <span className={`category-badge ${categoryInfo.badgeClass}`}>
                            {categoryInfo.label}
                          </span>
                        </div>
                        {!theme && (
                          <Layers className="text-white/30" size={48}/>
                        )}
                      </div>
                      
                      {/* カードコンテンツ */}
                      <div className="p-5 md:p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                            {projectName}
                          </h4>
                          <ExternalLink className="text-blue-500 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" size={18}/>
                        </div>
                        
                        {description && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                            {description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                            <Eye size={16}/>
                            LPを見る
                          </div>
                          <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={18}/>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              
              {/* ページネーション */}
              {totalProjects > projectsPerPage && (
                <div className="mt-10 md:mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-bold transition-all text-sm min-h-[44px] ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    前へ
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.ceil(totalProjects / projectsPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all text-sm min-h-[44px] ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalProjects / projectsPerPage), prev + 1))}
                    disabled={currentPage === Math.ceil(totalProjects / projectsPerPage)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all text-sm min-h-[44px] ${
                      currentPage === Math.ceil(totalProjects / projectsPerPage)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    次へ
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bold-card p-12 text-center max-w-xl mx-auto">
              <Layers className="mx-auto mb-4 text-gray-300" size={48}/>
              <p className="text-gray-600 text-lg">
                まだ公開されているビジネスLPがありません。<br/>
                あなたが最初のLPを作成してみませんか？
              </p>
              <button
                onClick={() => handleGetStarted()}
                className="mt-6 glow-button text-base px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 mx-auto min-h-[44px]"
              >
                <Sparkles size={18} />
                LPを作成する
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          特徴セクション
          ======================================== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          {/* セクションヘッダー */}
          <div className="text-center mb-12 md:mb-16">
            <span className="category-badge category-badge-green mb-4 inline-block">Features</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              ずっと<span className="gradient-text">無料</span>で使える
            </h3>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              起業家、フリーランス、中小企業、個人事業主に最適
            </p>
          </div>
          
          {/* 特徴カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 特徴1: ノーコード編集 */}
            <div className="dark-card p-6 md:p-8 text-center accent-border-top">
              <div className="number-highlight mb-2">01</div>
              <div className="bg-blue-500/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="text-blue-400" size={32}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                ノーコードで簡単作成
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                プログラミング知識は不要。直感的なエディタで、誰でもビジネスLPを作成できます。
              </p>
            </div>

            {/* 特徴2: AIアシスタント */}
            <div className="dark-card p-6 md:p-8 text-center accent-border-top">
              <div className="number-highlight mb-2">02</div>
              <div className="bg-purple-500/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wand2 className="text-purple-400" size={32}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                AIアシスタント搭載
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                AIがあなたのビジネスから、魅力的なキャッチコピーや説明文を自動生成。
              </p>
            </div>

            {/* 特徴3: スマホ完全対応 */}
            <div className="dark-card p-6 md:p-8 text-center accent-border-top">
              <div className="number-highlight mb-2">03</div>
              <div className="bg-emerald-500/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-emerald-400" size={32}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                スマホ完全対応
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                レスポンシブデザインで、スマートフォンでもPCでもキレイに表示。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          利用シーンセクション
          ======================================== */}
      <section className="py-16 md:py-24 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          {/* セクションヘッダー */}
          <div className="text-center mb-12 md:mb-16">
            <span className="category-badge category-badge-purple mb-4 inline-block">Use Cases</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              こんな方に<span className="gradient-text-blue">おすすめ</span>
            </h3>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
              起業家、フリーランス、店舗経営者のビジネスをサポート
            </p>
          </div>
          
          {/* 利用シーンカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 利用シーン1: コンサル・士業 */}
            <div className="dark-card p-6 md:p-8 accent-border-left">
              <div className="bg-orange-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="text-orange-400" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                コンサル・士業
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4">
                サービス内容や実績、お客様の声をまとめて、見込み客へ訴求。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  問い合わせへスムーズに誘導
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  実績・事例を効果的にアピール
                </li>
              </ul>
            </div>

            {/* 利用シーン2: 店舗経営者 */}
            <div className="dark-card p-6 md:p-8 accent-border-left">
              <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Store className="text-blue-400" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                店舗経営者
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4">
                メニュー、料金、アクセス、予約リンクを1ページに集約。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  QRコードでチラシから誘導
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  SNSからの集客に最適
                </li>
              </ul>
            </div>

            {/* 利用シーン3: フリーランス */}
            <div className="dark-card p-6 md:p-8 accent-border-left">
              <div className="bg-pink-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Wand2 className="text-pink-400" size={28}/>
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                フリーランス
              </h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-4">
                ポートフォリオや実績、サービス内容をまとめたLP。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  営業資料として活用
                </li>
                <li className="flex items-center gap-2 text-slate-300 text-sm">
                  <Check className="text-emerald-400 flex-shrink-0" size={16} />
                  クライアントへの提案に
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FAQセクション
          ======================================== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          {/* セクションヘッダー */}
          <div className="text-center mb-12 md:mb-16">
            <span className="category-badge category-badge-blue mb-4 inline-block">FAQ</span>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4">
              よくある質問
            </h3>
          </div>
          
          {/* FAQアイテム */}
          <div className="space-y-4">
            <details className="faq-dark-item group">
              <summary className="min-h-[56px]">
                <span className="pr-4 text-sm md:text-base">LPチラシメーカー（エルチラ）は無料で使えますか？</span>
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
              </summary>
              <div className="faq-answer text-sm md:text-base">
                はい、無料でご利用いただけます。ログインいただくと修正などができるようになります。また、寄付を行っていただくとHTMLダウンロードなどが行える機能が付与されます。
              </div>
            </details>
            
            <details className="faq-dark-item group">
              <summary className="min-h-[56px]">
                <span className="pr-4 text-sm md:text-base">ログインしなくても使えますか？</span>
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
              </summary>
              <div className="faq-answer text-sm md:text-base">
                はい、ログインなしでもビジネスLPを作成できます。ただし、ログインすると複数のLPを管理したり、後から編集したりできるようになります。
              </div>
            </details>
            
            <details className="faq-dark-item group">
              <summary className="min-h-[56px]">
                <span className="pr-4 text-sm md:text-base">どんな人におすすめですか？</span>
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
              </summary>
              <div className="faq-answer text-sm md:text-base">
                起業家、フリーランス、コンサルタント、士業、店舗経営者、個人事業主など、ビジネスの集客・販促を強化したい方におすすめです。
              </div>
            </details>
            
            <details className="faq-dark-item group">
              <summary className="min-h-[56px]">
                <span className="pr-4 text-sm md:text-base">他のLP作成ツールとの違いは？</span>
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
              </summary>
              <div className="faq-answer text-sm md:text-base">
                LPチラシメーカー（エルチラ）は、ノーコードで簡単にビジネスLPを作成できる点に加え、AIアシスタント機能により、キャッチコピーや説明文を自動生成できます。また、テンプレートが豊富で、業種に合わせた最適なLPを素早く作成できます。
              </div>
            </details>
            
            <details className="faq-dark-item group">
              <summary className="min-h-[56px]">
                <span className="pr-4 text-sm md:text-base">スマホでも作成できますか？</span>
                <ChevronDown className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" size={20} />
              </summary>
              <div className="faq-answer text-sm md:text-base">
                はい、スマートフォンでも簡単にビジネスLPを作成・編集できます。レスポンシブデザインで、どのデバイスからでも快適にご利用いただけます。
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ========================================
          CTAセクション
          ======================================== */}
      <section className="gradient-cta-section py-16 md:py-24 relative">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 md:mb-6">
            {user ? 'ビジネスLPを作成しましょう' : '今すぐ無料で始める'}
          </h3>
          <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
            {user 
              ? 'ダッシュボードから、新しいビジネスLPを作成できます。'
              : 'ログイン不要で、すぐにビジネスLPを作成できます。集客・販促に最適なLPを作って、あなたのビジネスを加速させましょう。'
            }
          </p>
          <button
            onClick={() => handleGetStarted()}
            className="bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-full font-black text-lg md:text-xl shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto min-h-[60px]"
          >
            <Sparkles size={24}/>
            {user ? 'ダッシュボードへ' : '無料で作成する'}
            <ArrowRight size={24}/>
          </button>
        </div>
      </section>

      {/* ========================================
          フッター
          ======================================== */}
      <footer className="py-12 md:py-16 border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* ロゴ・説明 */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="text-white" size={18}/>
                </div>
                エルチラ
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
                集客・販促を、もっと簡単に。<br/>
                ビジネスLP作成ツール。<br/>
                ずっと無料で使える、テンプレート豊富なLP作成サービス。
              </p>
            </div>
            
            {/* メニュー */}
            <div>
              <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">メニュー</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => onCreate && onCreate()} className="text-slate-400 hover:text-white transition-colors">
                    無料で作成
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowAuth && setShowAuth(true)} className="text-slate-400 hover:text-white transition-colors">
                    ログイン
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '?page=profile-howto'} className="text-slate-400 hover:text-white transition-colors">
                    使い方
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '?page=profile-effective'} className="text-slate-400 hover:text-white transition-colors">
                    効果的な利用方法
                  </button>
                </li>
              </ul>
            </div>
            
            {/* サポート */}
            <div>
              <h5 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">サポート・規約</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => window.location.href = '?page=contact'} className="text-slate-400 hover:text-white transition-colors">
                    お問い合わせ
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '?page=legal'} className="text-slate-400 hover:text-white transition-colors">
                    特定商取引法に基づく表記
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '?page=privacy'} className="text-slate-400 hover:text-white transition-colors">
                    プライバシーポリシー
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* コピーライト */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} LPチラシメーカー（エルチラ）. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
