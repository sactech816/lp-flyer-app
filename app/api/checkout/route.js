import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { quizId, quizTitle, userId, email } = await req.json();
    
    // 戻り先URL（開発環境と本番環境で自動切り替え）
    const origin = req.headers.get('origin');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `HTMLデータ提供: ${quizTitle}`,
              description: 'この診断クイズのHTMLデータをダウンロードします（寄付・応援）',
            },
            // ★重要：ユーザーが価格を決められる設定（寄付）
            custom_unit_amount: {
              enabled: true,
              minimum: 500, // 最低500円
              maximum: 50000,
              preset: 1000, // デフォルト1000円
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // 決済成功時、URLに session_id をつけて戻す
      success_url: `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&quiz_id=${quizId}`,
      cancel_url: `${origin}/dashboard?payment=cancel`,
      metadata: {
        userId: userId,
        quizId: quizId,
      },
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}