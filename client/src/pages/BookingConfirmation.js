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
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Booking not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
        {/* Success animation */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)',
          border: '3px solid var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem',
          animation: 'pulse 2s ease-in-out',
        }}>✅</div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
          Your booking has been confirmed. A confirmation email has been sent.
        </p>

        {/* Booking ID */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 10, padding: '0.75rem 1.5rem', marginBottom: '2rem',
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Booking ID</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>
            {booking.bookingId}
          </span>
        </div>

        {/* Details card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Booking Details</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {[
              { label: 'Type', value: booking.bookingType === 'flight' ? '✈️ Flight' : '🏨 Hotel' },
              booking.bookingType === 'flight' && booking.flightDetails && {
                label: 'Route', value: `${booking.flightDetails.from} → ${booking.flightDetails.to}`
              },
              booking.bookingType === 'hotel' && booking.hotelDetails && {
                label: 'Hotel', value: booking.hotelDetails.hotelName
              },
              { label: 'Status', value: <span className="badge badge-success">✅ {booking.status}</span> },
              { label: 'Total Paid', value: <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>${booking.price?.totalPrice} {booking.price?.currency}</strong> },
            ].filter(Boolean).map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp note */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            💬 <strong style={{ color: 'var(--text)' }}>WhatsApp Confirmation</strong> — A confirmation with your booking details has been sent to your WhatsApp number (if configured).
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary">View All Bookings</Link>
          <button onClick={() => window.print()} className="btn btn-ghost">🖨️ Print</button>
          <Link to="/" className="btn btn-ghost">🏠 Home</Link>
        </div>
      </div>
    </div>
  );
}
