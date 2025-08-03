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

function daysSince(dateString: string) {
  const start = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ error: 'Email nebyl poslán v požadavku.' }, { status: 400 });
    }

    // 1. Najdi potvrzení e-mailu
    const { data: confirmation } = await supabase
      .from('user_confirmations')
      .select('email, confirmed')
      .ilike('email', email.trim())
      .maybeSingle();

    if (!confirmation?.email || !confirmation.confirmed) {
      return NextResponse.json({ error: 'Žádný potvrzený e-mail nebyl nalezen.' }, { status: 400 });
    }

    // 2. Najdi uživatele v tabulce users
    const { data: user } = await supabase
      .from('users')
      .select('email, free_trial_start, is_premium')
      .ilike('email', email.trim())
      .maybeSingle();

    const freeTrialStart = user?.free_trial_start;
    const isPremium = !!user?.is_premium;
    const days = freeTrialStart ? daysSince(freeTrialStart) : 0;

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

    const BASE_URL = "https://vesteni.cz";
    const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const today = formatDate(todayISO); // DD.MM.YYYY
    const dayOfWeek = new Date().getDay();

    // --- FREE TRIAL LOGIC ---
    if (!isPremium && days >= 3) {
      // Kontrola existence e-mailu
      if (!user || !user.email) {
        return NextResponse.json({ error: 'Uživatel nebyl nalezen nebo nemá e-mail.' }, { status: 400 });
      }
      // Send unified premium promo email on 4th day and after
      const promoHtml = `
        <h2>Vaše zkušební období skončilo</h2>
        <p>
          Děkujeme, že jste využili 3denní zkušební období s denními proroctvími.<br/>
          Pro pokračování a neomezený přístup ke všem funkcím a denním proroctvím si prosím aktivujte prémiové členství.
        </p>
        <a href="https://vesteni.cz/#premium" style="display:inline-block;margin-top:18px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
          Aktivovat Premium
        </a>
      `;

      await resend.emails.send({
        from: 'vyklad@vesteni.cz',
        to: user.email,
        subject: 'Získejte prémiové členství a pokračujte v denních proroctvích!',
        html: promoHtml,
      });
      return NextResponse.json({
        message: 'Zkušební období skončilo, byl odeslán promo e-mail.',
        trialEnded: true,
      });
    }

    // --- SEND DAILY PROPHECY (first 3 days or premium) ---
    let prompt = '';
    let cards: string[] = [];
    let cardInfos: { name: string; imageUrl: string; description: string }[] = [];

    switch (dayOfWeek) {
      case 1: // Monday - 3-card tarot
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
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, jehož životním cílem je "${goals}", byly na den ${today} vytaženy tyto tři karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `Vytvoř klasický tarotový výklad pro tento den, propoj význam všech tří karet s jeho životním cílem a napiš česky, maximálně na 1000 znaků.`+
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 2: // Tuesday - astrology
        prompt =
          `Jsi astrolog. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš astrologickou předpověď na den ${today}. ` +
          `Zohledni znamení zvěrokruhu a aktuální postavení planet. Odpověď napiš česky, inspirativně a maximálně na 1000 znaků.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 3: // Wednesday - numerology
        prompt =
          `Jsi numerolog. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš numerologickou předpověď na den ${today}. ` +
          `Vysvětli význam jeho životního čísla a jak ovlivňuje tento den. Odpověď napiš česky, inspirativně a maximálně na 1000 znaků.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 4: // Thursday - affirmation/mantra
        prompt =
          `Jsi spirituální průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš inspirativní afirmaci nebo mantru na den ${today}. ` +
          `Afirmace by měla být krátká, pozitivní, osobní a v češtině. Přidej krátké vysvětlení, proč je vhodná právě pro tento den. Maximálně 1000 znaků.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 5: // Friday - shadow work
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
          `Jsi průvodce pro práci se stínem. Pro uživatele jménem ${name}, narozeného ${birthdate}, byly na den ${today} vytaženy dvě karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `První karta představuje téma stínu, které je vhodné dnes zpracovat, druhá karta ukazuje podporu nebo zdroj síly pro tuto práci. ` +
          `Vysvětli význam obou karet v kontextu práce se stínem, inspiruj uživatele ke změně a napiš česky, maximálně na 1000 znaků.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 6: // Saturday - relationship advice
        prompt =
          `Jsi vztahový poradce. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš partnerské doporučení nebo inspiraci na den ${today}. ` +
          `Buď laskavý, inspirativní a napiš česky, maximálně na 1000 znaků.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
        break;
      case 0: // Sunday - weekly summary
        prompt =
          `Jsi spirituální průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, napiš shrnutí energie uplynulého týdne a inspiraci na týden následující. ` +
          `Odpověď napiš česky, maximálně na 1000 znaků.` + 
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
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
          `Jsi tarotový průvodce. Pro uživatele jménem ${name}, narozeného ${birthdate}, byly na den ${today} vytaženy tyto tři karty: ${cardInfos.map(c => c.name).join(', ')}. ` +
          `Vytvoř klasický tarotový výklad pro tento den, propoj význam všech tří karet a napiš česky, maximálně na 1000 znaků. ` +
          `Odpověď napiš česky, co nejblíže 1000 znakům, ale nikdy nepřekroč tento limit. Piš rozvitě, detailně a inspirativně, využij celý rozsah. Vždy konči tečkou, ne v polovině věty.` +
          `Odpověz ve formátu HTML s nadpisy, odstavci, tučným písmem, odrážkami apod.`;
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

    // Kontrola existence user i zde!
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Uživatel nebyl nalezen nebo nemá e-mail.' }, { status: 400 });
    }

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