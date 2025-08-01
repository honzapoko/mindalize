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

const [userRecord, setUserRecord] = useState<any>(null);
const [trialExpired, setTrialExpired] = useState(false);
useEffect(() => {
  if (!email) return;
  // Fetch user record from Supabase
  supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
    .then(({ data }) => {
      setUserRecord(data);
      if (data && data.free_trial_start && !data.is_premium) {
        const start = new Date(data.free_trial_start);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 3) setTrialExpired(true);
      }
    });
}, [email]);

// In your render:
if (trialExpired && !userIsPremium) {
  return (
    <div style={{ padding: 40, textAlign: 'center', background: '#fff7ed', borderRadius: 16, margin: 40 }}>
      <h2 style={{ color: '#7c3aed' }}>Zkušební období skončilo</h2>
      <p>Pro pokračování je potřeba aktivovat prémiové členství.</p>
      <button
        className="tarot-button"
        onClick={() => setShowPremiumModal(true)}
        style={{ marginTop: 24 }}
      >
        Získat prémiový přístup
      </button>
    </div>
  );
}

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
  const [goals, setGoals] = useState('');
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
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
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // TODO: Replace with your real premium user logic
const [userIsPremium] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user?.email) setEmail(data.user.email);
      // TODO: setUserIsPremium based on your logic
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user?.email) setEmail(session.user.email);
      // TODO: setUserIsPremium based on your logic
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

useEffect(() => {
  setMounted(true);
  if (isLoggedIn && email) {
    supabase
      .from('readings')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .then(({ data }) => setHistory(data || []));
  } else {
    setHistory([]); // Clear history if not logged in
  }
}, [isLoggedIn, email]);

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
          goals,
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
    } catch {
      setIsLoadingChatbot(false);
      setChatbotAnswer('Chyba při získávání odpovědi od AI.');
    }
  };

  // Block non-premium users from submitting premium spreads
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

  // Accepts email from PricingBoxes (input) or from logged-in user
  const handleBuyPremium = async (plan: 'weekly' | 'monthly' | 'yearly', userEmail?: string) => {
    const usedEmail = userEmail || email;
    if (!usedEmail) {
      window.location.href = '/registrace';
      return;
    }
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: usedEmail, plan }),
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
            readOnly={isLoggedIn}
          />
        </div>
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
              <option value="1">1 karta (Rada) - ZDARMA</option>
              <option value="3">3 karty (Minulost/Budoucnost) - ZDARMA</option>
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
        <button
          className="tarot-button"
          type="submit"
          disabled={isPremiumSpread() && !userIsPremium}
        >
          Vyložit karty
        </button>
        {isPremiumSpread() && !userIsPremium && (
          <>
            <div style={{ color: "#FFFFFF", marginTop: 8 }}>
              Tento typ výkladu je dostupný pouze pro prémiové uživatele.
            </div>
            <button
              className="tarot-button"
              type="button"
              onClick={() => setShowPremiumModal(true)}
              style={{ marginTop: 16 }}
            >
              Získat prémiový přístup
            </button>
          </>
        )}
      </form>

      {/* PREMIUM MODAL */}
{showPremiumModal && (
  <div
    className="tarot-modal"
    style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      overflowY: 'auto', // allow scrolling if needed
    }}
  >
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 4px 32px rgba(49,46,129,0.15)',
        position: 'relative',
        maxHeight: '90vh', // limit height
        overflowY: 'auto', // scroll inside modal if content is too tall
      }}
    >
      <PricingBoxes onBuyPremium={handleBuyPremium} email={email} />
      <button
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'none',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          color: '#312e81',
        }}
        onClick={() => setShowPremiumModal(false)}
        aria-label="Zavřít"
      >
        ×
      </button>
    </div>
  </div>
)}

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
                  width={300}
                  height={450}
                  style={{ width: '100%', height: 'auto' }}
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

      {confirmation && (
        <div className="tarot-confirmation">
          {confirmation}
        </div>
      )}

      {mounted && isLoggedIn && (
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