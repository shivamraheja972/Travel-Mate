import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Bookmark } from 'lucide-react';

const POSTS_DATA = {
  'cheap-flights-2026': { title: 'How to Find Cheap Flights in 2026', meta: '8 min read', tag: 'Tips', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop', date: 'May 1, 2026', author: 'Sarah Jenkins' },
  'best-time-international': { title: 'Best Time to Book International Flights', meta: '6 min read', tag: 'Guide', image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1200&h=600&fit=crop', date: 'April 28, 2026', author: 'Mike Chen' },
  'carry-on-hacks': { title: 'Carry-on Hacks for Stress-Free Travel', meta: '5 min read', tag: 'Productivity', image: 'https://images.unsplash.com/photo-1570710891163-6d2b5120c1fd?w=1200&h=600&fit=crop', date: 'April 20, 2026', author: 'Emma Watson' },
  'travel-insurance': { title: 'Travel Insurance: What Actually Matters', meta: '7 min read', tag: 'Safety', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop', date: 'April 15, 2026', author: 'David Miller' }
};

export default function BlogPost() {
  const { id } = useParams();
  const post = POSTS_DATA[id] || POSTS_DATA['cheap-flights-2026']; // fallback for demo

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <div style={{ height: '500px', backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)' }}></div>
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '60px' }}>
          <Link to="/blog" style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px', fontWeight: 600, opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity=1} onMouseLeave={e => e.currentTarget.style.opacity=0.8}>
            <ArrowLeft size={18} /> Back to Blog
          </Link>
          <div style={{ display: 'inline-block', background: '#2d73e6', color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', width: 'fit-content' }}>{post.tag}</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-title)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: 1.1, maxWidth: '900px' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '24px', color: 'white', opacity: 0.9, fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {post.author}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {post.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>• {post.meta}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10, display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Main Article */}
        <article style={{ flex: 1, background: 'white', borderRadius: '24px', padding: '60px', boxShadow: '0 20px 40px rgba(20, 37, 68, 0.06)', border: '1px solid #dce5f4' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
            <button style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '10px', color: '#475569', cursor: 'pointer', display: 'flex' }}><Share2 size={18} /></button>
            <button style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '10px', color: '#475569', cursor: 'pointer', display: 'flex' }}><Bookmark size={18} /></button>
          </div>

          <div style={{ fontSize: '1.15rem', color: '#334155', lineHeight: 1.8, fontFamily: 'Georgia, serif' }}>
            <p style={{ marginBottom: '24px', fontSize: '1.3rem', color: '#1e293b', fontWeight: 600 }}>
              The travel landscape is constantly shifting, but finding the right flight at the perfect price doesn't have to be a guessing game. Here is exactly how to navigate the market this year.
            </p>
            <p style={{ marginBottom: '24px' }}>
              For years, the golden rule of booking flights was to lock in your tickets exactly 54 days before departure on a Tuesday. While that advice used to hold water, airline pricing algorithms have evolved into highly sophisticated systems that adjust prices thousands of times a day based on real-time demand, fuel costs, and competitor pricing.
            </p>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 800, marginTop: '48px', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>1. Embrace the Power of Flexibility</h2>
            <p style={{ marginBottom: '24px' }}>
              The single biggest factor in securing a cheap flight is flexibility. If you can shift your departure or return dates by just 24 to 48 hours, you can often save hundreds of dollars. Many aggregator platforms now offer "flexible dates" calendars that immediately highlight the cheapest days to fly in any given month.
            </p>
            <div style={{ background: '#f8fafc', borderLeft: '4px solid #2d73e6', padding: '24px', margin: '40px 0', borderRadius: '0 12px 12px 0' }}>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#475569' }}>"I saved $400 on my flight to Tokyo simply by flying out on a Thursday instead of a Friday. The difference a single day makes is staggering."</p>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', fontWeight: 800, marginTop: '48px', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>2. Use Price Alerts Strategically</h2>
            <p style={{ marginBottom: '24px' }}>
              Don't manually check prices every day. Instead, set up automated price alerts. Set alerts for exact dates if you have a strict itinerary, but also set broader alerts for entire months if you're just looking for the best deal to a specific destination.
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{ width: '340px', position: 'sticky', top: '100px' }}>
          <div style={{ background: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)', border: '1px solid #dce5f4', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>About the Author</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#cbd5e1' }}></div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a' }}>{post.author}</strong>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Travel Expert</span>
              </div>
            </div>
            <p style={{ marginTop: '16px', color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{post.author} has visited over 40 countries and specializes in finding budget-friendly travel hacks.</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #2d73e6 0%, #1f58c4 100%)', borderRadius: '24px', padding: '30px', color: 'white', boxShadow: '0 10px 26px rgba(31, 88, 196, 0.2)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Ready to Book?</h3>
            <p style={{ opacity: 0.9, marginBottom: '24px', fontSize: '0.95rem', lineHeight: 1.5 }}>Put these tips into practice and find your next cheap flight right now.</p>
            <Link to="/flights" style={{ display: 'block', textAlign: 'center', background: 'white', color: '#1f58c4', padding: '12px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>Search Flights</Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
