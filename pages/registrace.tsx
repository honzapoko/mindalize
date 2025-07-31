import React, { useState } from 'react';
import Link from 'next/link';
// import { supabase } from '../lib/supabaseClient'; // Uncomment if using Supabase

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace with your real registration logic
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Example with Supabase (uncomment if using)
    // const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
    // if (error) {
    //   setError(error.message);
    //   setLoading(false);
    //   return;
    // }
    // window.location.href = '/';

    // Demo only:
    setTimeout(() => {
      setLoading(false);
      if (email && password && name) {
        window.location.href = '/login';
      } else {
        setError('Vyplňte všechna pole.');
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ede9fe 0%, #c7d2fe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <form
        onSubmit={handleRegister}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 32px rgba(49,46,129,0.12)',
          padding: 40,
          minWidth: 320,
          maxWidth: 360,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <h2 style={{ color: '#7c3aed', textAlign: 'center', marginBottom: 8 }}>Registrace</h2>
        <input
          type="text"
          placeholder="Jméno"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #a78bfa',
            fontSize: 16,
          }}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #a78bfa',
            fontSize: 16,
          }}
        />
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: 12,
            borderRadius: 8,
            border: '1px solid #a78bfa',
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#f59e42',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 8,
            padding: '12px 0',
            fontSize: 18,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(245,158,66,0.10)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Registruji...' : 'Registrovat se'}
        </button>
        {error && (
          <div style={{ color: '#dc2626', textAlign: 'center', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          Máte již účet?{' '}
          <Link href="/login" style={{ color: '#7c3aed', fontWeight: 600 }}>
            Přihlášení
          </Link>
        </div>
      </form>
    </div>
  );
}