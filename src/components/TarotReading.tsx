import React, { useState, useEffect } from 'react';
import '../styles/TarotReading.css';
import Image from 'next/image';
import cardMeanings from '../cardMeanings';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import PricingBoxes from './PricingBoxes';

const ZODIAC_SIGNS = [
  { name: 'Beran', start: [3, 21], end: [4, 19] },
  { name: 'Býk', start: [4, 20], end: [5, 20] },
  { name: 'Blíženec', start: [5, 21], end: [6, 20] },
  { name: 'Rak', start: [6, 21], end: [7, 22] },
  { name: 'Lev', start: [7, 23], end: [8, 22] },
  { name: 'Panna', start: [8, 23], end: [9, 22] },
  { name: 'Váhy', start: [9, 23], end: [10, 22] },
  { name: 'Škorpion', start: [10, 23], end: [11, 21] },
  { name: 'Střelec', start: [11, 22], end: [12, 21] },
  { name: 'Kozoroh', start: [12, 22], end: [1, 19] },
  { name: 'Vodnář', start: [1, 20], end: [2, 18] },
  { name: 'Ryby', start: [2, 19], end: [3, 20] },
];

function getZodiacSign(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (startMonth > endMonth &&
        ((month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay)))
    ) {
      return sign.name;
    }
  }
  return '';
}

function formatDateCz(dateStr: string) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}

function formatDateTimeCz(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function getLifePathNumber(dateStr: string) {
  if (!dateStr) return '';
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split('')
      .map(Number)
      .reduce((a, b) => a + b, 0);
  }
  return sum.toString();
}

function getRandomCardKeys(count: number) {
  const keys = Object.keys(cardMeanings);
  const selected: string[] = [];
  const available = [...keys];
  for (let i = 0; i < count; i++) {
    if (available.length === 0) break;
    const idx = Math.floor(Math.random() * available.length);
    selected.push(available[idx]);
    available.splice(idx, 1);
  }
  return selected;
}

type TarotHistoryItem = {
  name: string;
  birthdate: string;
  question: string;
  zodiac: string;
  lifePath: string;
  cards: string[];
  date: string;
  prophecy?: string;
};

const TarotReading: React.FC = () => {
  const [email, setEmail] = useState('');
 // const [city, setCity] = useState('');
  const [goals, setGoals] = useState('');
  const [question, setQuestion] = useState('');
 // const [occupation, setOccupation] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
//  const [numCards, setNumCards] = useState(3);
  const userIsPremium = false; // TODO: Replace with your real premium user logic
  const [cards, setCards] = useState<string[]>([]);
  const [zodiac, setZodiac] = useState('');
  const [lifePath, setLifePath] = useState('');
  const [spreadType, setSpreadType] = useState('1');
  const [history, setHistory] = useState<TarotHistoryItem[]>([]);
  const [confirmation, setConfirmation] = useState('');
  const [chatbotAnswer, setChatbotAnswer] = useState('');
  const [isLoadingChatbot, setIsLoadingChatbot] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  // Zjisti aktuální session při načtení
  supabase.auth.getUser().then(({ data }) => {
    setIsLoggedIn(!!data.user);
    if (data.user?.email) setEmail(data.user.email); // ← přidej tento řádek
  });

  // Poslouchej změny session (login/logout)
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsLoggedIn(!!session?.user);
    if (session?.user?.email) setEmail(session.user.email); // ← přidej tento řádek
  });

  // Úklid listeneru při odchodu komponenty
  return () => {
    listener?.subscription.unsubscribe();
  };
}, []);

useEffect(() => {
  const stored = localStorage.getItem('tarotHistory');
  if (stored) {
    setHistory(JSON.parse(stored));
  }
  setMounted(true); // <-- add this line
}, []);

  useEffect(() => {
    setZodiac(getZodiacSign(birthdate));
    setLifePath(getLifePathNumber(birthdate));
  }, [birthdate]);

