"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BusinessLPEditor from '@/components/BusinessLPEditor';
import { Loader2 } from 'lucide-react';

export default function NewBusinessLPPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      // ユーザーセッションの確認
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      // 認証状態の変更を監視
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      setIsLoading(false);
    };

    init();
  }, []);

  const handleBack = () => {
    if (user) {
      router.push('/business/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleSave = (data: { slug: string; content: any[] }) => {
    // 保存後の処理（必要に応じて）
    console.log('ビジネスLP保存完了:', data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold">読み込み中...</p>
      </div>
    );
  }

  return (
    <BusinessLPEditor
      user={user}
      initialSlug={null}
      setShowAuth={(show: boolean) => {
        // ログイン画面の表示処理（必要に応じて実装）
        if (show) {
          router.push('/');
        }
      }}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
