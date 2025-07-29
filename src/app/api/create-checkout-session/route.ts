import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();

  // Use Stripe Price IDs for subscriptions
  let priceId = '';
  if (plan === 'weekly') {
    priceId = 'price_weekly_249'; // replace with your Stripe weekly price ID
  } else if (plan === 'monthly') {
    priceId = 'price_monthly_599'; // replace with your Stripe monthly price ID
  } else if (plan === 'yearly') {
    priceId = 'price_yearly_2990'; // replace with your Stripe yearly price ID
  } else {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-cancel`,
  });

  return NextResponse.json({ url: session.url });
}