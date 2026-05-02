import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Plane, ArrowRight } from 'lucide-react';

const deals = [
  { slug: 'weekend-escape', title: 'Weekend Escape', route: 'New York to Miami', off: '35% OFF', price: '$189', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=400&fit=crop' },
  { slug: 'asia-summer', title: 'Asia Summer Deal', route: 'Singapore to Bali', off: '42% OFF', price: '$149', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop' },
  { slug: 'euro-city', title: 'Euro City Hopper', route: 'Paris to Rome', off: '28% OFF', price: '$219', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&h=400&fit=crop' },
  { slug: 'business-saver', title: 'Business Saver', route: 'Dubai to London', off: '30% OFF', price: '$499', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop' },
];

export default function Deals() {
  return (
    <div style={{ background: '#020617', minHeight: '100vh', paddingBottom: '80px', color: 'white' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 0 60px' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '8px 16px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
            <Tag size={14} style={{ marginRight: '8px' }} /> Exclusive Drops
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px', lineHeight: 1.1 }}>
            Unlock Private Deals
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Handpicked, deeply discounted travel packages. Available for a limited time only.
          </p>
        </div>
      </section>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {deals.map((deal) => (
            <Link key={deal.slug} to={`/deals/${deal.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ 
                background: '#0f172a', 
                borderRadius: '24px', 
                overflow: 'hidden',
                border: '1px solid #1e293b', 
                position: 'relative',
                height: '100%',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#38bdf8'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#1e293b'; }}>
                
                <div style={{ position: 'absolute', top: '24px', left: '24px', background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 800, zIndex: 1, boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}>
                  {deal.off}
                </div>

                <div style={{ height: '240px', backgroundImage: `url(${deal.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, #0f172a 100%)' }}></div>
                </div>

                <div style={{ padding: '32px', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>{deal.title}</h3>
                  <p style={{ color: '#94a3b8', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}><Plane size={16} /> {deal.route}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #1e293b', paddingTop: '24px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting from</span>
                      <span style={{ fontWeight: 800, fontSize: '2.2rem', color: '#38bdf8', lineHeight: 1 }}>{deal.price}</span>
                    </div>
                    <div style={{ background: '#1e293b', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
