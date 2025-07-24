import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import '../styles/TarotReading.css';

export default function Registrace() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Zkontrolujte svůj e-mail a potvrďte registraci.');
    }
    setLoading(false);
  };

  return (
    <div className="tarot-container">
      <div className="tarot-header" style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 24 }}>
        <Link href="/login" style={{ color: '#312e81', fontWeight: 600, textDecoration: 'none' }}>Přihlášení</Link>
      </div>
      <h1 className="tarot-title">
        <span role="img" aria-label="register">📝</span> Registrace
      </h1>
      <ul style={{ marginBottom: 24 }}>
        <li>Neomezené prémiové výklady</li>
        <li>Historie všech výkladů</li>
        <li>Denní proroctví e-mailem</li>
        <li>Speciální partnerské a roční výklady</li>
        <li>Prioritní podpora</li>
      </ul>
      <form onSubmit={handleRegister}>
        <div className="tarot-section">
          <label className="tarot-label">E-mail</label>
          <input
            className="tarot-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Váš e-mail"
          />
        </div>
        <div className="tarot-section">
          <label className="tarot-label">Heslo</label>
          <input
            className="tarot-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Vaše heslo"
          />
        </div>
        <button className="tarot-button" type="submit" disabled={loading} style={{ width: '100%', marginTop: 16 }}>
          {loading ? 'Registruji...' : 'Registrovat se'}
        </button>
        {message && <div style={{ marginTop: 16, color: '#b91c1c' }}>{message}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        Máte účet? <Link href="/login" style={{ color: '#312e81', textDecoration: 'underline' }}>Přihlášení</Link>
      </div>
    </div>
  );
}