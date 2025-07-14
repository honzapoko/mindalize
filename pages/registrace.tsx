import React, { useState } from 'react';
import Link from 'next/link';

export default function Registrace() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // TODO: Add real registration logic

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Registrace</h2>
      <ul>
        <li>Neomezené prémiové výklady</li>
        <li>Historie všech výkladů</li>
        <li>Denní proroctví e-mailem</li>
        <li>Speciální partnerské a roční výklady</li>
        <li>Prioritní podpora</li>
      </ul>
      <form>
        <label>
          E-mail:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>
          Heslo:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <button type="submit" style={{ width: '100%' }}>Registrovat se</button>
      </form>
      <div style={{ marginTop: 16 }}>
       Máte účet? <Link href="/login">Přihlášení</Link>
      </div>
    </div>
  );
}