import React, { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // TODO: Add real login logic

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Přihlášení</h2>
      <form>
        <label>
          E-mail:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>
          Heslo:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <button type="submit" style={{ width: '100%' }}>Přihlásit se</button>
      </form>
      <div style={{ marginTop: 16 }}>
       Máte účet? <Link href="/login">Přihlášení</Link>
      </div>
    </div>
  );
}