import { NextResponse } from 'next/server';
import { supabase } from '../../../supabaseClient';
import { Resend } from 'resend';
import cardMeanings from '@/cardMeanings';

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

export async function POST() {
  // Get latest confirmed user (replace with real user logic as needed)
  const { data: user } = await supabase
    .from('user_confirmations')
    .select('email, name, birthdate, goals')
    .eq('confirmed', true)
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!user?.email) {
    return NextResponse.json({ error: 'Žádný potvrzený e-mail nebyl nalezen.' }, { status: 400 });
  }

  // Draw 3 random cards
  const cards = drawCards(3);
  const cardInfos = cards.map(card => ({
    name: card,
    imageUrl: cardMeanings[card]?.imageUrl || '',
    description: cardMeanings[card]?.description?.split('.')[0] || '',
  }));

  // Build prompt for OpenAI
  const today = new Date().toISOString().slice(0, 10);
  const prompt =
    `Jsi tarotový průvodce. Pro uživatele jménem ${user.name || 'uživatel'}, narozeného ${user.birthdate || 'neznámé datum'}, s životním cílem "${user.goals || 'neuveden'}", byly na den ${today} vytaženy tyto karty: ${cards.join(', ')}. ` +
    `Vytvoř unikátní, laskavé a inspirativní proroctví pro tento den, které propojí význam těchto karet s jeho životní cestou. ` +
    `Odpověď napiš česky, maximálně 500 znaků.`;

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
      max_tokens: 500,
    }),
  });

  const openaiData = await openaiRes.json();
  let prophecy = openaiData.choices?.[0]?.message?.content?.trim() || 'Odpověď není dostupná.';
  if (prophecy.length > 500) prophecy = prophecy.slice(0, 497) + '...';

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
}