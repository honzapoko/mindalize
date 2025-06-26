"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const cardMeanings: Record<string, { description: string; imageUrl: string }> = {
  'The Fool': {
    description: 'Začátek nové cesty, spontánnost, důvěra.',
    imageUrl: '/cards/the-fool.jpg',
  },
  'The Magician': {
    description: 'Schopnost manifestace, kreativita, síla vůle.',
    imageUrl: '/cards/the-magician.jpg',
  },
  'The High Priestess': {
    description: 'Intuice, tajemství, skrytá moudrost.',
    imageUrl: '/cards/the-high-priestess.jpg',
  },
  'The Empress': {
    description: 'Plodnost, péče, ženská energie.',
    imageUrl: '/cards/the-empress.jpg',
  },
  'The Emperor': {
    description: 'Stabilita, autorita, struktura.',
    imageUrl: '/cards/the-emperor.jpg',
  },
  // ... doplň další karty podle potřeby
};

function getZodiacSign(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 20)) return 'Beran';
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return 'Býk';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Blíženci';
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Rak';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Lev';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Panna';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Váhy';
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return 'Štír';
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return 'Střelec';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 20)) return 'Kozoroh';
  if ((month === 1 && day >= 21) || (month === 2 && day <= 20)) return 'Vodnář';
  if ((month === 2 && day >= 21) || (month === 3 && day <= 20)) return 'Ryby';
  return '';
}

function getLifePathNumber(dateString: string): number {
  const digits = dateString.replace(/-/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

function getArchetypeByLifePath(lifePath: number): string {
  const archetypes: Record<number, string> = {
    1: 'Tvůrce',
    2: 'Diplomat',
    3: 'Komunikátor',
    4: 'Budovatel',
    5: 'Dobrodruh',
    6: 'Pečovatel',
    7: 'Hledač pravdy',
    8: 'Vůdce',
    9: 'Moudrý učitel',
    11: 'Inspirátor',
    22: 'Mistr stavitel'
  };
  return archetypes[lifePath] || 'Neznámý archetyp';
}

export default function HomePage() {
  const [birthdate, setBirthdate] = useState('');
  const [spread, setSpread] = useState('3');  // default 3 karty
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState<string[]>([]);
  const [zodiac, setZodiac] = useState('');
  const [lifePath, setLifePath] = useState<number | null>(null);

  const allCards = Object.keys(cardMeanings);

  // Funkce na náhodný výběr karet podle zvoleného počtu (spread)
  const drawCards = (count: number): string[] => {
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Po odeslání formuláře vylosujeme karty, spočítáme znamení i životní číslo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate || !question) return alert('Vyplň prosím datum narození a otázku.');

    const count = parseInt(spread, 10);
    const drawnCards = drawCards(count);
    setCards(drawnCards);
    setZodiac(getZodiacSign(birthdate));
    setLifePath(getLifePathNumber(birthdate));
  };

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif', color: '#222' }}>
      <h1>🔮 Výklad karet</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div>
          <label>Datum narození:</label><br />
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
            style={{ padding: 8, fontSize: 16, width: '100%', marginTop: 5 }}
          />
        </div>
        <div style={{ marginTop: 15 }}>
          <label>Tvá otázka:</label><br />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Např. Co mě čeká v lásce?"
            style={{ padding: 8, fontSize: 16, width: '100%', marginTop: 5 }}
          />
        </div>
        <div style={{ marginTop: 15 }}>
          <label>Počet karet:</label><br />
          <select
            value={spread}
            onChange={(e) => setSpread(e.target.value)}
            style={{ padding: 8, fontSize: 16, width: '100%', marginTop: 5 }}
          >
            <option value="1">1 karta</option>
            <option value="3">3 karty</option>
            <option value="5">5 karet</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: 20, padding: '10px 15px', fontSize: 18, cursor: 'pointer' }}>
          Vyložit karty
        </button>
      </form>

      {cards.length > 0 && (
        <>
          <h2>Výklad pro otázku: <em>{question}</em></h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {cards.map((card) => (
              <div key={card} style={{ width: 140, textAlign: 'center' }}>
                <Image
                  src={cardMeanings[card].imageUrl}
                  alt={card}
                  style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                />
                <strong>{card}</strong>
                <p style={{ fontSize: 14 }}>{cardMeanings[card].description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {(zodiac && lifePath !== null) && (
        <section style={{ marginTop: 30 }}>
          <h3>Znamení zvěrokruhu: {zodiac}</h3>
          <h3>Životní číslo: {lifePath}</h3>
          <h3>Archetyp duše: {getArchetypeByLifePath(lifePath)}</h3>
        </section>
      )}
    </main>
  );
}
