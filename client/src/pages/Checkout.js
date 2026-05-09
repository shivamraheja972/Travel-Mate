import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookingStore } from '../store/store';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';
import { confirmBookingPayment, createBooking, loginUser } from '../lib/supabaseData';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useBookingStore();
  const { isAuthenticated, user, login } = useAuthStore();
  const { success, error: showError } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });
  
  // Auth state for guests
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  if (!currentBooking) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg)', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>No booking found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const b = currentBooking;

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const userObj = await loginUser({
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password,
      });
      login(userObj);
      success(`Welcome back, ${userObj.firstName || 'Traveler'}! You can now complete your payment.`);
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      showError('Please sign in to complete your booking.');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Create the booking in the database now that we have an authenticated user
      const savedBooking = await createBooking({
        userId: user.id,
        bookingType: b.bookingType,
        flightDetails: b.flightDetails,
        hotelDetails: b.hotelDetails,
        price: b.price,
      });

      const bookingDbId = savedBooking.booking_id || savedBooking.id;

      // 2. Confirm the payment
      await confirmBookingPayment({
        bookingId: bookingDbId,
        paymentMethod,
        paymentIntentId: `demo-${Date.now()}`,
      });

      // Update the local store with the finalized booking ID
      setCurrentBooking({
        ...b,
        id: bookingDbId,
        bookingId: bookingDbId,
        status: 'confirmed'
      });

      success('🎉 Payment successful! Booking confirmed.');
      navigate('/booking/' + bookingDbId);
    } catch (err) {
      showError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fmtCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const fmtExpiry = (val) => val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Checkout</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Complete your booking</p>

        <form onSubmit={isAuthenticated ? handlePayment : handleInlineLogin}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
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
                    ${b.price?.totalPrice}
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
                /* Inline Login Form for Guests */
                <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--brand-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, fontSize: '1.25rem' }}>Sign in to continue</h3>
                      <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: '0.9rem' }}>We need to link this booking to your account</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Mail size={18} /></div>
                      <input type="email" placeholder="Email address" value={authForm.email}
                        onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} required
                        style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Lock size={18} /></div>
                      <input type={showPass ? 'text' : 'password'} placeholder="Password" value={authForm.password}
                        onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} required
                        style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button type="submit" disabled={authLoading} className="btn btn-primary" style={{ padding: '12px', fontSize: '1rem' }}>
                      {authLoading ? 'Signing in...' : 'Sign In & Continue'}
                    </button>
                  </div>
                  
                  <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                    Don't have an account? <Link to="/register" target="_blank" style={{ color: 'var(--brand-blue)', fontWeight: 600 }}>Register here</Link> and then sign in above.
                  </div>
                </div>
              ) : (
                /* Payment method (Only visible if logged in) */
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
                          onChange={e => setCardForm(f => ({ ...f, cardNumber: fmtCard(e.target.value) }))} required />
                        <small>Test: 4242 4242 4242 4242</small>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Expiry</label>
                          <input placeholder="MM/YY" value={cardForm.expiry}
                            onChange={e => setCardForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))} required />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input placeholder="123" type="password" maxLength={4} value={cardForm.cvv}
                            onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 1' }}>
                          <label>Name</label>
                          <input placeholder="Name on card" value={cardForm.name}
                            onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} required />
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
              )}

              {/* Contact (Only if logged in) */}
              {isAuthenticated && (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Contact Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue={user?.email} disabled />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" defaultValue={user?.phone || ''} placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price panel */}
            <div className="card" style={{ padding: '1.5rem', minWidth: 250, position: 'sticky', top: 84 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem' }}>Order Summary</h3>
              {[
                { label: 'Base price', value: `$${b.price?.basePrice || 0}` },
                { label: 'Taxes', value: `$${b.price?.taxes || 0}` },
                { label: 'Service fees', value: `$${b.price?.fees || 0}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>${b.price?.totalPrice || 0}</span>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-accent btn-lg" 
                style={{ width: '100%', opacity: !isAuthenticated ? 0.5 : 1 }} 
                disabled={loading || !isAuthenticated}
                title={!isAuthenticated ? "Sign in to pay" : ""}
              >
                {loading ? '⏳ Processing...' : !isAuthenticated ? 'Sign In Required' : `🔒 Pay $${b.price?.totalPrice || 0}`}
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
