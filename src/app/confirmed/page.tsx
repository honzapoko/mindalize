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
        <Link href="/" className="button-primary">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
}