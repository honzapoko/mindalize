import Link from 'next/link';

export default function ConfirmedPage() {
  return (
    <div className="tarot-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="tarot-results" style={{ maxWidth: 480, width: '100%', margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(49,46,129,0.08)', padding: 32, textAlign: 'center', color: '#111' }}>
        <h1 style={{ marginBottom: 16 }}>E-mail potvrzen!</h1>
        <p style={{ marginBottom: 24 }}>
          Děkujeme za potvrzení vaší e-mailové adresy.<br />
          Nyní můžete využívat všechny funkce aplikace.
        </p>
        <h2 style={{ marginBottom: 12 }}>Co získáte s prémiovým členstvím?</h2>
        <ul className="benefits-list" style={{ textAlign: 'left', margin: '0 auto 24px auto', maxWidth: 400 }}>
          <li>🃏 Každý den e-mail s kartami dne, vybranými speciálně pro vaše jméno, datum narození a cíl.</li>
          <li>🔮 Přístup k exkluzivním výkladům a funkcím.</li>
          <li>✨ Další nové funkce již brzy!</li>
        </ul>
<form action="/api/create-checkout-session" method="POST">
  <button
    type="submit"
    className="button-primary"
    style={{
      marginTop: 16,
      marginBottom: 16,
      padding: '0.7rem 1.5rem',
      borderRadius: 8,
      background: '#312e81',
      color: '#fff',
      fontWeight: 600,
      fontSize: '1rem',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none'
    }}
  >
    Chci prémiové členství
  </button>
</form>
        <div>
          <Link href="/" className="button-secondary" style={{ color: '#312e81', textDecoration: 'underline', fontWeight: 500 }}>
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}