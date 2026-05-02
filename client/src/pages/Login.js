import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';
import { getProfileById } from '../lib/supabaseData';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showVerifiedDialog, setShowVerifiedDialog] = useState(false);
  const [showNotVerifiedDialog, setShowNotVerifiedDialog] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const queryParams = new URLSearchParams(window.location.search);
    const verifiedFromQuery = queryParams.get('verified') === '1';
    const verifiedFromHash = hashParams.get('type') === 'signup' && !!hashParams.get('access_token');

    if (verifiedFromQuery || verifiedFromHash) {
      setShowVerifiedDialog(true);
      if (!verifiedFromQuery) {
        window.history.replaceState({}, document.title, '/login?verified=1');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      if (
        !process.env.REACT_APP_SUPABASE_URL ||
        !process.env.REACT_APP_SUPABASE_ANON_KEY ||
        process.env.REACT_APP_SUPABASE_URL.includes('placeholder') ||
        process.env.REACT_APP_SUPABASE_ANON_KEY.includes('placeholder')
      ) {
        throw new Error('Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in client/.env and restart the app.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (error) throw error;

      const profile = await getProfileById(data.user.id).catch(() => null);
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        firstName: profile?.first_name || data.user.user_metadata?.first_name || '',
        lastName: profile?.last_name || data.user.user_metadata?.last_name || '',
        phone: profile?.phone || data.user.user_metadata?.phone || '',
        role: profile?.role || 'user',
      };

      login(userObj);
      success(`Welcome back, ${userObj.firstName || 'Traveler'}!`);
      navigate('/dashboard');
    } catch (err) {
      const status = err?.status ? ` [${err.status}]` : '';
      const code = err?.code ? ` (${err.code})` : '';
      const raw = `${status}${code} ${err?.message || ''}`.trim();
      const message = (err?.message || '').toLowerCase();
      
      if (message.includes('email not confirmed')) {
        setShowNotVerifiedDialog(true);
        return;
      }

      let finalMessage = raw || 'Login failed. Please try again.';
      if (message.includes('invalid login credentials')) {
        finalMessage = 'Invalid email or password. Please try again.';
      } else if (message.includes('failed to fetch')) {
        finalMessage = 'Unable to connect right now. Please try again in a moment.';
      } else if (err?.status || err?.code) {
        finalMessage = raw;
      }
      setAuthError(finalMessage);
      showError(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', 
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(31, 88, 196, 0.3)' }}>
              <Plane size={24} style={{ transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '1.6rem', color: '#17233b', letterSpacing: '-0.02em' }}>
              TravelMate
            </span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, color: '#17233b', letterSpacing: '-0.02em', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1rem' }}>Sign in to continue your journey</p>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 14px 28px rgba(20, 36, 68, 0.05)', border: '1px solid #dce5f4' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17233b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Mail size={18} /></div>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required autoFocus 
                  style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #dce5f4', fontSize: '0.95rem', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', color: '#17233b' }} 
                  onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17233b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Lock size={18} /></div>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required 
                  style={{ width: '100%', padding: '14px 44px 14px 44px', borderRadius: '12px', border: '1px solid #dce5f4', fontSize: '0.95rem', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', color: '#17233b' }} 
                  onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', 
              color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '10px', boxShadow: '0 8px 16px rgba(31, 88, 196, 0.2)', transition: 'transform 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {authError && (
              <div style={{
                marginTop: '6px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #fecaca',
                background: '#fff1f2',
                color: '#9f1239',
                fontSize: '0.85rem',
                fontWeight: 600,
                lineHeight: 1.4,
              }}>
                {authError}
              </div>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1f58c4', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>

      {showVerifiedDialog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 440,
            background: 'white',
            borderRadius: '18px',
            border: '1px solid #dce5f4',
            boxShadow: '0 18px 36px rgba(20, 36, 68, 0.16)',
            padding: '24px',
          }}>
            <h3 style={{ margin: 0, marginBottom: '10px', color: '#17233b', fontSize: '1.2rem', fontWeight: 800 }}>
              Email Verified
            </h3>
            <p style={{ margin: 0, marginBottom: '16px', color: '#475569', lineHeight: 1.5 }}>
              Your email has been verified successfully. You can now log in to your TravelMate account.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowVerifiedDialog(false);
                window.history.replaceState({}, document.title, '/login');
              }}
              style={{
                width: '100%',
                height: '42px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {showNotVerifiedDialog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 440,
            background: 'white',
            borderRadius: '18px',
            border: '1px solid #dce5f4',
            boxShadow: '0 18px 36px rgba(20, 36, 68, 0.16)',
            padding: '24px',
          }}>
            <h3 style={{ margin: 0, marginBottom: '10px', color: '#17233b', fontSize: '1.2rem', fontWeight: 800 }}>
              Email Not Verified
            </h3>
            <p style={{ margin: 0, marginBottom: '16px', color: '#475569', lineHeight: 1.5 }}>
              Please verify your email address to continue. Check your inbox and spam folder for the verification link.
            </p>
            <button
              type="button"
              onClick={() => setShowNotVerifiedDialog(false)}
              style={{
                width: '100%',
                height: '42px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Okay, I'll check my email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
