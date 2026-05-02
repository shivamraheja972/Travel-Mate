import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuthStore } from '../store/store';
import { PageLoading } from '../components/Loading';
import { useToast } from '../components/Toast';

const statusColors = {
  confirmed: 'success', pending: 'warning', cancelled: 'error', completed: 'success', refunded: 'info',
};

export default function UserDashboard() {
  const { user, updateUser } = useAuthStore();
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    api.get(`/bookings/user/${user._id}`)
      .then(res => setBookings(res.data.bookings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by user' });
      setBookings(b => b.map(booking => booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking));
      showSuccess('Booking cancelled successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/users/${user._id}`, profileForm);
      updateUser(res.data.user);
      showSuccess('Profile updated!');
    } catch (err) {
      showError('Failed to update profile');
    }
  };

  if (loading) return <PageLoading />;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, color: 'white',
          }}>
            {user?.firstName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
              Welcome back, {user?.firstName}!
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { icon: '🎫', label: 'Total Bookings', value: bookings.length },
            { icon: '✅', label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
            { icon: '⏳', label: 'Pending', value: bookings.filter(b => b.status === 'pending').length },
            { icon: '❌', label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
          ].map(({ icon, label, value }) => (
            <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[['bookings', '🎫 My Bookings'], ['profile', '👤 Profile']].map(([key, label]) => (
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

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Start planning your next adventure!</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/flights')}>✈️ Search Flights</button>
                  <button className="btn btn-ghost" onClick={() => navigate('/hotels')}>🏨 Search Hotels</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bookings.map(b => (
                  <div key={b._id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem' }}>{b.bookingType === 'flight' ? '✈️' : '🏨'}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                            {b.bookingType === 'flight'
                              ? `${b.flightDetails?.from} → ${b.flightDetails?.to}`
                              : b.hotelDetails?.hotelName || 'Hotel Booking'
                            }
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                            ID: {b.bookingId} · {new Date(b.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <span className={`badge badge-${statusColors[b.status] || 'info'}`}>
                          {b.status}
                        </span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)' }}>
                          ${b.price?.totalPrice}
                        </span>
                        {['pending', 'confirmed'].includes(b.status) && (
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}
                            onClick={() => handleCancel(b._id)}
                            disabled={cancelling === b._id}
                          >
                            {cancelling === b._id ? '⏳' : '❌ Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="card" style={{ padding: '2rem', maxWidth: 600 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem' }}>Edit Profile</h3>
            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input value={profileForm.firstName} onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input value={profileForm.lastName} onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>
              <div className="form-group">
                <label>Email (cannot change)</label>
                <input value={user?.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
