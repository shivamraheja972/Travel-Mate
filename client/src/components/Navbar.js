import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../store/store';

const leftLinks = [
  { to: '/', label: 'Home' },
  { to: '/flights', label: 'Booking' },
  { to: '/partnership', label: 'Partnership' },
];

const rightLinks = [
  { to: '/deals', label: 'Deals' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  let navBg = 'transparent';
  let isDark = false;
  
  if (location.pathname.startsWith('/deals')) {
    navBg = location.pathname === '/deals' ? '#020617' : '#0a0f1c';
    isDark = true;
  } else if (['/partnership', '/about', '/contact', '/blog'].includes(location.pathname)) {
    navBg = '#f4f7fa';
  } else if (location.pathname.startsWith('/blog/')) {
    navBg = '#f8fafc';
  } else if (location.pathname === '/login' || location.pathname === '/register') {
    navBg = 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)';
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fs-nav ${isDark ? 'nav-dark' : ''}`} style={{ background: navBg }}>
      <div className="fs-nav-inner">
        <div className="fs-nav-links left">
          {leftLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`fs-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="fs-logo-pill">
          <Link to="/" className="fs-logo-text" aria-label="TravelMate">
            <span>Travel</span>Mate
          </Link>
        </div>

        <div className="fs-nav-links right">
          {rightLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`fs-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="fs-login-btn" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              {user?.firstName || 'Dashboard'}
            </Link>
          ) : (
            <Link to="/login" className="fs-login-btn">Login</Link>
          )}
        </div>

        <button
          type="button"
          className="fs-mobile-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`fs-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {[...leftLinks, ...rightLinks].map((link) => (
          <Link
            key={`mobile-${link.label}`}
            to={link.to}
            className={`fs-mobile-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="fs-mobile-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <User size={18} /> {user?.firstName || 'Dashboard'}
          </Link>
        ) : (
          <Link to="/login" className="fs-mobile-login">Login</Link>
        )}
      </div>
    </nav>
  );
}
