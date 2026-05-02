import React from 'react';
import { Mail, Phone, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div style={{ background: '#f4f7fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', paddingBottom: '60px' }}>
        <div className="container">
          <div className="hero-pill">
            <MessageSquare size={14} style={{ marginRight: '6px' }} /> Get in Touch
          </div>
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-subtitle">
            Questions, support, or partnership inquiries — our dedicated team is here to help you 24/7.
          </p>
        </div>
      </section>

      <div className="container">
        <section style={{ 
          background: 'white', 
          border: '1px solid #dce5f4', 
          borderRadius: '24px', 
          padding: '48px', 
          boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)',
          marginBottom: '60px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f7ff', color: '#1f58c4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '8px' }}>Email Support</h3>
                <p style={{ color: 'var(--text-soft)', marginBottom: '12px', lineHeight: 1.5 }}>Drop us an email and we'll get back to you within 24 hours.</p>
                <a href="mailto:support@travelmate.com" style={{ color: '#1f58c4', fontWeight: 700, textDecoration: 'none' }}>support@travelmate.com</a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f7ff', color: '#1f58c4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '8px' }}>Phone Support</h3>
                <p style={{ color: 'var(--text-soft)', marginBottom: '12px', lineHeight: 1.5 }}>Call our toll-free number for immediate assistance.</p>
                <a href="tel:+15553014422" style={{ color: '#1f58c4', fontWeight: 700, textDecoration: 'none' }}>+1 (555) 301-4422</a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f7ff', color: '#1f58c4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '8px' }}>Operating Hours</h3>
                <p style={{ color: 'var(--text-soft)', marginBottom: '12px', lineHeight: 1.5 }}>We're always online to help you with your travel plans.</p>
                <span style={{ color: '#17233b', fontWeight: 700 }}>24/7 Customer Support</span>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
