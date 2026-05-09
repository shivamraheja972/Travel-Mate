import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ background: 'white', padding: '4rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px', width: '100%', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🗺️</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--brand-blue)', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 800 }}>Destination Not Found</h2>
        <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Looks like this page took a detour. Let's get you back on track to your next adventure!
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="checkout-btn primary-btn" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            🏠 Go Home
          </Link>
          <Link to="/flights" className="bc-ghost-btn" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            ✈️ Search Flights
          </Link>
        </div>
      </div>
    </div>
  );
}
