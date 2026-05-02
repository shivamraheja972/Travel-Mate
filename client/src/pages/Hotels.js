import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { searchHotels } from '../lib/supabaseData';

export default function Hotels() {
  const location = useLocation();
  const { error: showError } = useToast();
  const params = new URLSearchParams(location.search);

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [form, setForm] = useState({
    city: params.get('city') || '',
    checkIn: params.get('checkIn') || '',
    checkOut: params.get('checkOut') || '',
    guests: Number(params.get('guests')) || 2,
    rooms: 1,
  });

  useEffect(() => {
    if (params.get('city')) handleSearch(null);
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!form.city || !form.checkIn || !form.checkOut) {
      showError('Please enter city and dates');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const results = await searchHotels(form);
      setHotels(results || []);
    } catch (err) {
      showError(err.message || 'Search failed. Please try again.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Search header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
        <div className="container">
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
              {[
                { name: 'city', label: 'City / Destination', placeholder: 'e.g. Bali, Paris' },
                { name: 'checkIn', label: 'Check-in', type: 'date' },
                { name: 'checkOut', label: 'Check-out', type: 'date' },
                { name: 'guests', label: 'Guests', type: 'number', min: 1, max: 20 },
                { name: 'rooms', label: 'Rooms', type: 'number', min: 1, max: 10 },
              ].map(({ name, label, placeholder, type = 'text', min, max }) => (
                <div key={name} className="form-group" style={{ flex: '1 1 130px' }}>
                  <label>{label}</label>
                  <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange} min={min} max={max} style={{ minWidth: 0 }} />
                </div>
              ))}
              <div style={{ flex: '0 0 auto' }}>
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ height: 45 }}>
                  {loading ? '⏳' : '🔍 Search'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {loading ? (
          <Loading text="Finding the perfect hotels..." />
        ) : searched ? (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>
                {hotels.length} Hotels in {form.city}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {form.checkIn} → {form.checkOut} · {form.guests} guest(s) · {form.rooms} room(s)
              </p>
            </div>
            {hotels.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
                <h3>No hotels found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try a different city or dates</p>
              </div>
            ) : (
              <div className="grid-3">
                {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏨</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Find Your Perfect Stay</h2>
            <p style={{ color: 'var(--text-muted)' }}>Search for hotels in any city worldwide</p>
          </div>
        )}
      </div>
    </div>
  );
}
