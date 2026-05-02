import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

  return (
    <nav className="fs-nav">
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
          <Link to="/login" className="fs-login-btn">Login</Link>
        </div>
      </div>
    </nav>
  );
}
