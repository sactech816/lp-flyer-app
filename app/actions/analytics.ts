'use server';

import { supabase } from '@/lib/supabase';

export async function saveAnalytics(profileId: string, eventType: 'view' | 'click', eventData?: { url?: string }) {
  if (!supabase) return { error: 'Database not available' };

  try {
    const { error } = await supabase
      .from('analytics')
      .insert([
        {
          profile_id: profileId,
          event_type: eventType,
          event_data: eventData || {},
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Analytics save error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Analytics save error:', error);
    return { error: error.message };
  }
}

export async function getAnalytics(profileId: string) {
  if (!supabase) return { views: 0, clicks: 0 };

  try {
    const { data: views, error: viewsError } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profileId)
      .eq('event_type', 'view');

    const { data: clicks, error: clicksError } = await supabase
      .from('analytics')
      .select('*')
      .eq('profile_id', profileId)
      .eq('event_type', 'click');

    if (viewsError || clicksError) {
      console.error('Analytics fetch error:', viewsError || clicksError);
      return { views: 0, clicks: 0 };
    }

    return {
      views: views?.length || 0,
      clicks: clicks?.length || 0
    };
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return { views: 0, clicks: 0 };
  }
}

