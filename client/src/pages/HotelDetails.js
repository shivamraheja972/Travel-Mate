import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/store';
import { useAuthStore } from '../store/store';
import { useBookingStore } from '../store/store';
import api from '../config/api';
import { useToast } from '../components/Toast';

export default function HotelDetails() {
  const navigate = useNavigate();
  const { selectedHotel } = useSearchStore();
  const { isAuthenticated } = useAuthStore();
  const { setCurrentBooking } = useBookingStore();
  const { error: showError } = useToast();

  if (!selectedHotel) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
        <h2 style={{ marginBottom: '1rem' }}>No hotel selected</h2>
        <button className="btn btn-primary" onClick={() => navigate('/hotels')}>Back to Hotels</button>
      </div>
    );
  }

  const h = selectedHotel;
  const nights = 3; // Calculate from search params in real implementation

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const res = await api.post('/bookings/create', {
        bookingType: 'hotel',
        hotelDetails: {
          hotelId: h.id, hotelName: h.name, address: h.address,
          city: h.city, roomType: h.roomTypes?.[0] || 'Standard Room',
        },
        price: {
          basePrice: h.pricePerNight * nights,
          taxes: Math.round(h.pricePerNight * nights * 0.15),
          fees: 0,
          totalPrice: Math.round(h.pricePerNight * nights * 1.15),
          currency: h.currency || 'USD',
        },
      });
      setCurrentBooking(res.data.booking);
      navigate('/checkout');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/hotels')}>
          ← Back to Hotels
        </button>

        {/* Header image */}
        {h.image && (
          <div style={{ height: 280, borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
          <div>
            {/* Info */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>{'⭐'.repeat(h.stars)}</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>{h.name}</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>📍 {h.address}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ background: 'var(--gradient)', color: 'white', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>{h.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{h.reviewCount?.toLocaleString()} reviews</span>
                  {h.breakfast && <span className="badge badge-success">🍳 Breakfast Included</span>}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{h.description}</p>
            </div>

            {/* Amenities */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {h.amenities?.map(a => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Room types */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Room Types</h3>
              {h.roomTypes?.map((room, i) => (
                <div key={room} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', marginBottom: '0.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span>🛏️ {room}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>${h.pricePerNight + i * 30}/night</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking panel */}
          <div className="card" style={{ padding: '1.5rem', minWidth: 260, position: 'sticky', top: 84 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Price Summary</h3>
            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent)' }}>${h.pricePerNight}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>per night</div>
            </div>

            {[
              { label: `${nights} nights × $${h.pricePerNight}`, value: `$${h.pricePerNight * nights}` },
              { label: 'Taxes & fees (15%)', value: `$${Math.round(h.pricePerNight * nights * 0.15)}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${Math.round(h.pricePerNight * nights * 1.15)}</span>
            </div>

            <button className="btn btn-accent" style={{ width: '100%', marginTop: '1.25rem' }} onClick={handleBook}>
              {isAuthenticated ? '🏨 Book Now' : '🔑 Login to Book'}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
              Check-in: {h.checkIn} · Check-out: {h.checkOut}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
