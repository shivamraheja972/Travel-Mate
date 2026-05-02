import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

const posts = [
  { slug: 'cheap-flights-2026', title: 'How to Find Cheap Flights in 2026', meta: '8 min read', tag: 'Tips', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop' },
  { slug: 'best-time-international', title: 'Best Time to Book International Flights', meta: '6 min read', tag: 'Guide', image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&h=400&fit=crop' },
  { slug: 'carry-on-hacks', title: 'Carry-on Hacks for Stress-Free Travel', meta: '5 min read', tag: 'Productivity', image: 'https://images.unsplash.com/photo-1570710891163-6d2b5120c1fd?w=600&h=400&fit=crop' },
  { slug: 'travel-insurance', title: 'Travel Insurance: What Actually Matters', meta: '7 min read', tag: 'Safety', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop' },
];

export default function Blog() {
  return (
    <div style={{ background: '#f4f7fa', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(180deg, #ecf1fb 0%, #f4f7fa 100%)', paddingBottom: '60px' }}>
        <div className="container">
          <div className="hero-pill">
            <BookOpen size={14} style={{ marginRight: '6px' }} /> Travel Resources
          </div>
          <h1 className="hero-title">TravelMate Blog</h1>
          <p className="hero-subtitle">
            Practical travel tips, comprehensive guides, and booking insights from our experts.
          </p>
        </div>
      </section>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{ 
                background: 'white', 
                borderRadius: '24px', 
                overflow: 'hidden',
                border: '1px solid #dce5f4', 
                boxShadow: '0 10px 26px rgba(20, 37, 68, 0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                height: '100%'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                <div style={{ height: '200px', backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'inline-block', background: '#f3f7ff', color: '#1f58c4', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px' }}>{post.tag}</div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17233b', marginBottom: '12px', lineHeight: 1.4 }}>{post.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                    <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{post.meta}</span>
                    <button style={{ background: 'none', border: 'none', color: '#1f58c4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>Read <ArrowRight size={16} /></button>
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
