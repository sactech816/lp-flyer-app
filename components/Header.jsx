import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Sparkles, User, LayoutDashboard, TrendingUp, Menu, X, LogOut, HelpCircle, FileText, Lightbulb, Mail, Shield, Scale, PlusCircle, Bell, ExternalLink } from 'lucide-react';

const Header = ({ setPage, user, onLogout, setShowAuth = null }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const handleNav = (page) => {
        if (setPage) {
            setPage(page);
        } else {
            window.location.href = `/${page}`;
        }
        setIsMenuOpen(false);
    };

    // クライアントサイドでのみPortalを使用するためのマウント確認
    useEffect(() => {
        setMounted(true);
    }, []);

    // メニュー開閉時のスクロール制御
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // クリーンアップ：コンポーネントがアンマウントされたときにスクロールを元に戻す
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <>
        <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="font-bold text-xl flex items-center gap-2 text-indigo-700 cursor-pointer" onClick={()=>window.location.href='/'}>
                    <Sparkles className="text-pink-500"/> LPチラシメーカー（エルチラ）
                </div>

                {/* PC版メニューとハンバーガーメニューを一つの親divで囲む */}
                <div className="flex items-center gap-4 ml-auto">
                    {/* PC版：主要なボタンを外部に配置 */}
                    <div className="hidden md:flex items-center gap-4 text-sm font-bold text-gray-600">
                        <button onClick={()=>{window.location.href='/business/dashboard/editor/new'; setIsMenuOpen(false);}} className="text-gray-600 hover:text-indigo-600 flex items-center gap-1">
                            <PlusCircle size={16}/> 新規作成
                        </button>
                        {user ? (
                            <>
                                <button onClick={()=>{window.location.href='/business/dashboard'; setIsMenuOpen(false);}} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                                    <LayoutDashboard size={16}/> マイページ
                                </button>
                                <button onClick={()=>{onLogout(); setIsMenuOpen(false);}} className="text-gray-600 hover:text-red-600 flex items-center gap-1">
                                    <LogOut size={16}/> ログアウト
                                </button>
                            </>
                        ) : (
                            setShowAuth && (
                                <button onClick={()=>setShowAuth(true)} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                                    <User size={16}/> ログイン
                                </button>
                            )
                        )}
                    </div>

                    {/* ハンバーガーメニューボタン（PCとスマホ両方で表示） */}
                    <button className="text-gray-600 p-2" onClick={()=>setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>
            </div>

        </div>

            {/* オーバーレイとメニューをPortalでbody直下にレンダリング */}
            {mounted && isMenuOpen && createPortal(
                <>
                    {/* オーバーレイ：メニューが開いているときに背面を暗くする */}
                    <div 
                        className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in" 
                        onClick={() => setIsMenuOpen(false)}
                        style={{ top: '64px' }}
                    />

                    {/* ハンバーガーメニュー本体 */}
                    <div className="fixed w-full left-0 top-16 bg-white border-t shadow-xl py-4 px-6 flex flex-col gap-2 animate-fade-in z-[9999] h-[calc(100vh-64px)] overflow-y-auto pb-20">
                        <p className="text-xs font-bold text-gray-400 mt-4 mb-2">メニュー</p>
                        <button onClick={()=>{window.location.href='/business/dashboard/editor/new'; setIsMenuOpen(false);}} className="flex items-center gap-3 py-3 border-b border-gray-100 text-indigo-600 font-bold"><PlusCircle size={20}/> 新規作成</button>
                        <button onClick={()=>{window.location.href='/business/dashboard'; setIsMenuOpen(false);}} className="flex items-center gap-3 py-3 border-b border-gray-100 text-indigo-600 font-bold"><LayoutDashboard size={20}/> マイページ</button>
                        <a href="/p/demo-user" target="_blank" rel="noopener noreferrer" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-indigo-600 font-bold"><ExternalLink size={20}/> デモページ</a>
                        
                        <p className="text-xs font-bold text-gray-400 mt-4 mb-2">コンテンツページ</p>
                        <Link href="/announcements" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-indigo-600 font-bold"><Bell size={20}/> お知らせ</Link>
                        <Link href="/profile-howto" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-700 font-bold"><HelpCircle size={20}/> 使い方</Link>
                        <Link href="/profile-effective" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-700 font-bold"><Lightbulb size={20}/> 効果的な利用方法</Link>
                        <Link href="/profile-logic" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-700 font-bold"><TrendingUp size={20}/> 売れるLPの作り方</Link>
                        <Link href="/profile-faq" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-700 font-bold"><FileText size={20}/> よくある質問</Link>
                        <Link href="/contact" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-700 font-bold"><Mail size={20}/> お問い合わせ</Link>
                        
                        <p className="text-xs font-bold text-gray-400 mt-6 mb-2">サポート・規約</p>
                        <Link href="/legal" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-500 font-bold text-xs"><Scale size={16}/> 特定商取引法に基づく表記</Link>
                        <Link href="/privacy" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 py-3 border-b border-gray-100 text-gray-500 font-bold text-xs"><Shield size={16}/> プライバシーポリシー</Link>
                        
                        <div className="mt-8">
                        {user ? (
                            <>
                                <button onClick={()=>{window.location.href='/business/dashboard'; setIsMenuOpen(false);}} className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold mb-2"><LayoutDashboard size={20}/> マイページ</button>
                                <button onClick={()=>{onLogout(); setIsMenuOpen(false);}} className="w-full border border-red-100 text-red-600 py-3 rounded-xl flex items-center justify-center gap-2 font-bold"><LogOut size={20}/> ログアウト</button>
                            </>
                        ) : (
                            setShowAuth && (
                                <button onClick={()=>{setShowAuth(true); setIsMenuOpen(false);}} className="bg-black text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <User size={20}/> ログイン / 新規登録
                                </button>
                            )
                        )}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export default Header;
