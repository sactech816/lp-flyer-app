import React from 'react';
import { Sparkles, Crown, User, LayoutDashboard } from 'lucide-react';

const Header = ({ setPage, isAdmin, user, onLogout, setShowAuth }) => (
    <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="font-bold text-xl flex items-center gap-2 text-indigo-700 cursor-pointer" onClick={()=>setPage('portal')}>
                <Sparkles className="text-pink-500"/> 診断クイズメーカー
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                <button onClick={()=>setPage('faq')} className="hidden md:block hover:text-indigo-600">よくある質問</button>
                {user ? (
                    <div className="flex items-center gap-2">
                        <button onClick={()=>setPage('dashboard')} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-indigo-100 transition-colors">
                            <LayoutDashboard size={16}/> <span className="hidden md:inline">マイページ</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={()=>setShowAuth(true)} className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <User size={16}/> <span className="hidden md:inline">ログイン</span>
                    </button>
                )}
                {isAdmin && (
                    <div className="hidden md:flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 border border-indigo-200">
                        <Crown size={14}/> <span className="text-xs">管理者</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default Header;