import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeft, Check, X, ShieldCheck } from 'lucide-react';
import { useSearchStore, useAuthStore, useBookingStore } from '../store/store';
import { createBooking } from '../lib/supabaseData';
import { useToast } from '../components/Toast';

export default function FlightDetails() {
  const navigate = useNavigate();
  const { selectedFlight } = useSearchStore();
  const { isAuthenticated, user } = useAuthStore();
  const { setCurrentBooking } = useBookingStore();
  const { error: showError } = useToast();

  if (!selectedFlight) {
    return (
      <div className="flight-details-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f8fafc' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '440px', width: '90%', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', boxShadow: 'inset 0 4px 10px rgba(59, 130, 246, 0.1)' }}>
            <Plane size={40} color="var(--brand-blue)" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>No Flight Selected</h2>
          <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.05rem' }}>
            Your flight details session may have expired or you navigated here directly. Let's find you a new journey.
          </p>
          <button 
            onClick={() => navigate('/flights')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(to right, var(--brand-blue), #2563eb)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(37, 99, 235, 0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.25)'; }}
          >
            <Plane size={20} /> Search Flights
          </button>
        </div>
      </div>
    );
  }

  const f = selectedFlight;
  const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '--';

  const handleBook = () => {
    const bookingData = {
      id: 'pending-' + Date.now(),
      bookingId: 'MOCK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
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
    
    setCurrentBooking(bookingData);
    navigate('/checkout');
  };

  const taxes = Math.round(f.price * 0.12);
  const fees = 15;
  const total = f.price + taxes + fees;

  const amenitiesList = [
    { icon: '🧳', label: f.baggage || '23kg Baggage' },
    { icon: '💺', label: 'Seat Selection' },
    { icon: f.refundable ? <Check size={16} color="var(--success)"/> : <X size={16} color="var(--error)"/>, label: f.refundable ? 'Fully Refundable' : 'Non-refundable' },
    ...(f.amenities || []).map(a => ({ icon: <Check size={16} color="var(--brand-blue)"/>, label: a })),
  ];

  return (
    <div className="flight-details-page">
      <div className="flight-details-hero">
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <button className="fd-back-btn" onClick={() => navigate('/flights')}>
            <ArrowLeft size={18} /> Back to Results
          </button>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', fontWeight: 800, marginBottom: '0.5rem' }}>Review your trip</h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Please review your flight details before proceeding to checkout.</p>
        </div>
      </div>

      <div className="fd-container">
        <div className="fd-main-col">
          <div className="fd-boarding-pass">
            <div className="fd-bp-header">
              <div className="fd-airline-info">
                {f.logo && f.logo.startsWith('http') ? (
                  <img src={f.logo} alt={f.airline} />
                ) : (
                  <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>✈️</div>
                )}
                <div>
                  <h2>{f.airline}</h2>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', fontWeight: 500 }}>Flight {f.flightNumber}</p>
                </div>
              </div>
              <div>
                <span>{f.class}</span>
              </div>
            </div>

            <div className="fd-bp-body">
              <div className="fd-route-display">
                <div className="fd-time-box">
                  <h1>{f.from}</h1>
                  <h3>{fmtTime(f.departureTime)}</h3>
                  <p>{fmtDate(f.departureTime)}</p>
                </div>

                <div className="fd-flight-path">
                  <div className="fd-flight-path-line">
                    <div className="fd-flight-path-plane"><Plane size={24} /></div>
                  </div>
                  <div className="fd-flight-duration">{f.duration}</div>
                  <div className="fd-flight-stops">{f.stops === 0 ? 'Nonstop' : `${f.stops} Stop(s)`}</div>
                </div>

                <div className="fd-time-box">
                  <h1>{f.to}</h1>
                  <h3>{fmtTime(f.arrivalTime)}</h3>
                  <p>{fmtDate(f.arrivalTime)}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem', marginTop: '2rem' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', marginBottom: '1rem' }}>Included with your ticket</h3>
                <div className="fd-amenities">
                  {amenitiesList.map((item, i) => (
                    <div key={i} className="fd-amenity-pill">
                      {item.icon} {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fd-sidebar-col">
          <div className="fd-summary-card">
            <h3>Price Summary</h3>
            <div className="fd-price-row">
              <span>Base fare (1x Adult)</span>
              <span>${f.price}</span>
            </div>
            <div className="fd-price-row">
              <span>Taxes (12%)</span>
              <span>${taxes}</span>
            </div>
            <div className="fd-price-row">
              <span>Service fee</span>
              <span>${fees}</span>
            </div>

            <div className="fd-price-total">
              <span>Total</span>
              <span className="amount">${total}</span>
            </div>

            <button className="fd-book-btn" onClick={handleBook}>
              Proceed to Checkout
            </button>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-soft)', fontSize: '0.85rem', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="var(--success)" />
              Secure transaction via Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