const handleDraw = async (e: React.FormEvent) => {
  e.preventDefault();
  setConfirmation('');
  setChatbotAnswer('');
  setIsLoadingChatbot(true);

  let numCardsToDraw = 1;
  if (spreadType === '3') numCardsToDraw = 3;
  else if (spreadType === '5') numCardsToDraw = 5;
  else if (spreadType === 'celtic') numCardsToDraw = 10;
  else if (spreadType === 'partnersky') numCardsToDraw = 7;

  const drawn = getRandomCardKeys(numCardsToDraw);
  setCards(drawn);

  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        birthdate,
        zodiac,
        lifePath,
        question,
        cards: drawn,
        spreadType,
      //  city,
        goals,
      //  occupation,
      }),
    });
    const data = await res.json();
    setIsLoadingChatbot(false);

    if (data.error) {
      setChatbotAnswer(data.error);
      return;
    }

    setChatbotAnswer(data.aiAnswer || 'Odpověď není dostupná.');
    setConfirmation(data.confirmationMessage || 'Potvrzovací e-mail byl odeslán! Prosím potvrďte svou adresu.');

    // --- MOVE THIS BLOCK HERE ---
    const newHistoryItem = {
      name,
      birthdate,
      question,
      zodiac,
      lifePath,
      cards: drawn,
      date: new Date().toISOString(),
      prophecy: data.aiAnswer || 'Odpověď není dostupná.',

    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('tarotHistory', JSON.stringify(updatedHistory));
    // --- END BLOCK ---

} catch {
  setIsLoadingChatbot(false);
  setChatbotAnswer('Chyba při získávání odpovědi od AI.');
}
};

// Add logic to block non-premium users from submitting premium spreads
const isPremiumSpread = () => {
  return (
    spreadType === "5" ||
    spreadType === "celtic" ||
    spreadType === "partnersky" ||
    spreadType === "7" ||
    spreadType === "horseshoe" ||
    spreadType === "relationship" ||
    spreadType === "career" ||
    spreadType === "year" ||
    spreadType === "chakra"
  );
};

const handleBuyPremium = async (plan: 'weekly' | 'monthly' | 'yearly') => {
  if (!email) {
    window.location.href = '/registrace'; // nebo '/login' podle preferencí
    return;
  }
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, plan }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert('Nepodařilo se získat Stripe odkaz.');
  }
};

  return (
    <div className="tarot-container">
<div className="tarot-header" style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 24 }}>
  {!isLoggedIn ? (
    <>
      <Link href="/login" style={{ color: '#312e81', fontWeight: 600, textDecoration: 'none' }}>Přihlášení</Link>
      <Link href="/registrace" style={{ color: '#312e81', fontWeight: 600, textDecoration: 'none' }}>Registrace</Link>
    </>
  ) : (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
      }}
      style={{
        color: '#312e81',
        fontWeight: 600,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 16,
        padding: 0,
      }}
    >
      Odhlásit se
    </button>
  )}
</div>
      <h1 className="tarot-title">
        <span role="img" aria-label="crystal ball">🔮</span> Výklad karet tarot
      </h1>
      <form onSubmit={handleDraw}>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="email">📧</span> E-mail
          </label>
          <input
            className="tarot-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          placeholder="Vaše e-mailová adresa"
          readOnly={isLoggedIn} // ← přidáno
          />
        </div>
           {/* <input
           className="tarot-input"
           type="text"
           value={city}
           onChange={e => setCity(e.target.value)}
           placeholder="Město narození"
          />*/}
        {/* <input ---
          className="tarot-input"
          type="text"
          value={occupation}
          onChange={e => setOccupation(e.target.value)}
          placeholder="Povolání (volitelné)"
          />*/}
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="person">👤</span> Jméno
          </label>
          <input
            className="tarot-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Vaše jméno"
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">
            <span role="img" aria-label="calendar">📅</span> Datum narození
          </label>
          <input
            className="tarot-input"
            type="date"
            value={birthdate}
            onChange={e => setBirthdate(e.target.value)}
            required
          placeholder="Datum narození"
          />
        </div>
      <div className="tarot-section">
       <label className="tarot-label">
           <span role="img" aria-label="target">🎯</span> Osobní cíle
        </label>
       <input
         className="tarot-input"
         type="text"
         value={goals}
         onChange={e => setGoals(e.target.value)}
         placeholder="Osobní cíle"
         />
      </div>

      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 24, letterSpacing: 2, margin: '16px 0' }}>
        NEBO
      </div>

      <div className="tarot-section">
        <label className="tarot-label">
          <span role="img" aria-label="cloud">☁️</span> Tvoje otázka
        </label>
        <input
          className="tarot-input"
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Tvoje otázka"
        />
      </div>
