"use client";
import { planets, houses, aspects } from "../../../data/astroMeanings";

export default function AstroMeaningsPage() {
  const today = new Date().toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(49,46,129,0.08)" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Astrologické významy pro dnešní den</h1>
      <p style={{ textAlign: "center", color: "#666" }}>{today}</p>

      <h2 style={{ marginTop: 32 }}>Planety</h2>
      <ul>
        {planets.map((p) => (
          <li key={p.key}><strong>{p.name}:</strong> {p.meaning}</li>
        ))}
      </ul>

      <h2 style={{ marginTop: 32 }}>Domy</h2>
      <ul>
        {houses.map((h) => (
          <li key={h.number}><strong>{h.name}:</strong> {h.meaning}</li>
        ))}
      </ul>

      <h2 style={{ marginTop: 32 }}>Aspekty</h2>
      <ul>
        {aspects.map((a) => (
          <li key={a.name}><strong>{a.name} {a.symbol}:</strong> {a.meaning}</li>
        ))}
      </ul>
    </div>
  );
}