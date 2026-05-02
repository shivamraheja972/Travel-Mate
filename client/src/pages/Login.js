import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      success(`Welcome back, ${res.data.user.firstName}!`);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
      backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem' }}>✈️</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TravelMate
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="card" style={{ padding: '1rem', marginTop: '1rem', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <strong style={{ color: 'var(--accent)' }}>Demo Mode</strong> — Register a new account to test all features
          </p>
        </div>
      </div>
    </div>
  );
}
