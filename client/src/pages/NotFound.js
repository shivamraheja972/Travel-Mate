import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      background: 'var(--bg)', minHeight: '80vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🗺️</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>Destination Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400 }}>
        Looks like this page took a detour. Let's get you back on track!
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">🏠 Go Home</Link>
        <Link to="/flights" className="btn btn-ghost">✈️ Search Flights</Link>
      </div>
    </div>
  );
}
