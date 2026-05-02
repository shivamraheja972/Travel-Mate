import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/store';

export default function FlightCard({ flight }) {
  const navigate = useNavigate();
  const { setSelectedFlight } = useSearchStore();

  const handleSelect = () => {
    setSelectedFlight(flight);
    navigate(`/flights/${flight.id}`);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="card" style={{ padding: '1.5rem', transition: 'all 0.2s', cursor: 'pointer' }}
      onClick={handleSelect}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Airline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 160 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem',
          }}>
            {flight.logo || '✈️'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{flight.airline}</div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>{flight.flightNumber}</div>
          </div>
        </div>

        {/* Route */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>{formatTime(flight.departureTime)}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>{flight.from}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>{flight.duration}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100px' }}>
              <div style={{ height: 2, flex: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>✈</span>
              <div style={{ height: 2, flex: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ fontSize: '0.78rem' }}>
              {flight.stops === 0
                ? <span style={{ color: 'var(--success)' }}>Nonstop</span>
                : <span style={{ color: 'var(--warning)' }}>{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
              }
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>{formatTime(flight.arrivalTime)}</div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>{flight.to}</div>
          </div>
        </div>

        {/* Price & CTA */}
        <div style={{ textAlign: 'right' }}>
          {flight.refundable && (
            <div className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Refundable</div>
          )}
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--accent)' }}>
            ${flight.price}
          </div>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>per person</div>
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleSelect(); }}>
            Select →
          </button>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <span style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem' }}>
          {flight.class}
        </span>
        <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem' }}>
          🧳 {flight.baggage}
        </span>
        {flight.amenities?.slice(0, 2).map(a => (
          <span key={a} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.75rem' }}>
            {a === 'WiFi' ? '📶' : a === 'Meals' ? '🍽️' : '🎬'} {a}
          </span>
        ))}
      </div>
    </div>
  );
}
