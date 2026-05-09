import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import { useToast } from '../components/Toast';
import { registerUser } from '../lib/supabaseData';
import { Mail, Lock, Eye, EyeOff, Plane, User, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
      const { requiresEmailVerification, user } = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      if (requiresEmailVerification) {
        success('Account created! Please check your email to verify your account before logging in.');
        navigate('/login');
        return;
      }

      const userObj = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || form.firstName,
        lastName: user.lastName || form.lastName,
        phone: user.phone || form.phone,
        role: user.role || 'user',
      };

      login(userObj);
      success(`Welcome to TravelMate, ${form.firstName}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid #dce5f4', 
    fontSize: '0.95rem', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s', color: '#17233b'
  };

  const labelStyle = { fontSize: '0.85rem', fontWeight: 700, color: '#17233b', textTransform: 'uppercase', letterSpacing: '0.03em' };
  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', 
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '4rem 2rem'
    }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
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
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, color: '#17233b', letterSpacing: '-0.02em', marginBottom: '8px' }}>Create an account</h1>
          <p style={{ color: 'var(--text-soft)', fontSize: '1rem' }}>Start your journey with us today</p>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 14px 28px rgba(20, 36, 68, 0.05)', border: '1px solid #dce5f4' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconStyle}><User size={18} /></div>
                  <input name="firstName" placeholder="John" value={form.firstName} onChange={handleChange} required autoFocus style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconStyle}><User size={18} /></div>
                  <input name="lastName" placeholder="Doe" value={form.lastName} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={iconStyle}><Mail size={18} /></div>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <div style={iconStyle}><Phone size={18} /></div>
                <input name="phone" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconStyle}><Lock size={18} /></div>
                  <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 chars" value={form.password} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Confirm</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconStyle}><Lock size={18} /></div>
                  <input name="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Confirm" value={form.confirmPassword} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#2d73e6'} onBlur={(e) => e.target.style.borderColor = '#dce5f4'} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', 
              color: 'white', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '10px', boxShadow: '0 8px 16px rgba(31, 88, 196, 0.2)', transition: 'transform 0.2s'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1f58c4', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-soft)', fontSize: '0.8rem', marginTop: '24px' }}>
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
