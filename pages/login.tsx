import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import '../styles/TarotReading.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="tarot-container">
      <div className="tarot-header" style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 24 }}>
        <Link href="/registrace" style={{ color: '#312e81', fontWeight: 600, textDecoration: 'none' }}>Registrace</Link>
      </div>
      <h1 className="tarot-title">
        <span role="img" aria-label="login">🔑</span> Přihlášení
      </h1>
      <form onSubmit={handleLogin}>
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
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
        {message && <div style={{ marginTop: 16, color: '#b91c1c' }}>{message}</div>}
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        Nemáte účet? <Link href="/registrace" style={{ color: '#312e81', textDecoration: 'underline' }}>Registrace</Link>
      </div>
    </div>
  );
}