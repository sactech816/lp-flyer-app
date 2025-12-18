import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = "info@kei-sho.co.jp";

// Supabase Adminインスタンスを遅延初期化（ビルド時エラーを防ぐ）
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase credentials are missing!");
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(request) {
  try {
    const { id, anonymousId, userId: clientUserId, isAdmin } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Supabaseクライアントを取得
    const supabase = getSupabaseAdmin();

    // 認証トークンを取得
    const authHeader = request.headers.get('authorization');
    let userId = null;
    let userEmail = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (!authError && user) {
        userId = user.id;
        userEmail = user.email;
      }
    }
    
    // トークンから取得できない場合はクライアントから渡されたuserIdを使用
    if (!userId && clientUserId) {
      userId = clientUserId;
    }
    
    // 管理者チェック（トークンから取得したメールアドレス、またはクライアントから渡されたisAdminフラグ）
    const isAdminUser = (userEmail && userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) || isAdmin;

    // ビジネスプロジェクトを取得して所有者を確認
    const { data: project, error: fetchError } = await supabase
      .from('business_projects')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Project fetch error:', fetchError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 所有者確認（管理者は全て削除可能、user_idがnullの場合は誰でも削除可能）
    if (!isAdminUser && project.user_id && project.user_id !== userId && !anonymousId) {
      console.log('Delete permission denied:', { projectUserId: project.user_id, userId, anonymousId, isAdminUser });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // ビジネスプロジェクトを削除
    const { error: deleteError } = await supabase
      .from('business_projects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


