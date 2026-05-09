import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Eye, Plane, ChevronLeft, ChevronRight,
  Send, Tag, Hotel, CreditCard, TrendingUp, ArrowRight,
  MapPin, Clock, Star
} from 'lucide-react';

/* ── Wallet Tab ─────────────────────────────────────────── */
const WalletTab = ({ bookings, user }: any) => {
  const transactions = bookings.length > 0
    ? bookings.map((b: any) => ({
        id: b.booking_id,
        date: new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        desc: b.flight_details ? `✈️ ${b.flight_details.from || '?'} → ${b.flight_details.to || '?'}` : b.hotel_details ? `🏨 ${b.hotel_details.hotelName || 'Hotel'}` : '✈️ Flight Booking',
        amount: b.price?.totalPrice || b.price?.total_price || 0,
        method: b.payment?.method || 'Stripe',
        status: b.status,
      }))
    : [
        { id: 'TM001', date: 'May 9, 2026', desc: '✈️ Toronto → Dubai', amount: 2052, method: 'Stripe', status: 'confirmed' },
        { id: 'TM002', date: 'Apr 20, 2026', desc: '🏨 Burj Al Arab, Dubai', amount: 880, method: 'Paypal', status: 'confirmed' },
        { id: 'TM003', date: 'Mar 15, 2026', desc: '✈️ Dubai → London', amount: 1140, method: 'Stripe', status: 'completed' },
      ];

  const total = transactions.reduce((s: number, t: any) => s + t.amount, 0);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Wallet & Payments</h2>

      {/* Balance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', borderRadius: 16, padding: '24px 28px', color: 'white' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: 8 }}>Total Spent</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>${total.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: 6 }}>{transactions.length} transactions</div>
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 8 }}>Last Payment</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b' }}>${transactions[0]?.amount?.toLocaleString() || 0}</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 6 }}>{transactions[0]?.date}</div>
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>Transaction History</div>
        {transactions.map((t: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < transactions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                {t.desc.startsWith('✈️') ? '✈️' : '🏨'}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{t.desc.replace(/✈️|🏨/g, '').trim()}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>{t.date} · {t.method}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1rem' }}>-${t.amount?.toLocaleString()}</div>
              <div style={{ marginTop: 4 }}>
                <span style={{ padding: '3px 10px', background: t.status === 'confirmed' || t.status === 'completed' ? '#d1fae5' : '#fef3c7', color: t.status === 'confirmed' || t.status === 'completed' ? '#059669' : '#d97706', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{t.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Chat Tab ───────────────────────────────────────────── */
const ChatTab = ({ user }: any) => {
  const [messages, setMessages] = useState([
    { from: 'support', text: `Hi ${user?.firstName || 'there'}! 👋 Welcome to TravelMate Support. How can I help you today?`, time: '10:30 AM' },
    { from: 'support', text: 'You can ask me about your bookings, flight changes, refund policies, or anything else travel-related.', time: '10:30 AM' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const botReplies: Record<string, string> = {
    refund: 'Refund requests are processed within 5–7 business days. Please share your Booking ID and we\'ll get that started for you.',
    cancel: 'To cancel a booking, go to the Booking tab, find your trip, and tap "Details". Cancellations made 24+ hours before departure are eligible for a full refund.',
    change: 'Flight date/seat changes can be requested up to 6 hours before departure. Fees may apply depending on the airline.',
    baggage: 'Baggage allowances vary by airline. Economy typically includes 7kg cabin + 23kg check-in. Check your booking confirmation for specifics.',
    default: 'Thanks for reaching out! Our team will follow up within 2 hours. In the meantime, check your booking details under the Booking tab.',
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) };
    const lower = input.toLowerCase();
    const replyKey = Object.keys(botReplies).find(k => lower.includes(k)) || 'default';
    const botMsg = { from: 'support', text: botReplies[replyKey], time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Support Chat</h2>
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520 }}>
        {/* Chat header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>TM</div>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>TravelMate Support</div>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>● Online</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '75%' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: m.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.from === 'user' ? '#6366f1' : '#f1f5f9',
                  color: m.from === 'user' ? 'white' : '#1e293b',
                  fontSize: '0.9rem', lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4, textAlign: m.from === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message... (try 'refund', 'cancel', 'baggage')"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', color: '#1e293b' }}
          />
          <button onClick={send} style={{ width: 42, height: 42, borderRadius: 10, background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Calendar Tab ───────────────────────────────────────── */
const CalendarTab = ({ bookings }: any) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const bookingDates = new Set(bookings.map((b: any) => new Date(b.created_at).toDateString()));
  const bookingByDate: Record<string, any[]> = {};
  bookings.forEach((b: any) => {
    const key = new Date(b.created_at).toDateString();
    if (!bookingByDate[key]) bookingByDate[key] = [];
    bookingByDate[key].push(b);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Booking Calendar</h2>
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <button onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16} /></button>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{monthName} {year}</div>
          <button onClick={nextMonth} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16} /></button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #e2e8f0' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{d}</div>
          ))}
        </div>

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} style={{ minHeight: 56 }} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1;
            const dateStr = new Date(year, month, d).toDateString();
            const isToday = dateStr === today.toDateString();
            const hasBooking = bookingDates.has(dateStr);
            return (
              <div key={d} style={{ minHeight: 56, padding: 6, borderTop: '1px solid #f1f5f9', position: 'relative' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: isToday ? '#6366f1' : hasBooking ? '#e0e7ff' : 'transparent',
                  color: isToday ? 'white' : hasBooking ? '#6366f1' : '#1e293b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: isToday || hasBooking ? 700 : 400,
                  margin: '0 auto',
                }}>
                  {d}
                </div>
                {hasBooking && !isToday && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', margin: '3px auto 0' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming */}
      <div style={{ marginTop: 20, background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#1e293b' }}>Your Bookings</div>
        {bookings.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No bookings to display yet.</div>
        ) : bookings.map((b: any, i: number) => (
          <div key={i} style={{ padding: '14px 24px', borderBottom: i < bookings.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={18} style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>{b.booking_id}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 2 }}>
                {new Date(b.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#059669', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600 }}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Services Tab ───────────────────────────────────────── */
const ServicesTab = () => {
  const services = [
    { icon: '✈️', title: 'Flights', desc: 'Search and book flights worldwide with the best prices and flexible dates.', link: '/flights', color: '#e0e7ff', accent: '#6366f1' },
    { icon: '🏨', title: 'Hotels', desc: 'Find the perfect stay from budget-friendly to luxury 5-star hotels.', link: '/hotels', color: '#d1fae5', accent: '#10b981' },
    { icon: '🎫', title: 'Exclusive Deals', desc: 'Handpicked travel packages at deeply discounted prices for a limited time.', link: '/deals', color: '#fef3c7', accent: '#f59e0b' },
    { icon: '📖', title: 'Travel Blog', desc: 'Expert tips, destination guides, and travel hacks from our writers.', link: '/blog', color: '#fce7f3', accent: '#ec4899' },
    { icon: '🤝', title: 'Partnerships', desc: 'Airlines, hotels, and agencies — grow your reach with TravelMate.', link: '/partnership', color: '#e0f2fe', accent: '#0ea5e9' },
    { icon: '💬', title: '24/7 Support', desc: 'Get help anytime with our always-online support team and chat.', link: '/contact', color: '#f3e8ff', accent: '#a855f7' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Services</h2>
      <p style={{ color: '#64748b', marginBottom: 28 }}>Everything TravelMate offers — all in one place.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {services.map((s, i) => (
          <a key={i} href={s.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 16 }}>
                {s.icon}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
              <div style={{ color: s.accent, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                Explore <ArrowRight size={14} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

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
  special_requests?: string;
}

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  useEffect(() => {
    if (!selectedBooking && bookings.length > 0) {
      setSelectedBooking(bookings[0]);
    }
  }, [bookings, selectedBooking]);

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

  const getBookingAmount = (booking: Booking) => booking.price?.totalPrice || booking.price?.total_price || 0;

  const getBookingSummary = (booking: Booking) => {
    if (booking.booking_type === 'flight' && booking.flight_details) {
      return `${booking.flight_details.from || 'Unknown'} -> ${booking.flight_details.to || 'Unknown'}`;
    }
    if (booking.booking_type === 'hotel' && booking.hotel_details) {
      return booking.hotel_details.hotelName || 'Hotel stay';
    }
    if (booking.booking_type === 'flight+hotel') {
      return 'Flight + Hotel package';
    }
    return 'Trip details unavailable';
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
                          <td style={{ padding: '16px 24px', color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(b)}
                              style={{ border: 'none', background: 'transparent', color: '#6366f1', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                            >
                              {b.booking_id}
                            </button>
                          </td>
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
                            ${getBookingAmount(b) || '—'}
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

              {selectedBooking && (
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '20px', overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b' }}>Booking Details</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 600, fontSize: '0.88rem' }}>
                      <Eye size={16} />
                      {selectedBooking.booking_id}
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Trip Type</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedBooking.booking_type || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Route / Stay</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{getBookingSummary(selectedBooking)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Amount</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>${getBookingAmount(selectedBooking).toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Payment Method</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedBooking.payment?.method || 'Stripe'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Booked On</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>
                        {new Date(selectedBooking.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Status</div>
                      <div>{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                  </div>
                  {selectedBooking.special_requests && (
                    <div style={{ padding: '0 24px 20px 24px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Special Requests</div>
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', color: '#334155' }}>
                        {selectedBooking.special_requests}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ---- SETTINGS TAB ---- */}
          {activeTab === 'settings' && (
            <div>
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

          {/* ---- FEATURE TABS ---- */}
          {activeTab === 'wallet' && <WalletTab bookings={bookings} user={user} />}
          {activeTab === 'chat' && <ChatTab user={user} />}
          {activeTab === 'calendar' && <CalendarTab bookings={bookings} />}
          {activeTab === 'services' && <ServicesTab />}

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