<div className="tarot-section">
  <label className="tarot-label">
    Typ výkladu:
    <select
      value={spreadType}
      onChange={e => setSpreadType(e.target.value)}
      required
      style={{
        width: "100%",
        minHeight: "48px",
        fontSize: "1.1em",
        marginTop: 8,
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    >
      <option value="1">1 karta (Rada)</option>
      <option value="3">3 karty (Minulost/Přítomnost/Budoucnost)</option>
      <option value="5">5 karet (Vývoj situace) (PREMIUM)</option>
      <option value="celtic">Keltský kříž (PREMIUM)</option>
      <option value="partnersky">Partnerský výklad (PREMIUM)</option>
      <option value="7">7 karet (Týdenní výklad) (PREMIUM)</option>
      <option value="horseshoe">Podkova (7 karet) (PREMIUM)</option>
      <option value="relationship">Vztahový výklad (6 karet) (PREMIUM)</option>
      <option value="career">Kariérní výklad (5 karet) (PREMIUM)</option>
      <option value="year">Výklad na rok (12 karet) (PREMIUM)</option>
      <option value="chakra">Čakrový výklad (7 karet) (PREMIUM)</option>
    </select>
  </label>
</div>

{/* In your form, disable the submit button for premium spreads if the user is not premium */}
<button
  className="tarot-button"
  type="submit"
  disabled={isPremiumSpread() && !userIsPremium} // userIsPremium = your logic for premium user
>
  Vyložit karty
</button>

{isPremiumSpread() && !userIsPremium && (
  <div style={{ color: "#b91c1c", marginTop: 8 }}>
    Tento typ výkladu je dostupný pouze pro prémiové uživatele.
  </div>
)}
      </form>

    {/* ADD THE PREMIUM BUTTON HERE 
    <button
      className="tarot-button tarot-premium"
      type="button"
      onClick={handleBuyPremium}
      disabled={!email}
      style={{ marginTop: 24 }}
    >
      Koupit prémiový přístup
    </button>
*/}

      {cards.length > 0 && (
        <>
          <div className="tarot-summary">
            <div><strong>Jméno:</strong> {name}</div>
            <div><strong>Datum narození:</strong> {formatDateCz(birthdate)}</div>
            <div><strong>Znamení:</strong> {zodiac}</div>
            <div><strong>Životní číslo:</strong> {lifePath}</div>
            <div><strong>Otázka:</strong> {question}</div>
          </div>
          <div className="tarot-results">
            {cards.map((cardName, idx) => (
              <div className="tarot-card" key={idx}>
                <Image
                  className="tarot-image"
                  src={cardMeanings[cardName as keyof typeof cardMeanings].imageUrl}
                  alt={cardName}
                  width={300} // set your desired width
                  height={450} // set your desired height, or the correct aspect ratio
                  style={{ width: '100%', height: 'auto' }} // maintain aspect ratio if resizing
                  loading="lazy"
                />
                <div>
                  <strong>{cardMeanings[cardName]?.name || cardName}</strong>
                </div>
                <div className="tarot-insight">{cardMeanings[cardName as keyof typeof cardMeanings].description}</div>
              </div>
            ))}
          </div>
               </>
      )}
{isLoadingChatbot && <div>Připravuji pro Tebe odpověď ...</div>}      
{chatbotAnswer && (
  <div className="tarot-chatbot-answer" style={{ marginTop: 16, background: '#312e81', color: '#fff', padding: 16, borderRadius: 8 }}>
    {chatbotAnswer}
  </div>
)}

<PricingBoxes onBuyPremium={handleBuyPremium} email={email} />

{confirmation && (
  <div className="tarot-confirmation">
    {confirmation}
  </div>
)}

{mounted && (
  <div className="tarot-history">
    <h2>Historie výkladů</h2>
    {history.length === 0 && <div>Žádné výklady zatím nejsou.</div>}
    {history.map((item, idx) => (
      <div
        key={idx}
        style={{
          background: '#fff',
          border: '1px solid #312e81',
          borderRadius: 10,
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(49,46,129,0.07)',
          padding: 16,
        }}
      >
        <div
          style={{
            cursor: 'pointer',
            color: '#312e81',
            fontWeight: 600,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
        >
          <span>
            Výklad z {formatDateTimeCz(item.date)} &nbsp;|&nbsp; <strong>Karty:</strong> {item.cards.map(card => cardMeanings[card]?.name || card).join(', ')}
          </span>
          <span style={{ fontSize: 22 }}>{expandedIdx === idx ? '▲' : '▼'}</span>
        </div>
        {expandedIdx === idx && (
          <div
            style={{
              marginTop: 14,
              background: '#312e81',
              color: '#fff',
              padding: 16,
              borderRadius: 8,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            {item.prophecy}
          </div>
        )}
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default TarotReading;