"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/constants';
import { ProfileEffectiveUsePage } from '@/components/StaticPages';

export default function ProfileEffectivePageRoute() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsAdmin(session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

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
    <ProfileEffectiveUsePage
      onBack={() => router.push('/')}
      isAdmin={isAdmin}
      setPage={(page: string) => router.push(`/${page}`)}
      user={user}
      onLogout={handleLogout}
      setShowAuth={() => router.push('/?auth=true')}
    />
  );
}


