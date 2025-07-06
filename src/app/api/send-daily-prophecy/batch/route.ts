import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../supabaseClient';

export async function POST(req: NextRequest) {
  // Ochrana pomocí CRON_SECRET
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Najdi všechny potvrzené uživatele
  const { data: users, error } = await supabase
    .from('user_confirmations')
    .select('email')
    .eq('confirmed', true);

  if (error) {
    return NextResponse.json({ error: 'Chyba při dotazu na uživatele.' }, { status: 500 });
  }
  if (!users || users.length === 0) {
    return NextResponse.json({ error: 'Žádní uživatelé.' }, { status: 400 });
  }

  // Pro každý e-mail zavolej /api/send-daily-prophecy
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mindalize.com';
  const results = [];
  for (const user of users) {
    try {
      const res = await fetch(`${baseUrl}/api/send-daily-prophecy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      results.push({ email: user.email, status: res.status, message: data.message || data.error });
    } catch (err) {
      results.push({ email: user.email, status: 500, message: 'Chyba při odesílání požadavku.' });
    }
  }

  return NextResponse.json({ message: 'Batch hotov.', results });
}