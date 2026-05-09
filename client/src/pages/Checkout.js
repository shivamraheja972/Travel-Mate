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
      <div className="checkout-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#f8fafc' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '440px', width: '90%', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 80, height: 80, background: '#fef2f2', border: '4px solid #fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2rem' }}>
            🛒
          </div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 800 }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-soft)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.05rem' }}>
            It looks like you haven't started a booking yet, or your session expired.
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(to right, var(--brand-blue), #2563eb)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Go to Homepage
          </button>
        </div>
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

      const bookingDbId = savedBooking.id;

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
    <div className="checkout-page">
      <div className="checkout-hero">
        <div className="container" style={{ maxWidth: 1000, position: 'relative', zIndex: 10 }}>
          <h1 className="checkout-title">Complete your booking</h1>
          <p className="checkout-subtitle">Secure payment via Stripe or Razorpay</p>
        </div>
      </div>

      <div className="container checkout-container">
        <form onSubmit={isAuthenticated ? handlePayment : handleInlineLogin}>
          <div className="checkout-grid">
            <div className="checkout-main-col">
              {/* Booking summary */}
              <div className="checkout-card" style={{ marginBottom: '2rem' }}>
                <h3 className="checkout-card-title">Booking Summary</h3>
                <div className="checkout-booking-preview">
                  <div className="cbp-icon">{b.bookingType === 'flight' ? '✈️' : '🏨'}</div>
                  <div className="cbp-details">
                    <div className="cbp-title">
                      {b.bookingType === 'flight'
                        ? `${b.flightDetails?.from} → ${b.flightDetails?.to}`
                        : b.hotelDetails?.hotelName
                      }
                    </div>
                    <div className="cbp-subtitle">
                      {b.bookingType === 'flight'
                        ? `${b.flightDetails?.airline} · ${b.flightDetails?.flightNumber}`
                        : b.hotelDetails?.city
                      }
                    </div>
                  </div>
                  <div className="cbp-price">
                    ${b.price?.totalPrice}
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
                /* Inline Login Form for Guests */
                <div className="checkout-card checkout-guest-auth">
                  <div className="cga-header">
                    <div className="cga-icon">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3>Sign in to continue</h3>
                      <p>We need to link this booking to your account</p>
                    </div>
                  </div>

                  <div className="cga-form-wrapper">
                    <div className="checkout-input-group">
                      <div className="ci-icon"><Mail size={18} /></div>
                      <input type="email" placeholder="Email address" value={authForm.email}
                        onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>

                    <div className="checkout-input-group">
                      <div className="ci-icon"><Lock size={18} /></div>
                      <input type={showPass ? 'text' : 'password'} placeholder="Password" value={authForm.password}
                        onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="ci-toggle">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button type="submit" disabled={authLoading} className="checkout-btn primary-btn">
                      {authLoading ? 'Signing in...' : 'Sign In & Continue'}
                    </button>
                  </div>
                  
                  <div className="cga-footer">
                    Don't have an account? <Link to="/register" target="_blank">Register here</Link> and then sign in above.
                  </div>
                </div>
              ) : (
                /* Payment method */
                <div className="checkout-card" style={{ marginBottom: '2rem' }}>
                  <h3 className="checkout-card-title">Payment Method</h3>
                  <div className="payment-tabs">
                    {[
                      { id: 'stripe', label: '💳 Credit/Debit Card' },
                      { id: 'razorpay', label: '📱 UPI / NetBanking' },
                    ].map(({ id, label }) => (
                      <button key={id} type="button" onClick={() => setPaymentMethod(id)}
                        className={`payment-tab ${paymentMethod === id ? 'active' : ''}`}
                      >{label}</button>
                    ))}
                  </div>

                  {paymentMethod === 'stripe' && (
                    <div className="stripe-mock-form">
                      <div className="checkout-form-group">
                        <label>Card Number <small>Test: 4242 4242 4242 4242</small></label>
                        <input placeholder="4242 4242 4242 4242" value={cardForm.cardNumber}
                          onChange={e => setCardForm(f => ({ ...f, cardNumber: fmtCard(e.target.value) }))} required />
                      </div>
                      <div className="checkout-form-row">
                        <div className="checkout-form-group">
                          <label>Expiry</label>
                          <input placeholder="MM/YY" value={cardForm.expiry}
                            onChange={e => setCardForm(f => ({ ...f, expiry: fmtExpiry(e.target.value) }))} required />
                        </div>
                        <div className="checkout-form-group">
                          <label>CVV</label>
                          <input placeholder="123" type="password" maxLength={4} value={cardForm.cvv}
                            onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))} required />
                        </div>
                      </div>
                      <div className="checkout-form-group">
                        <label>Name on Card</label>
                        <input placeholder="e.g. John Doe" value={cardForm.name}
                          onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} required />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'razorpay' && (
                    <div className="razorpay-mock-box">
                      <div className="rmb-icon">📱</div>
                      <p>You'll be redirected to Razorpay for secure payment via UPI, Net Banking, or Cards.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact (Only if logged in) */}
              {isAuthenticated && (
                <div className="checkout-card">
                  <h3 className="checkout-card-title">Contact Details</h3>
                  <div className="checkout-form-row">
                    <div className="checkout-form-group">
                      <label>Email</label>
                      <input type="email" defaultValue={user?.email} disabled />
                    </div>
                    <div className="checkout-form-group">
                      <label>Phone</label>
                      <input type="tel" defaultValue={user?.phone || ''} placeholder="+1 234 567 8900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-sidebar-col">
              <div className="checkout-summary-box">
                <h3 className="checkout-card-title">Order Summary</h3>
                <div className="csb-row">
                  <span>Base price</span><span>${b.price?.basePrice || 0}</span>
                </div>
                <div className="csb-row">
                  <span>Taxes</span><span>${b.price?.taxes || 0}</span>
                </div>
                <div className="csb-row">
                  <span>Service fees</span><span>${b.price?.fees || 0}</span>
                </div>
                
                <div className="csb-total">
                  <span>Total</span>
                  <span className="csb-amount">${b.price?.totalPrice || 0}</span>
                </div>
                
                <button 
                  type="submit" 
                  className={`checkout-btn grand-pay-btn ${!isAuthenticated ? 'disabled-btn' : ''}`} 
                  disabled={loading || !isAuthenticated}
                >
                  {loading ? '⏳ Processing...' : !isAuthenticated ? 'Sign In Required' : `🔒 Pay $${b.price?.totalPrice || 0}`}
                </button>
                
                <div className="csb-security-badge">
                  🔒 Secured by Stripe & Razorpay
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
