import { NextResponse } from 'next/server';
import { supabase } from '../../../supabaseClient';
import { Resend } from 'resend';
import cardMeanings from '../../../cardMeanings';

const resend = new Resend(process.env.RESEND_API_KEY);

const tarotCards = Object.keys(cardMeanings);

function drawCards(n: number) {
  const cards = [...tarotCards];
  const drawn: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * cards.length);
    drawn.push(cards.splice(idx, 1)[0]);
  }
  return drawn;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ error: 'Email nebyl poslán v požadavku.' }, { status: 400 });
    }
    console.log('API voláno s e-mailem:', email);

    // Ověř potvrzeného uživatele
    const { data: user, error: userError } = await supabase
      .from('user_confirmations')
      .select('email, confirmed')
      .ilike('email', email.trim())
      .eq('confirmed', true)
      .maybeSingle();
    console.log('Výsledek dotazu:', user, 'Chyba:', userError);

    if (!user?.email) {
      return NextResponse.json({ error: 'Žádný potvrzený e-mail nebyl nalezen.' }, { status: 400 });
    }

    // Dotáhni údaje z readings
const { data: reading } = await supabase
  .from('readings')
  .select('name, birthdate, goals')
  .ilike('email', email.trim())
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle();

    const name = reading?.name || 'uživatel';
    const birthdate = reading?.birthdate || 'neznámé datum';
    const goals = reading?.goals || 'neuveden';

    // Draw 3 random cards
const BASE_URL = "https://mindalize.com";

    const cards = drawCards(3);
const cardInfos = cards.map(card => {
  let imageUrl = cardMeanings[card]?.imageUrl || '';
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = BASE_URL + imageUrl;
  }
  return {
    name: card,
    imageUrl,
    description: cardMeanings[card]?.description?.split('.')[0] || '',
  };
});

    // Build prompt for OpenAI
    const today = new Date().toISOString().slice(0, 10);
    const prompt =
      `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, s životním cílem "${goals}", byly na den ${today} vytaženy tyto karty: ${cards.join(', ')}. ` +
      `Vytvoř unikátní, laskavé a inspirativní proroctví pro tento den, které propojí význam těchto karet s jeho životní cestou. ` +
      `Odpověď napiš česky, maximálně 1000 znaků. Vždy konči tečkou, ne v polovině věty. `;

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
    let prophecy = openaiData.choices?.[0]?.message?.content?.trim() || 'Odpověď není dostupná.';
    if (prophecy.length > 1000) prophecy = prophecy.slice(0, 497) + '...';

    // Build HTML for email
    const cardsHtml = cardInfos.map(card =>
      `<div style="margin-bottom:12px;">
        <img src="${card.imageUrl}" alt="${card.name}" style="width:80px;height:auto;border-radius:8px;"/><br/>
        <strong>${card.name}</strong><br/>
        <span style="font-size:13px;color:#444;">${card.description}</span>
      </div>`
    ).join('');

    const html = `
      <h2>Vaše denní tarotové karty pro ${today}</h2>
      ${cardsHtml}
      <p style="margin-top:18px;font-size:16px;"><strong>Proroctví:</strong><br/>${prophecy}</p>
    `;

    // Send email
    await resend.emails.send({
      from: 'dream@mindalize.com',
      to: user.email,
      subject: `Denní tarotové proroctví pro ${today}`,
      html,
    });

    return NextResponse.json({
      message: 'Denní proroctví bylo odesláno na váš e-mail!',
      cards: cardInfos,
      prophecy,
    });
  } catch (error) {
    console.error('Chyba v send-daily-prophecy:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}