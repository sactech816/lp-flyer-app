import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
  try {
    const { sessionId, quizId, userId } = await req.json();

    // 1. Stripeに問い合わせて、本当に支払い済みか確認
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Not paid' }, { status: 400 });
    }

    // 2. Supabaseに購入履歴を記録
    const { data, error } = await supabase.from('purchases').insert([
      {
        user_id: userId,
        quiz_id: quizId,
        stripe_session_id: sessionId,
        amount: session.amount_total
      }
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}