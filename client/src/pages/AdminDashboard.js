import React, { useEffect, useState } from 'react';
import { PageLoading } from '../components/Loading';
import { getAdminDashboardData } from '../lib/supabaseData';
import AdminSidebar from '../components/admin/AdminSidebar';
import { 
  Ticket, CheckCircle, Users, DollarSign, 
  Plane, Hotel, Briefcase, FileText, Settings,
  Eye, Edit, AlertCircle, Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getAdminDashboardData()
      .then((data) => {
        setStats(data.stats);
        setBookings(data.bookings || []);
        setUsers(data.users || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  const statCards = stats
    ? [
        { icon: <Ticket size={24} />, label: 'Total Bookings', value: stats.totalBookings, bg: '#eff6ff', color: '#3b82f6' },
        { icon: <CheckCircle size={24} />, label: 'Confirmed', value: stats.confirmedBookings, bg: '#f0fdf4', color: '#10b981' },
        { icon: <Users size={24} />, label: 'Total Users', value: stats.totalUsers, bg: '#f5f3ff', color: '#8b5cf6' },
        { icon: <DollarSign size={24} />, label: 'Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, bg: '#fffbeb', color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'bookings' && 'Manage Bookings'}
            {activeTab === 'users' && 'Manage Users'}
            {activeTab === 'flights' && 'Flight Inventory'}
            {activeTab === 'hotels' && 'Hotel Inventory'}
            {activeTab === 'deals' && 'Special Deals'}
            {activeTab === 'blog' && 'Blog Posts'}
            {activeTab === 'settings' && 'Platform Settings'}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['flights', 'hotels', 'deals', 'blog'].includes(activeTab) && (
              <button className="search-btn" style={{ padding: '0 24px', minHeight: '44px', fontSize: '0.9rem' }}>
                + Add New
              </button>
            )}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="admin-stats-grid">
              {statCards.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-info">
                    <h4>{stat.label}</h4>
                    <p>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Recent Activity</h3>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ color: 'var(--text-soft)' }}>
                  Platform is running normally. {stats?.todayBookings || 0} bookings today.
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">All Bookings ({bookings.length})</h3>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'monospace', color: 'var(--brand-blue)' }}>{b.bookingId}</td>
                      <td>{b.user ? `${b.user.firstName} ${b.user.lastName}` : 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {b.bookingType === 'flight' ? <Plane size={14} /> : <Hotel size={14} />} 
                          {b.bookingType}
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>${b.price?.totalPrice}</td>
                      <td>
                        <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'error' : 'warning'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-soft)' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                         <button className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-soft)' }}>No bookings yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">All Users ({users.length})</h3>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                            {u.firstName?.[0] || u.email?.[0]}
                          </div>
                          {u.firstName} {u.lastName}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-soft)' }}>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-info'}`}>{u.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-soft)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                         <button className="btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-soft)' }}>No users yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {['flights', 'hotels', 'deals', 'blog'].includes(activeTab) && (
          <div className="admin-card">
             <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--text-soft)', opacity: 0.5 }}>
                   {activeTab === 'flights' && <Plane size={48} style={{ margin: '0 auto' }} />}
                   {activeTab === 'hotels' && <Hotel size={48} style={{ margin: '0 auto' }} />}
                   {activeTab === 'deals' && <Tag size={48} style={{ margin: '0 auto' }} />}
                   {activeTab === 'blog' && <FileText size={48} style={{ margin: '0 auto' }} />}
                </div>
                <h3 style={{ marginBottom: '8px' }}>Under Construction</h3>
                <p style={{ color: 'var(--text-soft)' }}>The {activeTab} management interface is being built.</p>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="admin-card">
             <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--text-soft)', opacity: 0.5 }}>
                   <Settings size={48} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ marginBottom: '8px' }}>Platform Settings</h3>
                <p style={{ color: 'var(--text-soft)' }}>Configure your TravelMate platform settings here.</p>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
