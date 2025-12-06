"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Smartphone, Code, Share2, ArrowRight, CheckCircle, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LandingPage = ({ user, setShowAuth, onNavigateToDashboard }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // ログイン済みならダッシュボードへ
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } else {
      // 未ログインならログイン画面を表示
      if (setShowAuth) {
        setShowAuth(true);
      }
    }
  };

  return (
    <div className="profile-page-wrapper min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-20">
        {/* ヒーローセクション */}
        <section className="text-center mb-20 md:mb-32 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-6 leading-tight">
              世界一美しいプロフィールを、<br className="md:hidden"/>3分で。
            </h1>
            <p className="text-lg md:text-xl text-white font-semibold px-4 drop-shadow-md mb-8 leading-relaxed">
              エンジニアでなくても、スマホだけで。<br className="md:hidden"/>
              あなたの魅力を伝える「集客導線」を作りましょう。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="glass-card bg-white/95 hover:bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {user ? (
                <>
                  <Sparkles size={20}/>
                  ダッシュボードへ
                </>
              ) : (
                <>
                  <Sparkles size={20}/>
                  無料で始める
                </>
              )}
              <ArrowRight size={20}/>
            </button>
            
            <a
              href="/p/demo-user"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card bg-white/80 hover:bg-white/95 text-gray-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Eye size={20}/>
              デモページを見る
            </a>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="mb-20 md:mb-32 animate-fade-in delay-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
            こんなに簡単、こんなに美しい
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* 特徴1: ノーコードで簡単編集 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="text-indigo-600" size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3 accent-color">
                ノーコードで簡単編集
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                プログラミング知識は不要。直感的なエディタで、誰でも美しいプロフィールページを作成できます。
              </p>
            </div>

            {/* 特徴2: スマホ・PC完全対応 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-purple-600" size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3 accent-color">
                スマホ・PC完全対応
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                レスポンシブデザインで、スマートフォンでもPCでも、美しく表示されます。
              </p>
            </div>

            {/* 特徴3: LINEやSNSへスムーズ誘導 */}
            <div className="glass-card rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-green-600" size={32}/>
              </div>
              <h3 className="text-xl font-bold mb-3 accent-color">
                LINEやSNSへスムーズ誘導
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                LINE公式アカウントやSNSへのリンクを簡単に追加。集客導線をスムーズに構築できます。
              </p>
            </div>
          </div>
        </section>

        {/* デモへの誘導 */}
        <section className="text-center animate-fade-in delay-4">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 accent-color">
              まずはデモページをご覧ください
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              実際のプロフィールページがどのように表示されるか、デモページで確認できます。
            </p>
            <a
              href="/p/demo-user"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Eye size={20}/>
              デモページを見る
              <ArrowRight size={20}/>
            </a>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="mt-20 md:mt-32 text-center animate-fade-in delay-6">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-xl max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white drop-shadow-lg">
              {user ? 'プロフィールを作成しましょう' : '今すぐ無料で始める'}
            </h2>
            <p className="text-white mb-8 text-lg drop-shadow-md">
              {user 
                ? 'ダッシュボードから、新しいプロフィールページを作成できます。'
                : 'ログイン不要で、すぐにプロフィールページを作成できます。'
              }
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white hover:bg-gray-50 text-indigo-600 px-10 py-5 rounded-full font-bold text-xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <Sparkles size={24}/>
              {user ? 'ダッシュボードへ' : '無料で始める'}
              <ArrowRight size={24}/>
            </button>
          </div>
        </section>

        {/* フッター */}
        <footer className="mt-20 text-center animate-fade-in delay-8">
          <p className="text-sm text-white/90 drop-shadow-md">
            &copy; {new Date().getFullYear()} プロフィールLPメーカー. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

