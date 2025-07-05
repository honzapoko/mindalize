import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'czk',
          product_data: {
            name: 'Prémiový výklad karet',
          },
          unit_amount: 19900, // 199 Kč in haléře
        },
        quantity: 1,
      },
    ],
success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-cancel`,
  });

  return NextResponse.json({ url: session.url });
}