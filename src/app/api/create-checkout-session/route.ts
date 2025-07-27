import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();

  // Nastav cenu podle plánu
  let unit_amount = 19900; // default: týdenní
  let product_name = 'Prémiový výklad karet – týdenní';

  if (plan === 'monthly') {
    unit_amount = 59900;
    product_name = 'Prémiový výklad karet – měsíční';
  } else if (plan === 'yearly') {
    unit_amount = 299900;
    product_name = 'Prémiový výklad karet – roční';
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'czk',
          product_data: {
            name: product_name,
          },
          unit_amount, // cena v haléřích
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium-cancel`,
  });

  return NextResponse.json({ url: session.url });
}