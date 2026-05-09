import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBookingStore } from '../store/store';
import { PageLoading } from '../components/Loading';
import { getBookingById } from '../lib/supabaseData';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBooking } = useBookingStore();
  const [booking, setBooking] = useState(currentBooking);
  const [loading, setLoading] = useState(!currentBooking);

  useEffect(() => {
    if (!currentBooking && id) {
      getBookingById(id).then((data) => {
        setBooking({
          ...data,
          bookingId: data.booking_id,
          bookingType: data.booking_type,
          flightDetails: data.flight_details,
          hotelDetails: data.hotel_details,
        });
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [id, currentBooking]);

  if (loading) return <PageLoading />;

  if (!booking) {
    return (
      <div className="bc-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '440px', width: '90%', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, background: '#fef2f2', border: '4px solid #fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2rem' }}>
            🔍
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Booking Not Found</h2>
          <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.05rem' }}>
            We couldn't find the booking you are looking for. It may have been cancelled or the link is invalid.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(to right, var(--brand-blue), #2563eb)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bc-page">
      <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
        {/* Success animation */}
        <div className="bc-success-icon">
          ✅
        </div>

        <h1 className="bc-title">
          Booking Confirmed!
        </h1>
        <p className="bc-subtitle">
          Your journey is officially booked. A confirmation email is on its way.
        </p>

        {/* Booking ID */}
        <div className="bc-id-badge">
          <span>Booking ID</span>
          <strong>{booking.bookingId}</strong>
        </div>

        {/* Details card */}
        <div className="bc-details-card">
          <h3 className="bc-card-title">Booking Details</h3>
          <div style={{ display: 'grid', gap: '0' }}>
            {[
              { label: 'Type', value: booking.bookingType === 'flight' ? '✈️ Flight' : '🏨 Hotel' },
              booking.bookingType === 'flight' && booking.flightDetails && {
                label: 'Route', value: `${booking.flightDetails.from} → ${booking.flightDetails.to}`
              },
              booking.bookingType === 'hotel' && booking.hotelDetails && {
                label: 'Hotel', value: booking.hotelDetails.hotelName
              },
              { label: 'Status', value: <span style={{ color: '#10b981', fontWeight: '700' }}>✅ {booking.status}</span> },
              { label: 'Total Paid', value: <strong className="bc-total-paid">${booking.price?.totalPrice} {booking.price?.currency}</strong> },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} className="bc-detail-row">
                <span className="bc-detail-label">{label}</span>
                <span className="bc-detail-val">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp note */}
        <div className="bc-whatsapp-card">
          <p>
            <span style={{ fontSize: '1.2rem' }}>💬</span> <strong>WhatsApp Confirmation</strong> — A copy of your itinerary has been sent to your registered WhatsApp number.
          </p>
        </div>

        {/* Actions */}
        <div className="bc-actions">
          <Link to="/dashboard" className="checkout-btn primary-btn" style={{ textDecoration: 'none', width: 'auto', padding: '14px 28px' }}>View Dashboard</Link>
          <button onClick={() => window.print()} className="bc-ghost-btn">🖨️ Print</button>
          <Link to="/" className="bc-ghost-btn" style={{ textDecoration: 'none' }}>🏠 Home</Link>
        </div>
      </div>
    </div>
  );
}
