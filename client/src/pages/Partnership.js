import React from 'react';
import { Target, Award, ShieldCheck, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';

const perks = [
  { icon: <TrendingUp size={20} />, text: 'Partner dashboard with campaign analytics' },
  { icon: <Target size={20} />, text: 'Co-branded promotions for routes and hotels' },
  { icon: <ShieldCheck size={20} />, text: 'API support for inventory and dynamic pricing' },
  { icon: <Award size={20} />, text: 'Dedicated account manager and faster payouts' },
];

const partnerTypes = [
  { title: 'Airlines', desc: 'Promote direct and connected routes with high-intent traffic.' },
  { title: 'Hotels', desc: 'Drive more room bookings through bundled packages and campaigns.' },
  { title: 'Travel Agencies', desc: 'Expand market reach with co-selling and flexible inventory sync.' },
  { title: 'Affiliates', desc: 'Earn commission by referring travelers to flight and hotel deals.' },
];

const onboarding = [
  { step: '1', title: 'Apply', desc: 'Share your company profile and partnership goals.' },
  { step: '2', title: 'Review', desc: 'Our team evaluates fit, integration needs, and target markets.' },
  { step: '3', title: 'Launch', desc: 'Go live with campaigns, dashboard access, and tracking.' },
];

export default function Partnership() {
  return (
    <div style={{ background: '#f4f7fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', paddingBottom: '60px' }}>
        <div className="container">
          <div className="hero-pill">
            <Briefcase size={14} style={{ marginRight: '6px' }} /> TravelMate Partners
          </div>
          <h1 className="hero-title">Grow Your Travel Business</h1>
          <p className="hero-subtitle">
            Join the TravelMate network and connect with our global audience of high-intent travelers. Unlock new revenue streams and co-marketing opportunities.
          </p>
        </div>
      </section>

      <div className="container">
        
        {/* Why Partner With Us */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, color: '#17233b', letterSpacing: '-0.02em' }}>Why Partner With Us</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {perks.map((perk, i) => (
              <div key={i} style={{ 
                background: 'white', 
                border: '1px solid #dce5f4', 
                borderRadius: '16px', 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)' 
              }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f7ff', color: '#1f58c4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {perk.icon}
                </div>
                <strong style={{ fontSize: '1rem', color: '#17233b', lineHeight: 1.4 }}>{perk.text}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Who Can Partner */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, color: '#17233b', letterSpacing: '-0.02em' }}>Who Can Partner</h2>
            <p style={{ color: 'var(--text-soft)' }}>We collaborate with industry leaders across the entire travel ecosystem.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {partnerTypes.map((type) => (
              <div key={type.title} style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #dce5f4',
                padding: '24px',
                boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #2d73e6 0%, #1f58c4 100%)' }}></div>
                <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: '8px', color: '#17233b' }}>{type.title}</strong>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: 1.5 }}>{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Onboarding */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '48px', border: '1px solid #dce5f4', boxShadow: '0 14px 28px rgba(20, 36, 68, 0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, color: '#17233b', letterSpacing: '-0.02em' }}>Simple Onboarding Process</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', position: 'relative' }}>
              {onboarding.map((item) => (
                <div key={item.step} style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', boxShadow: '0 8px 16px rgba(31, 88, 196, 0.3)' }}>
                    {item.step}
                  </div>
                  <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '8px', color: '#17233b' }}>{item.title}</strong>
                  <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', background: 'linear-gradient(135deg, #17233b 0%, #2a4f95 100%)', padding: '60px 20px', borderRadius: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' }}></div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 800, marginBottom: '16px', position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>Trusted by Modern Travel Brands</h3>
          <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            1.8M+ monthly visitors, 40+ campaign launches every quarter, and transparent performance reporting. Join us today.
          </p>
          <button style={{ background: 'white', color: '#17233b', border: 'none', padding: '14px 32px', borderRadius: '999px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }}>
            Apply for Partnership <ChevronRight size={18} />
          </button>
        </section>

      </div>
    </div>
  );
}
