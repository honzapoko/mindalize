"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 via-white to-pink-100 flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-6 flex items-center justify-between bg-white/80 shadow-md">
        <div className="text-2xl font-bold text-indigo-700 tracking-wide">Mindalize</div>
        <nav className="flex gap-4">
          <Link href="/dreams" className="text-indigo-600 font-medium">Dream Dictionary</Link>
          <Link href="/tarot" className="text-indigo-600 font-medium">Tarot</Link>
          <Link href="/astrology" className="text-indigo-600 font-medium">Astrology</Link>
          <Link href="/pricing" className="text-pink-600 font-semibold">Pricing</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 mb-4 leading-tight">
          Discover Yourself with <span className="text-pink-600">Dreams</span>, <span className="text-indigo-600">Tarot</span> & <span className="text-yellow-600">Astrology</span>
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
          Get daily personalized insights, dream interpretations, tarot readings, and astrological guidance. Start your journey to self-discovery and transformation today!
        </p>
        <Link
          href="/signup"
          className="inline-block bg-pink-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-pink-700 transition"
        >
          Start Free Trial
        </Link>
        <p className="text-xs text-gray-500 mt-2">No credit card required</p>
      </section>

      {/* Services Section */}
      <section className="bg-white/80 py-8 px-4">
        <h2 className="text-xl font-bold text-indigo-700 mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-indigo-50 rounded-xl p-5 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">💤</span>
            <h3 className="font-semibold text-indigo-700 mb-1">Dream Interpretation</h3>
            <p className="text-gray-600 text-sm text-center">Explore the meaning of your dreams with our extensive dream dictionary and personal insights.</p>
            <Link href="/dreams" className="mt-3 text-indigo-600 font-medium underline">Try Now</Link>
          </div>
          <div className="bg-pink-50 rounded-xl p-5 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">🔮</span>
            <h3 className="font-semibold text-pink-700 mb-1">Tarot Readings</h3>
            <p className="text-gray-600 text-sm text-center">Receive daily or in-depth tarot readings tailored to your life and questions.</p>
            <Link href="/tarot" className="mt-3 text-pink-600 font-medium underline">Draw a Card</Link>
          </div>
          <div className="bg-yellow-50 rounded-xl p-5 shadow flex flex-col items-center">
            <span className="text-3xl mb-2">🌙</span>
            <h3 className="font-semibold text-yellow-700 mb-1">Astrology Insights</h3>
            <p className="text-gray-600 text-sm text-center">Get your birth chart, daily horoscopes, and personalized astrological guidance.</p>
            <Link href="/astrology" className="mt-3 text-yellow-600 font-medium underline">See Your Chart</Link>
          </div>
        </div>
      </section>

      {/* Conversion Section */}
      <section className="py-10 px-4 text-center">
        <h2 className="text-2xl font-bold text-indigo-800 mb-3">Ready to transform your life?</h2>
        <p className="text-gray-700 mb-5 max-w-md mx-auto">
          Join thousands discovering deeper meaning every day. Unlock premium features with our affordable plans.
        </p>
        <Link
          href="/pricing"
          className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          View Pricing
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-6">
        &copy; {new Date().getFullYear()} Mindalize. All rights reserved.
      </footer>
    </main>
  );
}