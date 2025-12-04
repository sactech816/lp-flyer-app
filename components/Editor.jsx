import React, { useState, useEffect } from 'react';
import { 
    Edit3, MessageSquare, Trophy, Loader2, Save, Share2, 
    Sparkles, Wand2, BookOpen, Image as ImageIcon, 
    Layout, MessageCircle, ArrowLeft 
} from 'lucide-react';
import { generateSlug } from '../lib/utils';

const Input = ({label, val, onChange, ph}) => (
    <div className="mb-4">
        <label className="text-sm font-bold text-gray-900 block mb-2">{label}</label>
        <input 
            className="w-full border border-gray-300 p-3 rounded-lg text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-gray-400 transition-shadow" 
            value={val||''} 
            onChange={e=>onChange(e.target.value)} 
            placeholder={ph}
        />
    </div>
);

const Textarea = ({label, val, onChange}) => (
    <div className="mb-4">
        <label className="text-sm font-bold text-gray-900 block mb-2">{label}</label>
        <textarea 
            className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-gray-400 transition-shadow" 
            rows={3} 
            value={val} 
            onChange={e=>onChange(e.target.value)}
        />
    </div>
);

const Editor = ({ onBack, onSave, initialData, setPage, user }) => {
  useEffect(() => { document.title = "クイズ作成・編集 | 診断クイズメーカー"; }, []);
  const [activeTab, setActiveTab] = useState('基本設定');
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [aiTheme, setAiTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const TABS = [
      { id: '基本設定', icon: Edit3, label: '基本設定' },
      { id: '質問作成', icon: MessageSquare, label: '質問作成' },
      { id: '結果ページ', icon: Trophy, label: '結果ページ' }
  ];

  const defaultForm = {
      title: "新規診断", description: "診断の説明文を入力...", category: "Business", color: "bg-indigo-600", layout: "card", image_url: "",
      questions: Array(5).fill(null).map((_,i)=>({text:`質問${i+1}を入力してください`, options: Array(4).fill(null).map((_,j)=>({label:`選択肢${j+1}`, score:{A:j===0?3:0, B:j===1?3:0, C:j===2?3:0}}))})),
      results: [ {type:"A", title:"タイプA", description:"結果説明...", link_url:"", link_text:"", line_url:"", line_text:"", qr_url:"", qr_text:""}, {type:"B", title:"タイプB", description:"...", link_url:"", link_text:"", line_url:"", line_text:"", qr_url:"", qr_text:""}, {type:"C", title:"タイプC", description:"...", link_url:"", link_text:"", line_url:"", line_text:"", qr_url:"", qr_text:""} ]
  };

  const [form, setForm] = useState(initialData || defaultForm);

  const handlePublish = () => { 
      const urlId = initialData?.slug || savedId || initialData?.id;
      const url = `${window.location.origin}?id=${urlId}`;
      navigator.clipboard.writeText(url); 
      alert(`公開URLをコピーしました！\n${url}`); 
  };

  const handleRandomImage = () => {
      const curatedImages = [
          "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80"
      ];
      const selected = curatedImages[Math.floor(Math.random() * curatedImages.length)];
      setForm({...form, image_url: selected});
  };

  const handleAiGenerate = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if(!apiKey) return alert('エラー: OpenAI APIキーが設定されていません。Vercelの環境変数を確認してください。');
      if(!aiTheme) return alert('どんな診断を作りたいかテーマを入力してください');
      setIsGenerating(true);
      try {
          const prompt = `
            テーマ「${aiTheme}」の診断テストを作成してください。
            出力は以下のJSON形式のみ。
            
            {
              "title": "キャッチーなタイトル",
              "description": "興味を惹く説明文",
              "questions": [
                { "text": "質問文", "options": [{"label": "回答", "score": {"A": 3, "B": 0, "C": 0}}, ...] }
              ],
              "results": [
                {"type": "A", "title": "○○タイプ", "description": "詳細な説明（200文字以上）"}
              ]
            }
            ※質問は5問、各4択。結果は3タイプ(A,B,C)。
          `;
          
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
              body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] })
          });
          
          if (!res.ok) throw new Error('API request failed');
          const data = await res.json();
          const content = data.choices[0].message.content;
          const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
          const json = JSON.parse(jsonStr);
          setForm(prev => ({ 
              ...prev, ...json, 
              results: json.results.map(r=>({
                  ...r, 
                  link_url:"", link_text:"",
                  line_url:"", line_text:"",
                  qr_url:"", qr_text:""
              })) 
          })); 
          alert('AI生成が完了しました！');
      } catch(e) { alert('AI生成エラー: ' + e.message); } finally { setIsGenerating(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
        <div className="bg-white border-b px-6 py-4 flex justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-700"><ArrowLeft/></button>
                <h2 className="font-bold text-lg text-gray-900">
                    {initialData ? 'クイズ編集' : '新規クイズ作成'}
                </h2>
            </div>
            <div className="flex gap-2">
                {savedId && (
                    <button onClick={handlePublish} className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                        <Share2 size={18}/> 公開URL
                    </button>
                )}
                <button onClick={async ()=>{
                        setIsSaving(true); 
                        const id = await onSave(form, savedId || initialData?.id); 
                        if(id) setSavedId(id); 
                        setIsSaving(false);
                    }} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-all">
                    {isSaving ? <Loader2 className="animate-spin"/> : <Save/>} 保存
                </button>
            </div>
        </div>
        
        <div className="flex flex-grow overflow-hidden">
            <div className="w-64 bg-white border-r flex flex-col hidden md:flex shrink-0">
                <div className="p-4 bg-gradient-to-b from-purple-50 to-white border-b">
                    <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-sm">
                        <Sparkles size={16}/> 診断クイズ自動生成(AI)
                    </div>
                    <textarea 
                        className="w-full border border-purple-200 p-2 rounded-lg text-xs mb-2 focus:ring-2 focus:ring-purple-500 outline-none resize-none bg-white text-gray-900 placeholder-gray-400" 
                        rows={2} placeholder="テーマを入力 (例: 起業家タイプ診断)" 
                        value={aiTheme} onChange={e=>setAiTheme(e.target.value)} 
                    />
                    <button onClick={handleAiGenerate} disabled={isGenerating} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold text-xs transition-all shadow flex items-center justify-center gap-1">
                        {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Wand2 size={12}/>} 生成する
                    </button>
                    <p className="text-[10px] text-gray-500 mt-2 text-center">※生成には10〜30秒ほどかかります</p>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto flex-grow">
                    {TABS.map(tab=>(
                        <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`w-full px-4 py-3 text-left font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab===tab.id?'bg-indigo-50 text-indigo-700':'text-gray-600 hover:bg-gray-50'}`}>
                            <tab.icon size={16}/>
                            <span className="capitalize">{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t">
                    <button onClick={()=>setPage('howto')} className="w-full text-xs text-gray-500 hover:text-indigo-600 flex items-center justify-center gap-1">
                        <BookOpen size={14}/> 使い方・規約を見る
                    </button>
                </div>
            </div>

            <div className="flex-grow p-4 md:p-8 overflow-y-auto bg-gray-50">
                <div className="md:hidden flex flex-col gap-4 mb-4">
                     <div className="p-4 bg-white rounded-xl shadow-sm border border-purple-100">
                        <div className="flex gap-2 mb-2">
                            <input className="flex-grow border border-gray-300 p-2 rounded text-sm text-black" placeholder="AI作成テーマ..." value={aiTheme} onChange={e=>setAiTheme(e.target.value)}/>
                            <button onClick={handleAiGenerate} disabled={isGenerating} className="bg-purple-600 text-white px-4 rounded font-bold text-sm whitespace-nowrap">{isGenerating ? '...' : '生成'}</button>
                        </div>
                     </div>
                     <div className="flex gap-2 overflow-x-auto pb-2">
                        {TABS.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-4 py-2 rounded-full font-bold whitespace-nowrap ${activeTab===tab.id?'bg-indigo-600 text-white':'bg-white border text-gray-700'}`}>{tab.label}</button>))}
                    </div>
                </div>

                <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                    {activeTab === '基本設定' && (
                        <div className="animate-fade-in">
                            <h3 className="font-bold text-xl mb-6 border-b pb-2 flex items-center gap-2 text-gray-900"><Edit3 className="text-gray-400"/> 基本設定</h3>
                            <Input label="タイトル" val={form.title} onChange={v=>setForm({...form, title:v})} ph="例：あなたのリーダータイプ診断" />
                            <Textarea label="説明文" val={form.description} onChange={v=>setForm({...form, description:v})} />
                            <Input label="カテゴリ" val={form.category} onChange={v=>setForm({...form, category:v})} ph="Business, Health, Love..." />
                            
                            <div className="mt-6 mb-6">
                                <label className="text-sm font-bold text-gray-900 block mb-2">メイン画像</label>
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-grow border border-gray-300 p-3 rounded-lg text-black font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white placeholder-gray-400 transition-shadow" 
                                        value={form.image_url||''} 
                                        onChange={e=>setForm({...form, image_url:e.target.value})} 
                                        placeholder="画像URL (https://...)"
                                    />
                                    <button onClick={handleRandomImage} className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 flex items-center gap-1">
                                        <ImageIcon size={16}/> 自動入力
                                    </button>
                                </div>
                                {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover rounded-lg mt-2 border"/>}
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-900 block mb-2">テーマカラー</label>
                                    <div className="flex gap-3 flex-wrap">
                                        {['bg-indigo-600', 'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-gray-800'].map(c => (
                                            <button key={c} onClick={()=>setForm({...form, color:c})} className={`w-10 h-10 rounded-full ${c} ${form.color===c ? 'ring-4 ring-offset-2 ring-gray-300':''}`}></button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-900 block mb-2">表示レイアウト</label>
                                    <div className="flex gap-2">
                                        <button onClick={()=>setForm({...form, layout:'card'})} className={`flex-1 py-3 rounded-lg font-bold text-sm border flex items-center justify-center gap-2 ${form.layout==='card' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                                            <Layout size={16}/> カード型
                                        </button>
                                        <button onClick={()=>setForm({...form, layout:'chat'})} className={`flex-1 py-3 rounded-lg font-bold text-sm border flex items-center justify-center gap-2 ${form.layout==='chat' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                                            <MessageCircle size={16}/> チャット型
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === '質問作成' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="font-bold text-xl mb-6 border-b pb-2 flex items-center gap-2 text-gray-900"><MessageSquare className="text-gray-400"/> 質問作成 (5問)</h3>
                            {form.questions.map((q, i)=>(
                                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="font-bold text-indigo-600 mb-2">Q{i+1}</div>
                                    <Input label="質問文" val={q.text} onChange={v=>{const n=[...form.questions];n[i].text=v;setForm({...form, questions:n})}} />
                                    <div className="space-y-3 mt-4">
                                        {q.options.map((o, j)=>(
                                            <div key={j} className="flex flex-col md:flex-row md:items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                                <div className="flex items-center gap-2 w-full md:w-auto flex-grow">
                                                    <div className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">{j+1}</div>
                                                    <input className="flex-grow p-1 outline-none text-sm font-bold text-gray-900 placeholder-gray-400 min-w-0" value={o.label} onChange={e=>{const n=[...form.questions];n[i].options[j].label=e.target.value;setForm({...form, questions:n})}} placeholder={`選択肢${j+1}`} />
                                                </div>
                                                <div className="flex gap-2 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-2 justify-end">
                                                    {['A','B','C'].map(t=>(
                                                        <div key={t} className="flex flex-col items-center">
                                                            <span className="text-[9px] text-gray-500">{t}</span>
                                                            <input type="number" className="w-8 bg-gray-50 border border-gray-300 text-center text-xs rounded text-gray-900" value={o.score[t]} onChange={e=>{const n=[...form.questions];n[i].options[j].score[t]=e.target.value;setForm({...form, questions:n})}} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === '結果ページ' && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="font-bold text-xl mb-6 border-b pb-2 flex items-center gap-2 text-gray-900"><Trophy className="text-gray-400"/> 結果ページ設定</h3>
                            {form.results.map((r, i)=>(
                                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 px-3 py-1 rounded-bl-lg font-bold text-xs">Type {r.type}</div>
                                    <Input label="診断結果タイトル" val={r.title} onChange={v=>{const n=[...form.results];n[i].title=v;setForm({...form, results:n})}} />
                                    <Textarea label="結果の説明文" val={r.description} onChange={v=>{const n=[...form.results];n[i].description=v;setForm({...form, results:n})}}/>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                                        <p className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2"><ExternalLink size={16}/> 誘導ボタン設置 (任意)</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input label="リンク先URL (https://...)" val={r.link_url} onChange={v=>{const n=[...form.results];n[i].link_url=v;setForm({...form, results:n})}} ph="LPや商品ページのURL" />
                                            <Input label="ボタン文言" val={r.link_text} onChange={v=>{const n=[...form.results];n[i].link_text=v;setForm({...form, results:n})}} ph="詳細を見る" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-blue-200">
                                            <Input label="LINE登録URL (https://...)" val={r.line_url} onChange={v=>{const n=[...form.results];n[i].line_url=v;setForm({...form, results:n})}} ph="LINE公式アカウントのURL" />
                                            <Input label="ボタン文言" val={r.line_text} onChange={v=>{const n=[...form.results];n[i].line_text=v;setForm({...form, results:n})}} ph="LINEで相談する" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                                            <Input label="QRコード画像URL (https://...)" val={r.qr_url} onChange={v=>{const n=[...form.results];n[i].qr_url=v;setForm({...form, results:n})}} ph="画像URL" />
                                            <Input label="ボタン文言" val={r.qr_text} onChange={v=>{const n=[...form.results];n[i].qr_text=v;setForm({...form, results:n})}} ph="QRコードを表示" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Editor;