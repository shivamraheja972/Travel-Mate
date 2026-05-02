import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plane, Check, Star, MapPin } from 'lucide-react';

const DEALS_DATA = {
  'weekend-escape': { title: 'Weekend Escape', route: 'New York to Miami', off: '35% OFF', price: '$189', image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200&h=800&fit=crop', hotel: 'South Beach Premium Resort', duration: '3 Days, 2 Nights' },
  'asia-summer': { title: 'Asia Summer Deal', route: 'Singapore to Bali', off: '42% OFF', price: '$149', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop', hotel: 'Ubud Jungle Villa', duration: '5 Days, 4 Nights' },
  'euro-city': { title: 'Euro City Hopper', route: 'Paris to Rome', off: '28% OFF', price: '$219', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&h=800&fit=crop', hotel: 'Roma Central Suites', duration: '4 Days, 3 Nights' },
  'business-saver': { title: 'Business Saver', route: 'Dubai to London', off: '30% OFF', price: '$499', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop', hotel: 'The Thames Luxury Inn', duration: '2 Days, 1 Night' }
};

export default function DealDetails() {
  const { id } = useParams();
  const deal = DEALS_DATA[id] || DEALS_DATA['weekend-escape'];

  return (
    <div style={{ background: '#0a0f1c', minHeight: '100vh', color: 'white', paddingBottom: '100px' }}>
      
      {/* Top Nav Overlay */}
      <div style={{ position: 'absolute', top: '100px', left: 0, right: 0, zIndex: 50 }}>
        <div className="container">
          <Link to="/deals" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '999px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft size={18} /> Back to Deals
          </Link>
        </div>
      </div>

      {/* Hero Image Split */}
      <div style={{ height: '60vh', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${deal.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '300px', background: 'linear-gradient(180deg, transparent 0%, #0a0f1c 100%)' }}></div>
      </div>

      {/* Content Area */}
      <div className="container" style={{ position: 'relative', marginTop: '-120px', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px' }}>
          
          {/* Main Details */}
          <div>
            <div style={{ display: 'inline-block', background: '#dc2626', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, marginBottom: '20px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)' }}>
              {deal.off} FLASH SALE
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '20px', lineHeight: 1 }}>
              {deal.title}
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <Plane size={24} /> {deal.route}
            </p>

            <div style={{ background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '20px' }}>What's Included</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Round-trip Flights</h4>
                    <p style={{ color: '#94a3b8' }}>Direct flights included from your selected departure airport.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Premium Accommodation</h4>
                    <p style={{ color: '#94a3b8' }}>{deal.duration} stay at {deal.hotel}.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Daily Breakfast</h4>
                    <p style={{ color: '#94a3b8' }}>Complimentary gourmet breakfast every morning of your stay.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Hotel Details: {deal.hotel}</h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>Experience luxury and comfort in the heart of the city. This premium resort features breathtaking views, world-class dining, and exclusive access to top-tier amenities.</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700 }}><Star size={18} fill="currentColor" /> 4.8 / 5.0 Rating</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}><MapPin size={18} /> Central Location</span>
              </div>
            </div>

          </div>

          {/* Booking Sidebar */}
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '40px', border: '1px solid #334155', position: 'sticky', top: '100px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <span style={{ color: '#94a3b8', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Exclusive Price</span>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1, margin: '10px 0 24px' }}>{deal.price}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}> /person</span></div>
              
              <button style={{ width: '100%', background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: 'white', border: 'none', padding: '18px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', marginBottom: '16px', boxShadow: '0 10px 20px rgba(2, 132, 199, 0.3)' }}>
                Book This Deal
              </button>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>Limited time offer. Terms and conditions apply.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
