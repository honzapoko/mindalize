import React, { useState } from 'react';

export default function PricingBoxes() {
  const [plan, setPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  return (
    <div className="tarot-container" style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginTop: 32 }}>
      {/* Free Content Box */}
      <div
        className="tarot-section"
        style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(49,46,129,0.08)',
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
          flex: '1 1 320px',
        }}
      >
        <h2 style={{ color: '#312e81', marginBottom: 16 }}>
          <span role="img" aria-label="free">✨</span> Zdarma pro všechny
        </h2>
        <ul style={{ marginBottom: 24, fontSize: 17, color: '#312e81', lineHeight: 1.7 }}>
          <li>Denní proroctví z jedné tarotové karty</li>
          <li>Výklad z 3 karet (klasický tarot)</li>
          <li>Až 5 různých typů proroctví týdně</li>
          <li>Astrologická předpověď na vybrané dny</li>
          <li>Inspirativní afirmace a mantry</li>
        </ul>
        <div style={{ marginBottom: 18, color: '#6366f1', fontWeight: 500 }}>
          <span role="img" aria-label="info">💡</span> Doporučujeme vyzkoušet partnerský výklad, roční proroctví nebo práci se stínem v prémiové verzi!
        </div>
        <a href="#premium" className="tarot-button" style={{
          background: '#6366f1',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 28px',
          textDecoration: 'none',
          fontSize: 18,
          display: 'inline-block',
        }}>
          Zjistit více o prémiu
        </a>
      </div>

      {/* Premium Content Box */}
      <div
        className="tarot-section"
        id="premium"
        style={{
          background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(202,138,4,0.12)',
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
          flex: '1 1 320px',
        }}
      >
        <h2 style={{ color: '#b45309', marginBottom: 16 }}>
          <span role="img" aria-label="premium">💎</span> Prémiové služby
        </h2>
        <ul style={{ marginBottom: 24, fontSize: 17, color: '#b45309', lineHeight: 1.7 }}>
          <li>Neomezené tarotové výklady (všechny typy)</li>
          <li>Partnerské, roční a speciální výklady</li>
          <li>Práce se stínem (shadow work)</li>
          <li>Historie všech výkladů</li>
          <li>Denní proroctví e-mailem</li>
          <li>Prioritní podpora</li>
        </ul>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              className="tarot-button"
              style={{
                background: plan === 'weekly' ? '#b45309' : '#fde68a',
                color: plan === 'weekly' ? '#fff' : '#b45309',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
              }}
              onClick={() => setPlan('weekly')}
            >
              Týdenně
            </button>
            <button
              className="tarot-button"
              style={{
                background: plan === 'monthly' ? '#b45309' : '#fde68a',
                color: plan === 'monthly' ? '#fff' : '#b45309',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
              }}
              onClick={() => setPlan('monthly')}
            >
              Měsíčně
            </button>
            <button
              className="tarot-button"
              style={{
                background: plan === 'yearly' ? '#b45309' : '#fde68a',
                color: plan === 'yearly' ? '#fff' : '#b45309',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
              }}
              onClick={() => setPlan('yearly')}
            >
              Ročně
            </button>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#b45309', marginBottom: 8 }}>
            {plan === 'weekly' && '12,9 € / týden'}
            {plan === 'monthly' && '30 € / měsíc'}
            {plan === 'yearly' && '200 € / rok'}
          </div>
        </div>
         <a
        href="#"
        className="tarot-button"
        style={{
          background: '#b45309',
          color: '#fff',
          fontWeight: 700,
          borderRadius: 8,
          padding: '14px 32px',
          textDecoration: 'none',
          fontSize: 20,
          display: 'inline-block',
          marginTop: 8,
          boxShadow: '0 2px 8px rgba(180,83,9,0.08)',
        }}
        onClick={e => {
          e.preventDefault();
          if (onBuyPremium) onBuyPremium();
        }}
      >
        Aktivovat prémiové služby
      </a>
      </div>
    </div>
  );
}