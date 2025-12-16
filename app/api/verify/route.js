import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
});

// Supabase Adminインスタンスを遅延初期化（ビルド時エラーを防ぐ）
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("❌ Supabase credentials are missing!");
  }
  
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ Stripe API Key is missing!');
      return NextResponse.json(
        { error: 'Payment system is not configured' },
        { status: 500 }
      );
    }

    const { sessionId, quizId, userId } = await req.json();

    // 1. Stripeに問い合わせて、本当に支払い済みか確認
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Not paid' }, { status: 400 });
    }

    // 2. Supabaseに購入履歴を記録（管理者権限で実行）
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from('purchases').insert([
      {
        user_id: userId,
        quiz_id: quizId,
        stripe_session_id: sessionId,
        amount: session.amount_total
      }
    ]);

    if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}