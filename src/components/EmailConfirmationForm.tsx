import { useState } from 'react';

export default function EmailConfirmationForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Odesílám potvrzovací e-mail...');
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendConfirmation',
        email,
      }),
    });
    if (res.ok) {
      setMessage('Potvrzovací e-mail byl odeslán!');
    } else {
      setMessage('Chyba při odesílání e-mailu.');
    }
  };

  return (
    <form onSubmit={handleSendConfirmation}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Zadejte svůj e-mail"
        required
      />
      <button type="submit">Odeslat potvrzení</button>
      <div>{message}</div>
    </form>
  );
}