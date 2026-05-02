import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import FlightCard from '../components/FlightCard';
import Loading from '../components/Loading';
import { useSearchStore } from '../store/store';
import { useToast } from '../components/Toast';

export default function Flights() {
  const navigate = useNavigate();
  const { flightSearch, setFlightSearch } = useSearchStore();
  const { error: showError } = useToast();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filterStops, setFilterStops] = useState('all');

  const [form, setForm] = useState({
    from: flightSearch?.from || '',
    to: flightSearch?.to || '',
    departDate: flightSearch?.departDate || '',
    returnDate: '',
    passengers: flightSearch?.passengers || 1,
    class: 'economy',
  });

  useEffect(() => {
    if (flightSearch) handleSearch(null, flightSearch);
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSearch = async (e, searchData) => {
    if (e) e.preventDefault();
    const data = searchData || form;
    if (!data.from || !data.to || !data.departDate) {
      showError('Please fill in origin, destination, and date');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.post('/flights/search', data);
      setFlights(res.data.flights || []);
      setFlightSearch(data);
    } catch (err) {
      showError(err.response?.data?.message || 'Search failed. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const sortedFiltered = [...flights]
    .filter(f => filterStops === 'all' ? true : filterStops === 'nonstop' ? f.stops === 0 : f.stops > 0)
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : sortBy === 'duration' ? a.duration?.localeCompare(b.duration) : 0);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Search header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
        <div className="container">
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
              {[
                { name: 'from', label: 'From', placeholder: 'JFK' },
                { name: 'to', label: 'To', placeholder: 'LAX' },
                { name: 'departDate', label: 'Date', type: 'date' },
                { name: 'passengers', label: 'Passengers', type: 'number', min: 1, max: 9 },
              ].map(({ name, label, placeholder, type = 'text', min, max }) => (
                <div key={name} className="form-group" style={{ flex: '1 1 140px' }}>
                  <label>{label}</label>
                  <input name={name} type={type} placeholder={placeholder} value={form[name]} onChange={handleChange}
                    min={min} max={max} style={{ minWidth: 0 }} />
                </div>
              ))}
              <div style={{ flex: '0 0 auto' }}>
                <button type="submit" className="btn btn-accent" disabled={loading} style={{ height: 45 }}>
                  {loading ? '⏳ Searching...' : '🔍 Search'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {loading ? (
          <Loading text="Searching best flights for you..." />
        ) : searched ? (
          <>
            {/* Results header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>
                  {sortedFiltered.length} Flights Found
                </h2>
                {form.from && form.to && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {form.from.toUpperCase()} → {form.to.toUpperCase()} · {form.passengers} passenger(s)
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select value={filterStops} onChange={e => setFilterStops(e.target.value)} style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
                  <option value="all">All Stops</option>
                  <option value="nonstop">Nonstop Only</option>
                  <option value="stops">With Stops</option>
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
                  <option value="price">Sort: Price ↑</option>
                  <option value="duration">Sort: Duration</option>
                </select>
              </div>
            </div>

            {/* Flight list */}
            {sortedFiltered.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
                <h3 style={{ marginBottom: '0.5rem' }}>No flights found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try different dates or cities</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedFiltered.map(f => <FlightCard key={f.id} flight={f} />)}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✈️</div>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Search for Flights</h2>
            <p style={{ color: 'var(--text-muted)' }}>Enter your travel details above to find the best flights</p>
          </div>
        )}
      </div>
    </div>
  );
}
