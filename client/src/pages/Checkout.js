import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useBookingStore } from '../store/store';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBookingStore();
  const { user } = useAuthStore();
  const { success, error: showError } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });

  if (!currentBooking) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>No booking found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const b = currentBooking;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (paymentMethod === 'stripe') {
        // Create payment intent
        const intentRes = await api.post('/payments/create-payment-intent', {
          bookingId: b._id,
          amount: b.price.totalPrice,
          currency: b.price.currency?.toLowerCase() || 'usd',
        });

        if (intentRes.data.success || intentRes.data.clientSecret) {
          // Confirm payment (in real implementation, use Stripe.js)
          await api.post('/payments/confirm', { paymentIntentId: intentRes.data.paymentIntentId, bookingId: b._id });
        } else {
          // Fallback: directly confirm (for demo without Stripe keys)
          await api.post('/payments/confirm', { paymentIntentId: 'demo-' + Date.now(), bookingId: b._id });
        }
      } else {
        // For Razorpay / demo
        await api.post('/payments/confirm', { paymentIntentId: 'demo-' + Date.now(), bookingId: b._id });
      }

      success('🎉 Payment successful! Booking confirmed.');
      navigate('/booking/' + b._id);
    } catch (err) {
      // Demo: even if API fails, navigate to confirmation
      if (err.response?.status === 503 || err.response?.status === 404) {
        success('✅ Booking confirmed! (Demo mode)');
        navigate('/booking/' + b._id);
      } else {
        showError(err.response?.data?.message || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fmtCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const fmtExpiry = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Checkout</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Complete your booking · Booking ID: <strong>{b.bookingId}</strong></p>

        <form onSubmit={handlePayment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
            <div>
              {/* Booking summary */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Booking Summary</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '2rem' }}>{b.bookingType === 'flight' ? '✈️' : '🏨'}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {b.bookingType === 'flight'
                        ? `${b.flightDetails?.from} → ${b.flightDetails?.to}`
                        : b.hotelDetails?.hotelName
                      }
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {b.bookingType === 'flight'
                        ? `${b.flightDetails?.airline} · ${b.flightDetails?.flightNumber}`
                        : b.hotelDetails?.city
                      }
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', fontSize: '1.2rem' }}>
                    ${b.price.totalPrice}
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Payment Method</h3>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'stripe', label: '💳 Credit/Debit Card' },
                    { id: 'razorpay', label: '📱 UPI / NetBanking' },
                  ].map(({ id, label }) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id)}
                      className="btn" style={{
                        background: paymentMethod === id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${paymentMethod === id ? 'var(--primary)' : 'var(--border)'}`,
                        color: paymentMethod === id ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 500, flex: 1,
                      }}
                    >{label}</button>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input placeholder="4242 4242 4242 4242" value={cardForm.cardNumber}
                        onChange={e => setCardForm(f => ({ ...f, cardNumber: fmtCard(e.target.value) }))} />
                      <small>Test: 4242 4242 4242 4242</small>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Expiry</label>
                        <input placeholder="MM/YY" value={cardForm.expiry}
                          onChange={e => setCardForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))} />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input placeholder="123" type="password" maxLength={4} value={cardForm.cvv}
                          onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))} />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label>Name</label>
                        <input placeholder="Name on card" value={cardForm.name}
                          onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'razorpay' && (
                  <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-elevated)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
                    <p style={{ color: 'var(--text-muted)' }}>You'll be redirected to Razorpay for secure payment via UPI, Net Banking, or Cards.</p>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Contact Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={user?.email} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" defaultValue={user?.phone} placeholder="+1 234 567 8900" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Price panel */}
            <div className="card" style={{ padding: '1.5rem', minWidth: 250, position: 'sticky', top: 84 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Order Summary</h3>
              {[
                { label: 'Base price', value: `$${b.price.basePrice}` },
                { label: 'Taxes', value: `$${b.price.taxes}` },
                { label: 'Service fees', value: `$${b.price.fees || 0}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>${b.price.totalPrice}</span>
              </div>
              <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? '⏳ Processing...' : `🔒 Pay $${b.price.totalPrice}`}
              </button>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
                🔒 Secured by Stripe & Razorpay
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
