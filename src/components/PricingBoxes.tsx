import React, { useState } from 'react';

type PricingBoxesProps = {
  onBuyPremium?: (plan: 'weekly' | 'monthly' | 'yearly', email?: string) => void;
  email?: string | null;
};

export default function PricingBoxes({ onBuyPremium, email }: PricingBoxesProps) {
  const [plan, setPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [localEmail, setLocalEmail] = useState('');

  const isEmailValid = email || localEmail;

  return (
    <div
      className="tarot-container"
      style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 32,
      }}
    >
      {/* Free Content Box */}
      <div
        className="tarot-section"
        style={{
          background: 'linear-gradient(135deg, #ede9fe 0%, #c7d2fe 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(99,102,241,0.08)',
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
          flex: '1 1 320px',
          border: '2px solid #a78bfa',
        }}
      >
        <h2 style={{ color: '#7c3aed', marginBottom: 16 }}>
          <span role="img" aria-label="free">✨</span> Zdarma pro všechny
        </h2>
        <ul style={{ marginBottom: 24, fontSize: 17, color: '#5b21b6', lineHeight: 1.7 }}>
          <li>Denní proroctví z jedné tarotové karty</li>
          <li>Výklad z 3 karet (klasický tarot)</li>
          <li>Až 5 různých typů proroctví týdně</li>
          <li>Astrologická předpověď na vybrané dny</li>
          <li>Inspirativní afirmace a mantry</li>
        </ul>
        <div style={{ marginBottom: 18, color: '#6366f1', fontWeight: 500 }}>
          <span role="img" aria-label="info">💡</span> Doporučujeme vyzkoušet partnerský výklad, roční proroctví nebo práci se stínem v prémiové verzi!
        </div>
        <a
          href="#premium"
          className="tarot-button"
          style={{
            background: '#f59e42',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 8,
            padding: '12px 28px',
            textDecoration: 'none',
            fontSize: 18,
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(245,158,66,0.10)',
          }}
        >
          Zjistit více o prémiu
        </a>
      </div>

      {/* Premium Content Box */}
      <div
        className="tarot-section"
        id="premium"
        style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #a5b4fc 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(139,92,246,0.12)',
          padding: 32,
          minWidth: 320,
          maxWidth: 400,
          flex: '1 1 320px',
          border: '2px solid #7c3aed',
        }}
      >
        <h2 style={{ color: '#7c3aed', marginBottom: 16 }}>
          <span role="img" aria-label="premium">💎</span> Prémiové služby
        </h2>
        <ul style={{ marginBottom: 24, fontSize: 17, color: '#5b21b6', lineHeight: 1.7 }}>
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
                background: plan === 'weekly' ? '#7c3aed' : '#ede9fe',
                color: plan === 'weekly' ? '#fff' : '#7c3aed',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
                boxShadow: plan === 'weekly' ? '0 2px 8px rgba(124,58,237,0.10)' : undefined,
              }}
              onClick={() => setPlan('weekly')}
            >
              Týdně
            </button>
            <button
              className="tarot-button"
              style={{
                background: plan === 'monthly' ? '#7c3aed' : '#ede9fe',
                color: plan === 'monthly' ? '#fff' : '#7c3aed',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
                boxShadow: plan === 'monthly' ? '0 2px 8px rgba(124,58,237,0.10)' : undefined,
              }}
              onClick={() => setPlan('monthly')}
            >
              Měsíčně
            </button>
            <button
              className="tarot-button"
              style={{
                background: plan === 'yearly' ? '#7c3aed' : '#ede9fe',
                color: plan === 'yearly' ? '#fff' : '#7c3aed',
                border: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 18px',
                cursor: 'pointer',
                boxShadow: plan === 'yearly' ? '0 2px 8px rgba(124,58,237,0.10)' : undefined,
              }}
              onClick={() => setPlan('yearly')}
            >
              Ročně
            </button>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#7c3aed', marginBottom: 8 }}>
            {plan === 'weekly' && '249 Kč / týden'}
            {plan === 'monthly' && (
              <>
                599 Kč / měsíc
                <span style={{
                  display: 'block',
                  fontSize: 16,
                  color: '#7c3aed',
                  fontWeight: 600,
                  marginTop: 4,
                }}>
                  Ušetříte 397 Kč měsíčně oproti týdennímu tarifu
                </span>
              </>
            )}
            {plan === 'yearly' && (
              <>
                2 990 Kč / rok
                <span style={{
                  display: 'block',
                  fontSize: 16,
                  color: '#7c3aed',
                  fontWeight: 600,
                  marginTop: 4,
                }}>
                  Ušetříte 4 189 Kč ročně oproti měsíčnímu tarifu
                </span>
              </>
            )}
          </div>
        </div>

        {/* Info box and email input for non-logged-in users */}
        {!email ? (
          <>
            <div style={{
              background: '#fff7ed',
              color: '#b45309',
              borderRadius: 8,
              padding: '10px 16px',
              marginBottom: 10,
              fontWeight: 500,
              fontSize: 15,
              textAlign: 'center',
              border: '1px solid #f59e42',
            }}>
              Pro aktivaci služby vyberte období a vyplňte svoji e-mailovou adresu.
            </div>
            <input
              type="email"
              value={localEmail}
              onChange={e => setLocalEmail(e.target.value)}
              placeholder="Zadejte e-mail"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #f59e42',
                marginBottom: 12,
                fontSize: 16,
                boxSizing: 'border-box',
              }}
            />
          </>
        ) : (
          <div style={{
            background: '#fff7ed',
            color: '#b45309',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 10,
            fontWeight: 500,
            fontSize: 15,
            textAlign: 'center',
            border: '1px solid #f59e42',
          }}>
            Pro aktivaci služby vyberte období.
          </div>
        )}

        <a
          href="#"
          className="tarot-button"
          style={{
            background: '#f59e42',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 8,
            padding: '14px 32px',
            textDecoration: 'none',
            fontSize: 20,
            display: 'inline-block',
            marginTop: 8,
            boxShadow: '0 2px 8px rgba(245,158,66,0.10)',
            pointerEvents: isEmailValid ? 'auto' : 'none',
            opacity: isEmailValid ? 1 : 0.6,
          }}
          onClick={e => {
            e.preventDefault();
            if (onBuyPremium && isEmailValid) onBuyPremium(plan, email || localEmail);
          }}
        >
          Aktivovat prémiové služby
        </a>
        {!email && !localEmail && (
          <div style={{
            color: '#dc2626',
            fontWeight: 600,
            fontSize: 15,
            marginTop: 8,
            textAlign: 'center',
          }}>
            Vyplňte e-mailovou adresu
          </div>
        )}
      </div>
    </div>
  );
}