'use server';

import { supabase } from '@/lib/supabase';

export async function getAllUsers() {
  if (!supabase) return { error: 'Database not available' };

  try {
    // auth.usersテーブルから全ユーザー情報を取得
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Users fetch error:', usersError);
      return { error: usersError.message };
    }

    // プロフィール数を集計
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, id');
    
    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
    }

    // ユーザーごとのプロフィール数をカウント
    const profileCounts: Record<string, number> = {};
    if (profiles) {
      profiles.forEach(profile => {
        profileCounts[profile.user_id] = (profileCounts[profile.user_id] || 0) + 1;
      });
    }

    // 購入履歴を集計
    const { data: purchases, error: purchasesError } = await supabase
      .from('profile_purchases')
      .select('user_id, id');
    
    if (purchasesError) {
      console.error('Purchases fetch error:', purchasesError);
    }

    // ユーザーごとの購入数をカウント
    const purchaseCounts: Record<string, number> = {};
    if (purchases) {
      purchases.forEach(purchase => {
        purchaseCounts[purchase.user_id] = (purchaseCounts[purchase.user_id] || 0) + 1;
      });
    }

    // データを整形
    const usersData = users.map(user => ({
      id: user.id,
      email: user.email || '',
      created_at: user.created_at || '',
      last_sign_in_at: user.last_sign_in_at || '',
      profile_count: profileCounts[user.id] || 0,
      purchase_count: purchaseCounts[user.id] || 0,
      confirmed_at: user.confirmed_at || '',
    }));

    return { success: true, users: usersData };
  } catch (error: any) {
    console.error('Get all users error:', error);
    return { error: error.message };
  }
}



