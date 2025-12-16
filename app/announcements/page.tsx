"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/constants';
import AnnouncementsPage from '@/components/AnnouncementsPage';

export default function AnnouncementsPageRoute() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;

      // ユーザーセッションの確認
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsAdmin(session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

      // 認証状態の変更を監視
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
        setIsAdmin(session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      });
    };

    init();
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setUser(null);
      alert('ログアウトしました');
      router.push('/');
    } catch (e: any) {
      console.error('ログアウトエラー:', e);
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <AnnouncementsPage
      onBack={() => router.push('/')}
      isAdmin={isAdmin}
      setPage={(page: string) => router.push(`/${page}`)}
      user={user}
      onLogout={handleLogout}
      setShowAuth={() => router.push('/?auth=true')}
      serviceType="profile"
    />
  );
}

