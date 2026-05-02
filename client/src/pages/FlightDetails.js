import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/store';
import { useAuthStore } from '../store/store';
import { useBookingStore } from '../store/store';
import api from '../config/api';
import { useToast } from '../components/Toast';

export default function FlightDetails() {
  const navigate = useNavigate();
  const { selectedFlight, flightSearch } = useSearchStore();
  const { isAuthenticated } = useAuthStore();
  const { setCurrentBooking } = useBookingStore();
  const { success, error: showError } = useToast();

  if (!selectedFlight) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
        <h2 style={{ marginBottom: '1rem' }}>No flight selected</h2>
        <button className="btn btn-primary" onClick={() => navigate('/flights')}>Back to Flights</button>
      </div>
    );
  }

  const f = selectedFlight;
  const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : '--';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) : '--';

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      const bookingData = {
        bookingType: 'flight',
        flightDetails: {
          flightNumber: f.flightNumber,
          airline: f.airline,
          from: f.from,
          to: f.to,
          departureTime: f.departureTime,
          arrivalTime: f.arrivalTime,
          class: f.class,
        },
        price: {
          basePrice: f.price,
          taxes: Math.round(f.price * 0.12),
          fees: 15,
          totalPrice: Math.round(f.price * 1.12 + 15),
          currency: f.currency || 'USD',
        },
      };
      const res = await api.post('/bookings/create', bookingData);
      setCurrentBooking(res.data.booking);
      navigate('/checkout');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const taxes = Math.round(f.price * 0.12);
  const fees = 15;
  const total = f.price + taxes + fees;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/flights')}>
          ← Back to Results
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
          {/* Flight Details */}
          <div>
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2.5rem' }}>{f.logo || '✈️'}</div>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{f.airline}</h1>
                  <p style={{ color: 'var(--text-muted)' }}>{f.flightNumber} · {f.class}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '1rem', padding: '1.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>{fmtTime(f.departureTime)}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{f.from}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{fmtDate(f.departureTime)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{f.duration}</div>
                  <div style={{ color: f.stops === 0 ? 'var(--success)' : 'var(--warning)', fontSize: '0.8rem' }}>
                    {f.stops === 0 ? '✅ Nonstop' : `🔄 ${f.stops} Stop(s)`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800 }}>{fmtTime(f.arrivalTime)}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>{f.to}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{fmtDate(f.arrivalTime)}</div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {[
                  { icon: '🧳', label: f.baggage || '23kg baggage' },
                  { icon: '💺', label: 'Seat selection' },
                  { icon: f.refundable ? '✅' : '❌', label: f.refundable ? 'Refundable' : 'Non-refundable' },
                  ...(f.amenities || []).map(a => ({ icon: '✓', label: a })),
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>{item.icon}</span><span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking summary */}
          <div className="card" style={{ padding: '1.5rem', minWidth: 260, position: 'sticky', top: 84 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Price Summary</h3>
            {[
              { label: 'Base fare', value: `$${f.price}` },
              { label: 'Taxes (12%)', value: `$${taxes}` },
              { label: 'Service fee', value: `$${fees}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>${total}</span>
            </div>

            <button className="btn btn-accent" style={{ width: '100%', marginTop: '1.25rem' }} onClick={handleBook}>
              {isAuthenticated ? '🎫 Book Now' : '🔑 Login to Book'}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
              Free cancellation within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
