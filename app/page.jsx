"use client";

import React, { useState, useEffect } from 'react';

// 【必須】npm install @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

import { 
  Play, Edit3, CreditCard, MessageSquare, CheckCircle, ChevronRight, 
  Trash2, ArrowLeft, Save, RefreshCw, Loader2, Bot, Trophy, 
  Home, ThumbsUp, ExternalLink, MessageCircle, Lock, Share2, 
  Sparkles, X, Crown, LogIn, LogOut, User, Key
} from 'lucide-react';

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// クライアント作成
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- Logic: Result Calculation ---
const calculateResult = (answers, results) => {
  const scores = { A: 0, B: 0, C: 0 };
  Object.values(answers).forEach(option => {
    if (option.score) {
      Object.entries(option.score).forEach(([type, point]) => {
        scores[type] = (scores[type] || 0) + (parseInt(point, 10) || 0);
      });
    }
  });
  let maxType = 'A';
  let maxScore = -1;
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  });
  return results.find(r => r.type === maxType) || results[0];
};

// --- Components ---

// 1. Auth Modal
const AuthModal = ({ isOpen, onClose, setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    if (!isOpen) return null;

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        
        if (!supabase) {
            setMsg('Supabase設定が見つかりません');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = isLogin 
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (error) throw error;

            if (isLogin) {
                if (data.user) {
                    setUser(data.user);
                    onClose();
                }
            } else {
                setMsg('確認メールを送信しました。メール内のリンクをクリックしてください。');
            }
        } catch (error) {
            setMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{isLogin ? 'ログイン' : '新規登録'}</h2>
                
                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">メールアドレス</label>
                        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">パスワード</label>
                        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" placeholder="6文字以上" minLength={6} />
                    </div>
                    
                    {msg && <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{msg}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : (isLogin ? 'ログイン' : '登録する')}
                    </button>
                </form>
                
                <div className="mt-6 text-center border-t pt-4">
                    <button onClick={() => {setIsLogin(!isLogin); setMsg('');}} className="text-sm text-blue-600 hover:underline font-medium">
                        {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. Price Page
const PricePage = ({ onBack }) => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-900">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-600 font-bold hover:text-blue-600"><ArrowLeft/> トップへ戻る</button>
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">料金プラン</h1>
            <p className="text-xl text-gray-600 mb-12">あなたのビジネス規模に合わせた最適なプランをお選びください。</p>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {name:"Free", price:"¥0", desc:"まずはここから", feat:["クイズ作成数: 3つまで","基本テンプレート","AIアシスタント(制限あり)"]},
                    {name:"Pro", price:"¥2,980", period:"/月", desc:"個人事業主・フリーランス向け", feat:["クイズ作成数: 無制限","LINE/LP誘導ボタン設置","広告非表示","アクセス解析"], rec:true},
                    {name:"Business", price:"¥9,800", period:"/月", desc:"企業・チーム向け", feat:["Proの全機能","独自ドメイン","チーム管理","優先サポート"]}
                ].map((plan, i) => (
                    <div key={i} className={`bg-white rounded-2xl p-8 shadow-xl border-2 ${plan.rec ? 'border-blue-500 relative' : 'border-transparent'}`}>
                        {plan.rec && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">RECOMMENDED</span>}
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-4xl font-extrabold mb-2">{plan.price}<span className="text-sm font-medium text-gray-500">{plan.period}</span></div>
                        <p className="text-gray-500 mb-6 text-sm">{plan.desc}</p>
                        <ul className="text-left space-y-3 mb-8">
                            {plan.feat.map((f, j)=><li key={j} className="flex gap-2 text-sm font-medium"><CheckCircle size={16} className="text-green-500 flex-shrink-0"/>{f}</li>)}
                        </ul>
                        <button className={`w-full py-3 rounded-lg font-bold ${plan.rec ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>選択する</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// 3. HowTo Page
const HowToPage = ({ onBack }) => (
    <div className="min-h-screen bg-white py-12 px-4 font-sans text-gray-900">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-600 font-bold hover:text-blue-600 max-w-4xl mx-auto"><ArrowLeft/> トップへ戻る</button>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">売れる診断クイズの作り方</h1>
            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">1</span> ターゲットとゴールを決める</h2>
                    <p className="text-gray-700 leading-relaxed">まずは「誰に」「どうなって欲しいか」を明確にします。例えば「30代の婚活女性」に「自分の恋愛の癖を知って、相談所に来て欲しい」など。</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">2</span> 結果パターン（出口）から作る</h2>
                    <p className="text-gray-700 leading-relaxed">質問から考えるのはNGです。まずは読ませたい「診断結果（Aタイプ、Bタイプ...）」を3〜4つ用意し、それぞれに合ったアドバイスと誘導（LINE登録など）を考えましょう。</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><span className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">3</span> 質問で振り分ける</h2>
                    <p className="text-gray-700 leading-relaxed">結果パターンに導くための質問を作ります。「この回答を選んだらAタイプっぽいな」という配点を設定していくだけです。AIアシスタントを使えば一瞬で作成できます。</p>
                </section>
            </div>
        </div>
    </div>
);

// 4. Portal (Top Page)
const Portal = ({ quizzes, isLoading, onPlay, onCreate, user, setShowAuth, onLogout, setPage }) => {
  const handleLike = async (e, quiz) => {
      e.stopPropagation();
      if(!supabase) return;
      await supabase.from('quizzes').update({ likes_count: (quiz.likes_count||0) + 1 }).eq('id', quiz.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="font-bold text-xl flex items-center gap-2 text-indigo-700 cursor-pointer" onClick={()=>setPage('portal')}><Sparkles className="text-pink-500"/> 診断メーカー</div>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-600">
                  <button onClick={()=>setPage('price')} className="hover:text-indigo-600">料金プラン</button>
                  <button onClick={()=>setPage('howto')} className="hover:text-indigo-600">作り方</button>
                  {user ? (
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <User size={14}/> <span className="truncate max-w-[100px]">{user.email}</span>
                          <button onClick={onLogout} title="ログアウト"><LogOut size={14}/></button>
                      </div>
                  ) : (
                      <button onClick={()=>setShowAuth(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700">ログイン</button>
                  )}
              </div>
          </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 to-blue-800 text-white py-20 px-6 text-center rounded-b-[3rem] shadow-xl mb-12">
        <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-bold mb-6 text-blue-100">
                <Sparkles size={12}/> AI診断作成プラットフォーム
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-sm">
                顧客の心を掴む<br/>診断コンテンツを、今すぐ。
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                プログラミング不要。AIがあなたの代わりに診断を作成。<br/>
                LINE登録や商品購入への誘導もスムーズに。
            </p>
            <button 
              onClick={onCreate}
              className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-gray-50 flex items-center gap-2 mx-auto transform transition hover:scale-105"
            >
              <Edit3 size={20} /> 今すぐ無料で作成する
            </button>
        </div>
      </div>

      {/* List */}
      <div id="quiz-list" className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 border-l-4 border-indigo-600 pl-4">人気の診断</h2>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-gray-600 font-bold">データを読み込んでいます...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-lg border border-gray-100">
            <p className="text-gray-900 font-bold mb-2 text-xl">まだ診断がありません</p>
            <p className="text-gray-600">「無料で作成する」から最初のコンテンツを作りましょう。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <div key={quiz.id} onClick={() => onPlay(quiz)} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 group cursor-pointer">
                <div className={`h-40 ${quiz.color || 'bg-gray-500'} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {quiz.category || '未分類'}
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white bg-black/30 backdrop-blur px-2 py-1 rounded-full text-xs font-bold">
                    <ThumbsUp size={12} /> {quiz.likes_count || 0}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                  <p className="text-gray-800 text-sm mb-6 flex-grow leading-relaxed line-clamp-3 font-medium">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">診断する</span>
                    <button 
                        onClick={(e) => handleLike(e, quiz)}
                        className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors px-2 py-1 rounded-md hover:bg-pink-50"
                    >
                        <ThumbsUp size={16} /> <span className="text-xs font-bold">{quiz.likes_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer className="bg-gray-900 text-gray-400 py-12 text-center mt-12">
          <div className="flex justify-center gap-6 mb-8 font-bold text-sm">
              <button onClick={()=>setPage('price')} className="hover:text-white transition-colors">料金プラン</button>
              <button onClick={()=>setPage('howto')} className="hover:text-white transition-colors">作り方</button>
              <a href="#" className="hover:text-white transition-colors">利用規約</a>
          </div>
          <p className="text-xs">&copy; 2025 Diagnosis Maker. All rights reserved.</p>
      </footer>
    </div>
  );
};

// 5. Result View
const ResultView = ({ quiz, result, onRetry, onBack }) => {
  const [likes, setLikes] = useState(quiz.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes(l => l + 1);
    setHasLiked(true);
    if (supabase) {
        await supabase.from('quizzes').update({ likes_count: likes + 1 }).eq('id', quiz.id);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in my-8">
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-10 text-center relative">
            <Trophy className="mx-auto mb-4 text-yellow-300 drop-shadow-lg" size={64} />
            <p className="text-indigo-100 font-bold mb-2 tracking-widest text-sm uppercase">Diagnosis Result</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">{result.title}</h2>
        </div>
        <div className="p-8 md:p-10">
            <div className="prose prose-lg text-gray-900 leading-relaxed mb-10 whitespace-pre-wrap font-medium">
                {result.description}
            </div>
            
            {/* 結果ごとのリンク表示 */}
            {result.link_url && (
                <div className="mb-8 transform transition-transform hover:scale-[1.02]">
                    <a href={result.link_url} target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                        <ExternalLink size={20} /> {result.link_text || "詳細を見る"}
                    </a>
                </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${hasLiked ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-900 hover:bg-pink-50 hover:text-pink-500'}`}><ThumbsUp size={18} className={hasLiked ? 'fill-current' : ''} /> <span className="text-sm">{likes}</span></button>
                <div className="flex gap-3">
                    <button onClick={onRetry} className="text-gray-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-50"><RefreshCw size={16} /> 再診断</button>
                    <button onClick={onBack} className="text-gray-500 hover:text-indigo-600 font-bold text-sm flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-50"><Home size={16} /> TOP</button>
                </div>
            </div>
        </div>
    </div>
  );
};

const QuizCardLayout = ({ quiz, currentStep, onAnswer }) => {
  let questions = quiz.questions;
  if (typeof questions === 'string') { try { questions = JSON.parse(questions); } catch (e) { questions = []; } }
  const question = questions ? questions[currentStep] : null;
  
  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-8 px-2">
        <div className="flex justify-between text-xs text-gray-600 mb-2 font-bold tracking-wider">
          <span>QUESTION {currentStep + 1} / {questions.length}</span>
          <span>{Math.round(((currentStep)/questions.length)*100)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${((currentStep)/questions.length)*100}%` }}></div></div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative min-h-[400px] flex flex-col justify-center animate-fade-in">
        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center leading-relaxed">{question?.text}</h3>
        <div className="space-y-4">
          {question?.options.map((opt, idx) => (
            <button key={idx} onClick={() => onAnswer(opt)} className="w-full p-5 text-left border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 text-gray-900 font-bold transition-all duration-200 flex items-center justify-between group shadow-sm">
              <span className="group-hover:text-blue-700 text-lg">{opt.label}</span>
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex-shrink-0"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuizChatLayout = ({ quiz, currentStep, onAnswer }) => {
  return <QuizCardLayout quiz={quiz} currentStep={currentStep} onAnswer={onAnswer} />;
};

const QuizPlayer = ({ quiz, onBack }) => {
  const [layout, setLayout] = useState('card'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
  const questions = typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : quiz.questions;
  const results = typeof quiz.results === 'string' ? JSON.parse(quiz.results) : quiz.results;

  const handleAnswer = (option) => {
    const newAnswers = { ...answers, [currentStep]: option };
    setAnswers(newAnswers);
    if (currentStep + 1 < questions.length) { setCurrentStep(currentStep + 1); } else { setResult(calculateResult(newAnswers, results)); }
  };

  if (result) { return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"><ResultView quiz={quiz} result={result} onRetry={() => {setResult(null); setCurrentStep(0); setAnswers({});}} onBack={onBack} /></div>; }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-6">
      <div className="w-full max-w-md flex justify-between items-center mb-4 px-4">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-bold text-sm"><ArrowLeft size={16}/> 戻る</button>
          <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border shadow-sm truncate max-w-[200px]">{quiz.title}</div>
      </div>
      <QuizCardLayout quiz={{...quiz, questions}} currentStep={currentStep} onAnswer={handleAnswer} />
    </div>
  );
};

// 6. Editor
const Editor = ({ onBack, onSave, onDelete, user, onLoginRequest }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  
  // AI Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Billing Modal
  const [showBillingModal, setShowBillingModal] = useState(false);

  const [editForm, setEditForm] = useState({
      title: "新規ビジネス診断",
      description: "診断の説明文を入力してください...",
      category: "Business",
      color: "bg-indigo-600",
      settings: { lp_url: "", lp_text: "", line_url: "", line_text: "" }, // Legacy support
      questions: Array(5).fill(null).map((_, i) => ({ text: `質問${i+1}`, options: Array(4).fill(null).map((_, j) => ({ label: `選択肢${j+1}`, score: { A: j===0?3:0, B: j===1?3:0, C: j===2?3:0 } })) })),
      results: [ 
          { type: "A", title: "タイプA", description: "結果説明...", link_url:"", link_text:"" }, 
          { type: "B", title: "タイプB", description: "結果説明...", link_url:"", link_text:"" }, 
          { type: "C", title: "タイプC", description: "結果説明...", link_url:"", link_text:"" } 
      ]
  });

  const handlePublish = () => {
      const url = `${window.location.origin}?id=${savedId}`;
      navigator.clipboard.writeText(url);
      alert(`公開URLをコピーしました！\n${url}`);
  };

  const handleAiGenerate = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if(!apiKey) return alert('環境変数にOpenAI APIキーが設定されていません');
      if(!aiTheme) return alert('テーマを入力してください');

      setIsGenerating(true);
      try {
          const prompt = `
            テーマ「${aiTheme}」の診断クイズを作成。JSONのみ出力。
            構成: title, description, category, questions(5問4択,各score{A,B,C}), results(3タイプ, title, description)
          `;
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
              body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] })
          });
          const data = await res.json();
          const jsonStr = data.choices[0].message.content.match(/\{[\s\S]*\}/)[0];
          const aiData = JSON.parse(jsonStr);
          setEditForm(prev => ({
              ...prev,
              ...aiData,
              results: aiData.results.map(r => ({...r, link_url:"", link_text:""})) // AIデータにリンク枠追加
          }));
          setShowAiModal(false);
          alert('AI生成完了！');
      } catch(e) { alert('生成エラー: ' + e.message); } finally { setIsGenerating(false); }
  };

  const Input = ({ label, val, onChange, placeholder, className }) => ( <div className="mb-4"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label><input type="text" value={val} onChange={onChange} className={`w-full border border-gray-300 rounded-lg p-2.5 font-bold text-gray-900 outline-none focus:border-indigo-500 focus:bg-indigo-50 transition-colors ${className}`} placeholder={placeholder} /></div> );
  const Textarea = ({ label, val, onChange }) => ( <div className="mb-4"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label><textarea rows={3} value={val} onChange={onChange} className="w-full border border-gray-300 rounded-lg p-2.5 font-medium text-gray-900 outline-none focus:border-indigo-500 focus:bg-indigo-50 transition-colors" /></div> );

  // ビジネス連携タブのロック判定：ログインしていればロック解除
  const isBusinessLocked = !user;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-3"><button onClick={onBack} className="text-gray-500 hover:text-gray-900"><ArrowLeft /></button><h2 className="font-bold text-xl text-gray-900">エディタ</h2></div>
            <div className="flex gap-2">
                {savedId && <button onClick={handlePublish} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm"><Share2 size={18}/> <span className="hidden sm:inline">URLコピー</span></button>}
                <button onClick={async ()=>{setIsSaving(true); const id=await onSave(editForm, savedId); if(id){setSavedId(id); sessionStorage.setItem('lastCreatedQuizId',id);} setIsSaving(false);}} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 shadow-md">{isSaving ? <Loader2 className="animate-spin"/> : <Save size={18}/>} 保存</button>
            </div>
        </div>

        <div className="flex flex-grow overflow-hidden">
            <div className="w-56 bg-white border-r flex flex-col py-4">
                {[ {id: 'basic', label: '基本設定', icon: Edit3}, {id: 'questions', label: '質問設定', icon: MessageSquare}, {id: 'results', label: '結果パターン', icon: Trophy}, {id: 'business', label: 'ビジネス連携', icon: CreditCard, lock: isBusinessLocked} ].map(tab => (
                    <button key={tab.id} onClick={() => tab.lock ? setShowBillingModal(true) : setActiveTab(tab.id)} className={`px-4 py-3 text-left font-bold flex items-center justify-between group transition-colors ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-2"><tab.icon size={18} /> {tab.label}</div>
                        {tab.lock && <Lock size={14} className="text-gray-300 group-hover:text-orange-400"/>}
                    </button>
                ))}
                <div className="mt-auto p-4 border-t">
                    {/* AIボタン: 全ユーザー解放 */}
                    <button onClick={()=>setShowAiModal(true)} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow hover:opacity-90 transition-all">
                        <Sparkles size={18} /> AIで自動生成
                    </button>
                </div>
            </div>

            <div className="flex-grow p-8 overflow-y-auto bg-gray-50">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    {activeTab === 'basic' && <div className="animate-fade-in"><h3 className="text-xl font-bold mb-6 pb-2 border-b text-gray-800">基本情報</h3><Input label="診断タイトル" val={editForm.title} onChange={e=>setEditForm({...editForm, title:e.target.value})} /><Textarea label="説明文" val={editForm.description} onChange={e=>setEditForm({...editForm, description:e.target.value})} /><Input label="カテゴリ" val={editForm.category} onChange={e=>setEditForm({...editForm, category:e.target.value})} /></div>}
                    
                    {activeTab === 'questions' && (
                        <div className="animate-fade-in space-y-8">
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b text-gray-800">質問設定 (全5問固定)</h3>
                            {editForm.questions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="font-bold text-indigo-600 mb-2">Q{qIdx+1}</div>
                                    <Input label="質問文" val={q.text} onChange={e => { const newQ = [...editForm.questions]; newQ[qIdx].text = e.target.value; setEditForm({...editForm, questions: newQ}); }} />
                                    <div className="space-y-3 mt-4">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="bg-white p-3 rounded border border-gray-200 flex flex-wrap gap-4 items-center">
                                                <div className="flex-grow min-w-[200px]"><label className="text-xs text-gray-400 font-bold mb-1 block">選択肢 {oIdx+1}</label><input type="text" value={opt.label} className="w-full font-bold border-b border-gray-300 focus:border-indigo-500 outline-none text-gray-900 pb-1" onChange={e => { const newQ = [...editForm.questions]; newQ[qIdx].options[oIdx].label = e.target.value; setEditForm({...editForm, questions: newQ}); }} /></div>
                                                <div className="flex gap-2 bg-gray-50 p-1 rounded">{['A','B','C'].map(type => (<div key={type} className="flex flex-col items-center"><span className="text-[10px] text-gray-500 font-bold">{type}</span><input type="number" className="w-10 border border-gray-300 rounded text-center font-mono text-gray-900 font-bold h-8" value={opt.score?.[type] || 0} onChange={e => { const newQ = [...editForm.questions]; if(!newQ[qIdx].options[oIdx].score) newQ[qIdx].options[oIdx].score = {}; newQ[qIdx].options[oIdx].score[type] = parseInt(e.target.value) || 0; setEditForm({...editForm, questions: newQ}); }} /></div>))}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="animate-fade-in space-y-6">
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b text-gray-800">結果パターン (A/B/C)</h3>
                            {editForm.results.map((res, rIdx) => (
                                <div key={rIdx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3"><span className="bg-gray-800 text-white font-bold px-3 py-1 rounded text-sm">Type {res.type}</span></div>
                                    <Input label="結果タイトル" val={res.title} onChange={e => { const newR = [...editForm.results]; newR[rIdx].title = e.target.value; setEditForm({...editForm, results: newR}); }} />
                                    <Textarea label="詳細説明" val={res.description} onChange={e => { const newR = [...editForm.results]; newR[rIdx].description = e.target.value; setEditForm({...editForm, results: newR}); }} />
                                    
                                    {/* ビジネス連携（結果ごとのリンク） */}
                                    <div className="mt-4 bg-blue-50 p-4 rounded border border-blue-200">
                                        <p className="text-xs font-bold text-blue-600 mb-2 flex gap-1"><CreditCard size={12}/> ビジネス連携（このタイプへの誘導）</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="誘導先URL (LP/LINE)" val={res.link_url} onChange={v=>{const n=[...editForm.results];n[rIdx].link_url=v;setEditForm({...editForm, results:n})}} placeholder="https://..." />
                                            <Input label="ボタンの文言" val={res.link_text} onChange={v=>{const n=[...editForm.results];n[rIdx].link_text=v;setEditForm({...editForm, results:n})}} placeholder="詳細はこちら" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'business' && (
                        <div className="animate-fade-in space-y-6">
                            <h3 className="text-xl font-bold mb-6 pb-2 border-b text-gray-800">ビジネス連携設定</h3>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                                <p className="text-green-800 text-sm font-bold">
                                    💡 ヒント：結果パターンごとに個別のURLを設定できるようになりました。<br/>
                                    「結果パターン」タブから各タイプごとの誘導先を設定してください。
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* AI Modal */}
        {showAiModal && (
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl relative">
                    <button onClick={()=>setShowAiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X/></button>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900"><Sparkles className="text-purple-500"/> AIオート生成</h3>
                    <div className="space-y-4">
                        <div className="bg-purple-50 text-purple-900 text-xs p-3 rounded font-bold">
                            システムに設定されたAPIキーを使用します。
                        </div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">テーマ</label><textarea className="w-full border rounded-lg p-2 font-bold text-gray-900" rows={3} placeholder="例：30代独身男性向けの婚活診断" value={aiTheme} onChange={e=>setAiTheme(e.target.value)} /></div>
                        <button onClick={handleAiGenerate} disabled={isGenerating} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isGenerating ? <Loader2 className="animate-spin mx-auto"/> : '生成する'}</button>
                    </div>
                </div>
            </div>
        )}

        {/* Billing Modal */}
        {showBillingModal && (
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white text-center">
                        <Crown size={48} className="mx-auto mb-2 text-yellow-200" />
                        <h3 className="text-2xl font-extrabold">会員限定機能</h3>
                    </div>
                    <div className="p-8 text-center">
                        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                            「ビジネス連携機能」を利用するには、無料会員登録が必要です。<br/>
                            ログインして、LINE登録や商品ページへスムーズに誘導しましょう！
                        </p>
                        <div className="flex gap-3">
                            <button onClick={()=>setShowBillingModal(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300">閉じる</button>
                            <button onClick={()=>{setShowBillingModal(false); onLoginRequest();}} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg">ログイン / 登録</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// 4. App Root
const App = () => {
  const [view, setView] = useState('portal'); 
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // URL Routing Check
  useEffect(() => {
    const handleRouting = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id && supabase) {
         setIsLoading(true);
         const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
         if (data && !error) {
             setSelectedQuiz(data);
             setView('quiz');
         }
         setIsLoading(false);
      }
    };
    handleRouting();
  }, []);

  // Auth Check
  useEffect(() => {
      if (supabase) {
          supabase.auth.getSession().then(({ data: { session } }) => {
              setUser(session?.user ?? null);
          });
          const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
              setUser(session?.user ?? null);
          });
          return () => subscription.unsubscribe();
      }
  }, []);

  // Fetch
  const fetchQuizzes = async () => {
    if (!supabase) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('quizzes').select('*').order('id', { ascending: true });
      if (error) throw error;
      setQuizzes(data || []);
    } catch(e) { console.error(e); } finally { setIsLoading(false); }
  };
  useEffect(() => { fetchQuizzes(); }, []);

  // Save
  const handleSave = async (quizData, id) => {
    if (!supabase) return null;
    try {
      const payload = {
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        questions: quizData.questions,
        results: quizData.results,
        settings: quizData.settings
      };
      
      const { data, error } = id 
        ? await supabase.from('quizzes').update(payload).eq('id', id).select()
        : await supabase.from('quizzes').insert([payload]).select();

      if (error) throw error;
      
      alert("保存しました！");
      fetchQuizzes();
      return data[0]?.id;
    } catch(e) { alert("保存エラー: " + e.message); return null; }
  };

  return (
    <div>
      <AuthModal isOpen={!!showAuth} onClose={()=>setShowAuth(false)} setUser={setUser} />
      
      {view === 'portal' && <Portal quizzes={quizzes} isLoading={isLoading} user={user} setShowAuth={setShowAuth} onLogout={()=>supabase.auth.signOut()} onPlay={(q)=>{setSelectedQuiz(q); setView('quiz');}} onCreate={()=>setView('editor')} setPage={setView} />}
      
      {view === 'price' && <PricePage onBack={()=>setView('portal')} />}
      {view === 'howto' && <HowToPage onBack={()=>setView('portal')} />}
      
      {view === 'quiz' && <QuizPlayer quiz={selectedQuiz} onBack={()=>{setView('portal'); setSelectedQuiz(null);}} />}
      
      {view === 'editor' && <Editor user={user} onBack={()=>setView('portal')} onSave={handleSave} onDelete={()=>{}} onLoginRequest={()=>setShowAuth(true)} />}
    </div>
  );
};

export default App;