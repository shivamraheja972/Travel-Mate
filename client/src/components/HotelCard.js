import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/store';

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const { setSelectedHotel } = useSearchStore();

  const handleSelect = () => {
    setSelectedHotel(hotel);
    navigate(`/hotels/${hotel.id}`);
  };

  const stars = '⭐'.repeat(hotel.stars || 4);

  return (
    <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
      onClick={handleSelect}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Image */}
      <div style={{ height: 180, overflow: 'hidden', position: 'relative', background: 'var(--bg-elevated)' }}>
        {hotel.image ? (
          <img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>🏨</div>
        )}
        {hotel.breakfast && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(16,185,129,0.9)',
            color: 'white', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
          }}>🍳 Breakfast Included</div>
        )}
        {!hotel.refundable && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(239,68,68,0.85)',
            color: 'white', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
          }}>Non-refundable</div>
        )}
      </div>

      <div style={{ padding: '1.25rem' }}>
        {/* Stars */}
        <div style={{ fontSize: '0.75rem', marginBottom: '0.4rem' }}>{stars}</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.3rem' }}>{hotel.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>📍 {hotel.address}</p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{
            background: 'var(--gradient)', color: 'white',
            padding: '3px 8px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700,
          }}>{hotel.rating}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>({hotel.reviewCount?.toLocaleString()} reviews)</span>
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          {hotel.amenities?.slice(0, 4).map(a => (
            <span key={a} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 5, fontSize: '0.72rem' }}>{a}</span>
          ))}
          {hotel.amenities?.length > 4 && (
            <span style={{ color: 'var(--text-subtle)', fontSize: '0.72rem' }}>+{hotel.amenities.length - 4} more</span>
          )}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
              ${hotel.pricePerNight}
            </div>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>per night</div>
          </div>
          <button className="btn btn-primary btn-sm">View →</button>
        </div>
      </div>
    </div>
  );
}
