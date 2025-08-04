import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { supabase } from '../../../supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    const result = await resend.emails.send({
      from: 'vyklad@vesteni.cz',
      to,
      subject,
      html,
    });
    console.log('Resend response:', result);
    return result;
  } catch (error) {
    console.error('Resend error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '';

    // Parse body
    const body = await req.json();
    const {
      name, birthdate, zodiac, lifePath, question, cards, email,
      spreadType, city, goals, occupation
    } = body;

    // 1. Upsert confirmation row and send confirmation email if needed
    const { data: confirmation } = await supabase
      .from('user_confirmations')
      .select('confirmed, confirmation_token')
      .eq('email', email)
      .maybeSingle();

    const token = confirmation?.confirmation_token || randomUUID();

    if (!confirmation || !confirmation.confirmed) {
      const { error: upsertError } = await supabase
        .from('user_confirmations')
        .upsert([{ email, confirmation_token: token, confirmed: false }], { onConflict: 'email' });

      if (upsertError) {
        console.error('Error upserting user_confirmations:', upsertError);
      }

      const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm-email?token=${token}`;
      await sendEmail({
        to: email,
        subject: 'Potvrďte svůj e-mail',
        html: `<p>Klikněte pro potvrzení: <a href="${confirmUrl}">Potvrdit e-mail</a></p>`,
      });
    }

    // 2. Check if user is premium (auto-create if not exists)
    let isPremium = false;
    const { data: existingUser } = await supabase
      .from('users')
      .select('premium')
      .eq('email', email)
      .maybeSingle();

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ email, premium: false, name, birthdate, free_trial_start: new Date().toISOString().slice(0, 10) }]);
      if (insertError) {
        console.error('Error creating user:', insertError);
      }
    } else if (existingUser.premium === true) {
      isPremium = true;
    }

    // 3. Check how many readings this email already has
    const countRes = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);

    // 4. Check how many readings this IP already has
    const ipCountRes = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip);

    // Block premium spreads for free users
    const premiumSpreads = ['celtic', 'partnersky'];
    if (premiumSpreads.includes(spreadType) && !isPremium && (countRes.count ?? 0) < 5) {
      return NextResponse.json(
        { error: 'Tento typ výkladu je dostupný pouze pro prémiové uživatele. Zakupte si přístup pro odemčení.' },
        { status: 403 }
      );
    }

    // Block if IP has reached the limit
    if ((ipCountRes.count ?? 0) >= 5) {
      return NextResponse.json(
        { error: 'Limit bezplatných výkladů z této IP adresy byl vyčerpán. Pro další výklady si prosím zakupte prémiový přístup.' },
        { status: 403 }
      );
    }

    // Block if email has reached the limit
    if ((countRes.count ?? 0) >= 5) {
      return NextResponse.json(
        { error: 'Limit bezplatných výkladů byl vyčerpán. Pro další výklady si prosím zakupte prémiový přístup.' },
        { status: 403 }
      );
    }

    // Fetch user history from Supabase
    const { data: historyRows } = await supabase
      .from('readings')
      .select('question,answer')
      .eq('email', email)
      .order('id', { ascending: false })
      .limit(5);

    // Format history for the prompt
    const history = (historyRows || [])
      .map((row, idx) => `Otázka ${idx + 1}: ${row.question}\nOdpověď: ${row.answer}`)
      .join('\n');

    // Fetch aztro horoscope
    async function getAztroHoroscope(zodiac: string): Promise<string> {
      try {
        const res = await fetch(`https://aztro.sameerkumar.website/?sign=${zodiac.toLowerCase()}&day=today`, {
          method: 'POST'
        });
        const data = await res.json();
        return (data.description as string).slice(0, 300);
      } catch {
        return '';
      }
    }
    const aztroText = await getAztroHoroscope(zodiac);

    // Build the prompt
    const prompt =
      `Jsi osobní duchovní průvodce uživatele jménem ${name}. ` +
      `Zohledni jeho datum narození (${birthdate}), znamení (${zodiac}), životní číslo (${lifePath}), ` +
      `město narození (${city}), osobní cíle (${goals}), typ výkladu (${spreadType}). ` +
      `Zvaž také předchozí otázky a odpovědi:\n${history}\n` +
      `Odpověz pouze česky, laskavě a s povzbuzením. ` +
      `Nejprve odpověz na význam karet (${cards.join(', ')}) v kontextu jeho otázky: "${question}". ` +
      `Poté udělej prázdný řádek (ENTER) k oddělení výkladu karet a pokračuj astrologickou předpovědí. ` +
      ` ${aztroText} V astrologické části popiš, jaké astrologické vlivy (např. postavení Slunce, Měsíce, planet) mohou ovlivnit jeho den a co to znamená, a přidej krátké astrologické doporučení. ` +
      `Navrhni konkrétní krok nebo afirmaci pro další růst. Celková odpověď maximálně 1000 znaků. Text pěkně strukturuj, můžeš použít odstavce, tučné písmo pro zvýraznění a podobně. ` +
      `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod. `;

    // Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      }),
    });

    const openaiData = await openaiRes.json();
    const answer = openaiData.choices?.[0]?.message?.content || 'Odpověď není dostupná.';

    // Store in Supabase
    const { error } = await supabase.from('readings').insert([
      {
        name,
        birthdate,
        zodiac,
        lifePath,
        question,
        cards: JSON.stringify(cards),
        email,
        answer,
        spread_type: spreadType,
        city,
        goals,
        occupation,
        ip,
      }
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ answer, dbError: error.message }, { status: 500 });
    }

    const isConfirmed = confirmation?.confirmed === true;

    return NextResponse.json({
      aiAnswer: answer,
      confirmationMessage: 'Potvrzovací e-mail byl odeslán! Prosím potvrďte svou adresu.',
      isConfirmed,
    });
  } catch (error) {
    console.error('Chyba v /api/chatbot:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}