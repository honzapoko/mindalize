import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

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
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h2>Registrace</h2>
      <ul>
        <li>Neomezené prémiové výklady</li>
        <li>Historie všech výkladů</li>
        <li>Denní proroctví e-mailem</li>
        <li>Speciální partnerské a roční výklady</li>
        <li>Prioritní podpora</li>
      </ul>
      <form onSubmit={handleRegister}>
        <label>
          E-mail:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>
          Heslo:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <button type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Registruji...' : 'Registrovat se'}
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: '#b91c1c' }}>{message}</div>}
      <div style={{ marginTop: 16 }}>
        Máte účet? <Link href="/login">Přihlášení</Link>
      </div>
    </div>
  );
}