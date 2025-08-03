import { supabase } from '../../../supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const { data: confirmation } = await supabase
    .from('user_confirmations')
    .select('email')
    .eq('confirmation_token', token)
    .maybeSingle();

  if (!confirmation) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  // Označ uživatele jako potvrzeného
  await supabase
    .from('user_confirmations')
    .update({ confirmed: true })
    .eq('confirmation_token', token);

  // Nastav free_trial_start pouze pokud ještě není nastaveno
  await supabase
    .from('users')
    .update({ free_trial_start: new Date().toISOString().slice(0, 10) })
    .eq('email', confirmation.email)
    .is('free_trial_start', null); // nastav pouze pokud ještě není trial

  // Přesměrování na confirmed s e-mailem v query parametru
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/confirmed?email=${encodeURIComponent(confirmation.email)}`
  );
}