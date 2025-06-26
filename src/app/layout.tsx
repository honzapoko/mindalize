import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'Tarot App',
  description: 'Esoterická aplikace pro výklad karet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', background: '#1e1b4b' }}>
  {children}
</body>
    </html>
  );
}
