import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // For demo: get the latest confirmed user (replace with real logic)
  const { data: user } = await supabase
    .from('user_confirmations')
    .select('email')
    .eq('confirmed', true)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!user?.email) {
    return NextResponse.json({ error: 'Žádný potvrzený e-mail nebyl nalezen.' }, { status: 400 });
  }

  // For demo: generate a random card and prophecy (replace with real logic)
  const today = new Date().toISOString().slice(0, 10);
  const card = 'The Sun'; // Replace with your random logic
  const prophecy = `Vaše karta pro ${today} je ${card}. Dnes vás čeká radost a jasnost.`;

  // Send email
  await resend.emails.send({
    from: 'dream@mindalize.com',
    to: user.email,
    subject: `Denní proroctví pro ${today}`,
    html: `<p>${prophecy}</p>`,
  });

  return NextResponse.json({ message: 'Denní proroctví bylo odesláno na váš e-mail!' });
}