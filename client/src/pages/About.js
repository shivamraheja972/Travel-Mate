import React from 'react';
import { Globe, Shield, Zap, Info } from 'lucide-react';

export default function About() {
  return (
    <div style={{ background: '#f4f7fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', paddingBottom: '60px' }}>
        <div className="container">
          <div className="hero-pill">
            <Info size={14} style={{ marginRight: '6px' }} /> Discover TravelMate
          </div>
          <h1 className="hero-title">About TravelMate</h1>
          <p className="hero-subtitle">
            We help travelers book smarter with transparent pricing, comprehensive comparisons, and smooth journeys across the globe.
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
          <p style={{ fontSize: '1.1rem', color: '#17233b', lineHeight: 1.8, marginBottom: '24px' }}>
            TravelMate is built to simplify flight and hotel bookings with a modern, reliable experience.
            Our mission is to reduce friction in planning, compare options clearly, and give every traveler
            confidence from search to confirmation.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#17233b', lineHeight: 1.8 }}>
            We focus on speed, trust, and support. Whether it's a weekend trip or a long-haul journey,
            TravelMate is designed to help you move faster and travel better.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #dce5f4', padding: '32px', boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Globe size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '12px' }}>Global Reach</h3>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>We partner with over 500 airlines and 1 million hotels worldwide to bring you the best options.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #dce5f4', padding: '32px', boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Shield size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '12px' }}>Secure Bookings</h3>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>Your data is protected with enterprise-grade encryption. Book with total peace of mind.</p>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #dce5f4', padding: '32px', boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '12px' }}>Lightning Fast</h3>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>Our search engine is optimized for speed, delivering accurate results in milliseconds.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
