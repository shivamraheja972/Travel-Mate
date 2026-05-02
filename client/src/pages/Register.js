import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      success(`Welcome to TravelMate, ${res.data.user.firstName}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124,58,237,0.1) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem' }}>✈️</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TravelMate
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start exploring the world today</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <input name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required autoFocus />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '1rem' }}>
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
