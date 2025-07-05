import Link from 'next/link';

export default function ConfirmedPage() {
  return (
    <div className="confirmed-page-container">
      <div className="confirmed-page-content">
        <h1>E-mail potvrzen!</h1>
        <p>
          Děkujeme za potvrzení vaší e-mailové adresy.<br />
          Nyní můžete využívat všechny funkce aplikace.
        </p>
        <h2>Co získáte s prémiovým členstvím?</h2>
        <ul className="benefits-list">
          <li>🃏 Každý den e-mail s kartami dne, vybranými speciálně pro vaše jméno, datum narození a cíl.</li>
          <li>🔮 Přístup k exkluzivním výkladům a funkcím.</li>
          <li>✨ Další nové funkce již brzy!</li>
        </ul>
        <Link href="/premium" className="button-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
          Chci prémiové členství
        </Link>
        <div style={{ marginTop: '1.5rem' }}>
          <Link href="/" className="button-secondary">
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </div>
  );
}