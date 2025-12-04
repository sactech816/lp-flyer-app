import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Header from './Header';
import SEO from './SEO';

// --- FAQ Page ---
export const FaqPage = ({ onBack, setPage, user, onLogout, setShowAuth, isAdmin }) => {
    useEffect(() => { document.title = "よくある質問 | 診断クイズメーカー"; }, []);
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
        { category: "一般・全般", q: "無料で使えますか？", a: "はい、現在はβ版としてすべての機能を無料で公開しています。" },
        { category: "一般・全般", q: "商用利用は可能ですか？", a: "可能です。作成した診断クイズをご自身のビジネスに自由にご活用ください。" },
        { category: "操作・作成", q: "作った診断を修正したいのですが", a: "マイページからご自身の診断を編集・削除することが可能です。" },
    ];
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header setPage={setPage} user={user} onLogout={onLogout} setShowAuth={setShowAuth} isAdmin={isAdmin} />
            <div className="max-w-3xl mx-auto py-12 px-4">
                <button onClick={onBack} className="mb-6 flex items-center gap-1 text-gray-500 font-bold hover:text-indigo-600"><ArrowLeft size={16}/> 戻る</button>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">よくある質問</h1>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full px-6 py-4 text-left font-bold text-gray-800 flex justify-between items-center hover:bg-gray-50">
                                <span className="flex items-center gap-3"><span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">{faq.category}</span>{faq.q}</span>
                                {openIndex === i ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                            </button>
                            {openIndex === i && <div className="px-6 py-4 bg-gray-50 text-gray-600 text-sm leading-relaxed border-t border-gray-100">{faq.a}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Price Page ---
export const PricePage = ({ onBack, setPage, user, onLogout, setShowAuth, isAdmin }) => {
    useEffect(() => { document.title = "料金プラン | 診断クイズメーカー"; }, []);
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header setPage={setPage} user={user} onLogout={onLogout} setShowAuth={setShowAuth} isAdmin={isAdmin} />
            <div className="py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <button onClick={onBack} className="mb-6 flex items-center gap-1 text-gray-500 font-bold hover:text-indigo-600 mx-auto"><ArrowLeft size={16}/> トップへ戻る</button>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">料金プラン</h1>
                    <p className="text-gray-600 mb-12">現在はベータ版のため、基本機能はすべて無料でご利用いただけます。</p>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-indigo-500 relative transform scale-105 z-10">
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">BETA FREE</span>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900">Standard</h3>
                            <div className="text-4xl font-extrabold mb-4 text-gray-900">¥0<span className="text-sm font-medium text-gray-500">/月</span></div>
                            <ul className="space-y-3 mb-8 text-sm text-gray-600">
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500"/>診断作成数 無制限</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500"/>AI自動生成機能</li>
                                <li className="flex gap-2"><CheckCircle size={16} className="text-green-500"/>簡易アクセス解析</li>
                            </ul>
                            <button className="w-full py-3 rounded-lg font-bold bg-indigo-600 text-white">現在のプラン</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HowTo Page ---
export const HowToPage = ({ onBack, setPage, user, onLogout, setShowAuth, isAdmin }) => {
    useEffect(() => { document.title = "使い方・規約 | 診断クイズメーカー"; }, []);
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header setPage={setPage} user={user} onLogout={onLogout} setShowAuth={setShowAuth} isAdmin={isAdmin} />
            <div className="py-12 px-4 max-w-3xl mx-auto">
                <button onClick={onBack} className="mb-6 flex items-center gap-1 text-gray-500 font-bold hover:text-indigo-600"><ArrowLeft size={16}/> 戻る</button>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">診断クイズの作り方・規約</h1>
                <div className="space-y-8 text-gray-800 leading-relaxed">
                    <p>このツールは、ビジネス向けの診断コンテンツを手軽に作成するためのツールです。</p>
                    <ul className="list-disc pl-5 space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <li><strong>質問：</strong> 5問</li>
                        <li><strong>選択肢：</strong> 各質問に4つ</li>
                        <li><strong>結果パターン：</strong> 3種類</li>
                    </ul>
                    <div>
                        <h2 className="text-xl font-bold text-indigo-700 mb-4">利用規約・免責事項</h2>
                        <ul className="list-disc pl-5 space-y-3 text-sm">
                            <li><strong>ツール本体について:</strong> 本書購入者様のみご利用可能です。</li>
                            <li><strong>作成したコンテンツの利用:</strong> 個人・商用を問わず自由にご利用いただけます。</li>
                            <li><strong>免責事項:</strong> 本ツールの利用によって生じたいかなる損害についても、提供者は一切の責任を負いません。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};