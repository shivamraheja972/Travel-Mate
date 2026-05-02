import React, { useEffect, useState } from 'react';
import api from '../config/api';
import { PageLoading } from '../components/Loading';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/stats'),
      api.get('/admin/bookings/all'),
      api.get('/admin/users/all'),
    ]).then(([s, b, u]) => {
      setStats(s.data.stats);
      setBookings(b.data.bookings || []);
      setUsers(u.data.users || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  const statCards = stats ? [
    { icon: '🎫', label: 'Total Bookings', value: stats.totalBookings, color: '#3b82f6' },
    { icon: '✅', label: 'Confirmed', value: stats.confirmedBookings, color: '#10b981' },
    { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#8b5cf6' },
    { icon: '💰', label: 'Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: '#f59e0b' },
    { icon: '📅', label: 'Today', value: stats.todayBookings, color: '#06b6d4' },
    { icon: '❌', label: 'Cancelled', value: stats.cancelledBookings, color: '#ef4444' },
  ] : [];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem' }}>⚙️</div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage bookings, users, and platform settings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {statCards.map(({ icon, label, value, color }) => (
            <div key={label} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>{value}</div>
                </div>
                <span style={{ fontSize: '2rem' }}>{icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['overview', '📊 Overview'], ['bookings', '🎫 Bookings'], ['users', '👥 Users']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="btn" style={{
                background: activeTab === key ? 'var(--gradient)' : 'rgba(255,255,255,0.05)',
                color: activeTab === key ? 'white' : 'var(--text-muted)',
                border: 'none',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Recent Activity</h3>
            <p style={{ color: 'var(--text-muted)' }}>📈 Platform is running normally. {stats?.todayBookings || 0} bookings today.</p>
          </div>
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              All Bookings ({bookings.length})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    {['Booking ID', 'User', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{b.bookingId}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem' }}>
                        {b.user ? `${b.user.firstName} ${b.user.lastName}` : 'N/A'}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem' }}>{b.bookingType === 'flight' ? '✈️' : '🏨'} {b.bookingType}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>${b.price?.totalPrice}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge badge-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'error' : 'warning'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet</div>
              )}
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              All Users ({users.length})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    {['Name', 'Email', 'Role', 'Status', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>
                            {u.firstName?.[0]}
                          </div>
                          {u.firstName} {u.lastName}
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-error' : 'badge-info'}`}>{u.role}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users yet</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
