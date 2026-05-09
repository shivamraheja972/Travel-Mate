import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuthStore } from '../store/store';
// @ts-ignore
import { PageLoading } from '../components/Loading';
// @ts-ignore
import { useToast } from '../components/Toast';
// @ts-ignore
import { getUserBookings } from '../lib/supabaseData';
import { 
  Search, Bell, MessageSquare, ChevronDown, 
  LayoutDashboard, Calendar, Wallet, MessageCircle, 
  Grid, Globe, FileText, Settings, HelpCircle, LogOut,
  CalendarCheck, CheckCircle2, FileClock, XOctagon,
  Eye, Plane, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Booking {
  id: string;
  booking_id: string;
  user_id: string;
  booking_type: 'flight' | 'hotel' | 'flight+hotel';
  status: string;
  price?: { totalPrice?: number; total_price?: number };
  payment?: { method?: string };
  flight_details?: { from?: string; to?: string };
  hotel_details?: { hotelName?: string };
  created_at: string;
}

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings(user.id || user._id);
        setBookings(data || []);
      } catch (err) {
        console.warn('Dashboard data fetch failed:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <PageLoading />;

  // Calculate real stats from actual booking data
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.price?.totalPrice || b.price?.total_price || 0), 0);

  const stats = [
    { label: 'Active Bookings', value: confirmedBookings.toString(), icon: <CalendarCheck size={24} />, color: '#6366f1', bg: '#e0e7ff' },
    { label: 'Total Spent', value: `$${totalRevenue.toLocaleString()}`, icon: <CheckCircle2 size={24} />, color: '#10b981', bg: '#d1fae5' },
    { label: 'Pending Bookings', value: pendingBookings.toString(), icon: <FileClock size={24} />, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Total Bookings', value: totalBookings.toString(), icon: <XOctagon size={24} />, color: '#ef4444', bg: '#fee2e2' },
  ];

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'confirmed' || s === 'completed' || s === 'active') {
      return <span style={{ padding: '6px 12px', background: '#d1fae5', color: '#059669', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Active</span>;
    }
    if (s === 'pending' || s === 'padding') {
      return <span style={{ padding: '6px 12px', background: '#fef3c7', color: '#d97706', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Pending</span>;
    }
    return <span style={{ padding: '6px 12px', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
  };

  // Generate mockup data to fill table if empty
  const displayBookings = bookings.length > 0 ? bookings : Array(8).fill(0).map((_, i) => ({
    id: `mock-${i}`,
    booking_id: `#SK${3424 + i}`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    price: { totalPrice: 99.00 },
    payment: { method: i % 2 === 0 ? 'Paypal' : 'Cash in' },
    status: i % 3 === 0 ? 'pending' : 'active',
    mockName: 'Jhone Martin'
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Plane size={22} style={{ transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>TravelMate</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
          <div style={{ padding: '0 24px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Menu</div>
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Calendar size={18} />} label="Booking" active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} />
          <NavItem icon={<Wallet size={18} />} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <NavItem icon={<MessageCircle size={18} />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <NavItem icon={<CalendarCheck size={18} />} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <NavItem icon={<Grid size={18} />} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />

          <div style={{ padding: '0 24px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '32px', marginBottom: '12px' }}>Support</div>
          <NavItem icon={<Globe size={18} />} label="Website" active={activeTab === 'website'} onClick={() => navigate('/')} />
          <NavItem icon={<FileText size={18} />} label="Blogs" active={activeTab === 'blog'} onClick={() => navigate('/blog')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          <NavItem icon={<HelpCircle size={18} />} label="Support & Ticket" active={activeTab === 'support'} onClick={() => navigate('/contact')} />
          <NavItem icon={<LogOut size={18} />} label="Logout" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <header style={{ height: '80px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', width: '320px' }}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search or type a Command" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', width: '100%', color: '#1e293b' }} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <Bell size={18} />
              </button>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <MessageSquare size={18} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', paddingLeft: '24px', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                {user?.firstName?.[0] || 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{user?.firstName || 'Jhone Martin'}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user?.email || 'example@gmail.com'}</div>
              </div>
              <ChevronDown size={16} color="#64748b" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>

          {/* ---- OVERVIEW / BOOKING TAB ---- */}
          {(activeTab === 'overview' || activeTab === 'booking') && (
            <>
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                  {stats.map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stat.icon}
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '6px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>All Bookings</h2>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Booking ID</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Passenger</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Date</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Amount</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Payment</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b', fontSize: '0.85rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No bookings yet.</td></tr>
                      ) : bookings.map((b: any, index: number) => (
                        <tr key={b.id || index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px 24px', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>{b.booking_id}</td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                {(user?.firstName || 'U')[0]}
                              </div>
                              <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{user?.firstName} {user?.lastName}</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '0.9rem' }}>
                            {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e293b' }}>
                            ${b.price?.totalPrice || b.price?.total_price || '—'}
                          </td>
                          <td style={{ padding: '16px 24px', color: '#1e293b', fontWeight: 500 }}>
                            {b.payment?.method || 'Stripe'}
                          </td>
                          <td style={{ padding: '16px 24px' }}>{getStatusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ---- SETTINGS TAB ---- */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: '24px' }}>Profile Settings</h2>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700 }}>
                    {user?.firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>{user?.firstName} {user?.lastName}</div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>{user?.email}</div>
                  </div>
                </div>
                {[{ label: 'First Name', value: user?.firstName }, { label: 'Last Name', value: user?.lastName }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not set' }].map(f => (
                  <div key={f.label} style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>{f.label}</label>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: 500 }}>{f.value}</div>
                  </div>
                ))}
                <div style={{ marginTop: '8px', padding: '12px 16px', background: '#fef3c7', borderRadius: '10px', color: '#92400e', fontSize: '0.875rem' }}>
                  To update your profile details, please contact support.
                </div>
              </div>
            </div>
          )}

          {/* ---- PLACEHOLDER TABS ---- */}
          {['wallet', 'chat', 'calendar', 'services'].includes(activeTab) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
              <div style={{ fontSize: '4rem' }}>
                {activeTab === 'wallet' ? '💳' : activeTab === 'chat' ? '💬' : activeTab === 'calendar' ? '📅' : '🧩'}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p style={{ color: '#64748b', textAlign: 'center', maxWidth: '360px' }}>This feature is coming soon. We're working hard to bring it to you!</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active = false, onClick = undefined }: any) => {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '12px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px', 
        color: active ? '#6366f1' : '#64748b', 
        fontWeight: active ? 600 : 500,
        fontSize: '0.95rem',
        cursor: 'pointer',
        borderRight: active ? '3px solid #6366f1' : '3px solid transparent',
        background: active ? '#f5f7ff' : 'transparent',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.color = '#1e293b';
          e.currentTarget.style.background = '#f8fafc';
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.color = '#64748b';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { color: active ? '#6366f1' : '#64748b' } as any)}
      {label}
    </div>
  );
};
