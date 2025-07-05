// /api/confirm-email/route.ts
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

  await supabase
    .from('user_confirmations')
    .update({ confirmed: true })
    .eq('confirmation_token', token);

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/confirmed`);
}