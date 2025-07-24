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

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ error: 'Email nebyl poslán v požadavku.' }, { status: 400 });
    }

    // Ověř potvrzeného uživatele
    const { data: user, error: userError } = await supabase
      .from('user_confirmations')
      .select('email, confirmed')
      .ilike('email', email.trim())
      .eq('confirmed', true)
      .maybeSingle();

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

    // Calendar logic
    const BASE_URL = "https://vesteni.cz";
    const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const today = formatDate(todayISO); // DD.MM.YYYY
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...

    let prompt = '';
    let cards: string[] = [];
    let cardInfos: { name: string; imageUrl: string; description: string }[] = [];

    switch (dayOfWeek) {
      case 1: // Monday
        cards = drawCards(3);
        cardInfos = cards.map(card => {
          let imageUrl = cardMeanings[card]?.imageUrl || '';
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = BASE_URL + imageUrl;
          }
          return {
            name: cardMeanings[card]?.name || card,
            imageUrl,
            description: cardMeanings[card]?.description?.split('.')[0] || '',
          };
        });
        prompt =
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, s životním cílem "${goals}", byly na den ${today} vytaženy tyto karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `Vytvoř unikátní, laskavé a inspirativní proroctví pro tento den, které propojí význam těchto karet s jeho životní cestou. ` +
          `Odpověď napiš česky, co nejblíže 1000 znakům, ale nikdy nepřekroč tento limit. Piš rozvitě, detailně a inspirativně, využij celý rozsah. Vždy konči tečkou, ne v polovině věty.`;
        break;
      case 2: // Tuesday
        prompt =
          `Jsi astrolog. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš astrologickou předpověď na den ${today}. ` +
          `Zohledni znamení zvěrokruhu a aktuální postavení planet. Odpověď napiš česky, inspirativně a maximálně na 1000 znaků.`;
        break;
      case 3: // Wednesday
        prompt =
          `Jsi numerolog. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš numerologickou předpověď na den ${today}. ` +
          `Vysvětli význam jeho životního čísla a jak ovlivňuje tento den. Odpověď napiš česky, inspirativně a maximálně na 1000 znaků.`;
        break;
      case 4: // Thursday
        cards = drawCards(1);
        cardInfos = cards.map(card => {
          let imageUrl = cardMeanings[card]?.imageUrl || '';
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = BASE_URL + imageUrl;
          }
          return {
            name: cardMeanings[card]?.name || card,
            imageUrl,
            description: cardMeanings[card]?.description?.split('.')[0] || '',
          };
        });
        prompt =
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, s životním cílem "${goals}", byla na den ${today} vytažena tato karta: ${cardInfos[0].name}. ` +
          `Vysvětli její význam a inspiruj uživatele pro dnešní den. Odpověď napiš česky, maximálně na 1000 znaků.`;
        break;
      case 5: // Friday
        cards = drawCards(2);
        cardInfos = cards.map(card => {
          let imageUrl = cardMeanings[card]?.imageUrl || '';
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = BASE_URL + imageUrl;
          }
          return {
            name: cardMeanings[card]?.name || card,
            imageUrl,
            description: cardMeanings[card]?.description?.split('.')[0] || '',
          };
        });
        prompt =
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, byly na den ${today} vytaženy dvě karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `Jedna karta představuje výzvu, druhá podporu. Vysvětli jejich význam a inspiruj uživatele. Odpověď napiš česky, maximálně na 1000 znaků.`;
        break;
      case 6: // Saturday
        prompt =
          `Jsi vztahový poradce. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš partnerské doporučení nebo inspiraci na den ${today}. ` +
          `Buď laskavý, inspirativní a napiš česky, maximálně na 1000 znaků.`;
        break;
      case 0: // Sunday
        prompt =
          `Jsi spirituální průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš shrnutí energie uplynulého týdne a inspiraci na týden následující. ` +
          `Odpověď napiš česky, maximálně na 1000 znaků.`;
        break;
      default:
        // fallback: 3-card tarot
        cards = drawCards(3);
        cardInfos = cards.map(card => {
          let imageUrl = cardMeanings[card]?.imageUrl || '';
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = BASE_URL + imageUrl;
          }
          return {
            name: cardMeanings[card]?.name || card,
            imageUrl,
            description: cardMeanings[card]?.description?.split('.')[0] || '',
          };
        });
        prompt =
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, s životním cílem "${goals}", byly na den ${today} vytaženy tyto karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `Vytvoř unikátní, laskavé a inspirativní proroctví pro tento den, které propojí význam těchto karet s jeho životní cestou. ` +
          `Odpověď napiš česky, co nejblíže 1000 znakům, ale nikdy nepřekroč tento limit. Piš rozvitě, detailně a inspirativně, využij celý rozsah. Vždy konči tečkou, ne v polovině věty.`;
    }

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
        max_tokens: 1500,
      }),
    });

    const openaiData = await openaiRes.json();
    let prophecy = openaiData.choices?.[0]?.message?.content?.trim() || 'Odpověď není dostupná.';
    if (prophecy.length > 1500) prophecy = prophecy.slice(0, 1497) + '...';

    // Build HTML for email (show cards if any)
    let cardsHtml = '';
    if (cardInfos.length > 0) {
      cardsHtml = cardInfos.map(card =>
        `<div style="margin-bottom:12px;">
          <img src="${card.imageUrl}" alt="${card.name}" style="width:80px;height:auto;border-radius:8px;"/><br/>
          <strong>${card.name}</strong><br/>
          <span style="font-size:13px;color:#444;">${card.description}</span>
        </div>`
      ).join('');
    }

    const html = `
      <h2>Vaše denní proroctví pro ${today}</h2>
      ${cardsHtml}
      <p style="margin-top:18px;font-size:16px;"><strong>Proroctví:</strong><br/>${prophecy}</p>
    `;

    // Send email
    await resend.emails.send({
      from: 'vyklad@vesteni.cz',
      to: user.email,
      subject: `Denní proroctví pro ${today}`,
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