import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

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
      router.push('/'); // přesměruj na hlavní stránku
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Přihlášení</h2>
      <form onSubmit={handleLogin}>
        <label>
          E-mail:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>
          Heslo:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <button type="submit" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>
      {message && <div style={{ marginTop: 16, color: '#b91c1c' }}>{message}</div>}
      <div style={{ marginTop: 16 }}>
        Nemáte účet? <Link href="/registrace">Registrace</Link>
      </div>
    </div>
  );
}