import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'admin@travelmate.com';
    const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (adminEmail && adminPassword && email.trim().toLowerCase() === adminEmail && password === adminPassword) {
        login({
          id: 'env-admin-id',
          email: adminEmail,
          firstName: 'Admin',
          lastName: 'User',
          phone: '',
          role: 'admin',
        });
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Access denied.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
      fontFamily: 'var(--font-main)',
      padding: '20px'
    }}>
      <div style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-title)', 
            color: 'white', 
            fontSize: '1.8rem', 
            marginBottom: '8px' 
          }}>
            Travel<span style={{ color: '#3b82f6' }}>Mate</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin Portal Login</p>
        </div>

        <form onSubmit={handleAdminLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@travelmate.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            type="button"
            onClick={() => navigate('/')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            &larr; Back to main site
          </button>
        </div>
      </div>
    </div>
  );
}
