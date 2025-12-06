'use server';

import { supabase } from '@/lib/supabase';

export async function saveLead(profileId: string, email: string) {
  if (!supabase) return { error: 'Database not available' };

  try {
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          profile_id: profileId,
          email: email,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Lead save error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Lead save error:', error);
    return { error: error.message };
  }
}

