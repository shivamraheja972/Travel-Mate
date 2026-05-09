import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightCard from '../components/FlightCard';
import Loading from '../components/Loading';
import { useSearchStore } from '../store/store';
import { useToast } from '../components/Toast';
import { ChevronLeft, ChevronRight, Zap, Star, Menu, Plane } from 'lucide-react';
import { fetchOpenSkyStates } from '../lib/liveFlights';
import { fetchFlights } from '../lib/mockApi';

const MOCK_FLIGHTS = [
  {
    id: 1,
    airline: 'Lufthansa',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=50&h=50&fit=crop',
    code: 'LH 495, LH 766',
    class: 'Economy',
    depart: '20:20',
    departCity: 'Toronto',
    departCode: 'YYZ',
    arrive: '23:50',
    arriveCity: 'Mumbai',
    arriveCode: 'BOM',
    plusDay: '+1 DAY',
    duration: '18 h',
    stops: '1 stop via Munich',
    price: 1383,
    oldPrice: 1420,
    tags: ['Transit Visa may be required', 'MMTINTLCA coupon applied'],
    alternatives: [
      { airline: 'Lufthansa', times: '18:20 - 01:00', duration: '21 h 10 m (1 stop via Frankfurt)', price: 1635 },
      { airline: 'Air Canada, Lufthansa', times: '18:20 - 01:00', duration: '21 h 10 m (1 stop via Frankfurt)', price: 1835 },
    ],
  },
  {
    id: 2,
    airline: 'Air India',
    logo: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=50&h=50&fit=crop',
    code: 'AI 188, AI 441',
    class: 'Economy',
    depart: '14:00',
    departCity: 'Toronto',
    departCode: 'YYZ',
    arrive: '19:25',
    arriveCity: 'Mumbai',
    arriveCode: 'BOM',
    plusDay: '+1 DAY',
    duration: '19 h 55 m',
    stops: '1 stop via New Delhi',
    price: 1326,
    oldPrice: 1363,
    tags: ['MMTINTLCA coupon applied'],
    alternatives: [],
  },
];

const POPULAR_ROUTES = [
  { from: 'Toronto', to: 'Mumbai', price: 'CAD 1,205' },
  { from: 'Toronto', to: 'Delhi', price: 'CAD 1,134' },
  { from: 'Toronto', to: 'Dubai', price: 'CAD 988' },
  { from: 'Toronto', to: 'London', price: 'CAD 764' },
];

const TRAVEL_NOTES = [
  'Prices usually change every few hours based on demand and seat availability.',
  'Weekend departures may cost more. Mid-week flights often provide better fares.',
  'Carry-on and check-in baggage allowances vary by airline and fare class.',
];

const IATA_HINTS = {
  toronto: 'YTO',
  mumbai: 'BOM',
  delhi: 'DEL',
  dubai: 'DXB',
  london: 'LON',
  newyork: 'NYC',
  'new york': 'NYC',
  jakarta: 'JKT',
  paris: 'PAR',
  sydney: 'SYD',
  tokyo: 'TYO',
};

const toIataLike = (input = '') => {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return '';
  if (IATA_HINTS[normalized]) return IATA_HINTS[normalized];
  if (/^[a-z]{3}$/i.test(normalized)) return normalized.toUpperCase();
  return normalized.slice(0, 3).toUpperCase();
};

export default function Flights() {
  const navigate = useNavigate();
  const { flightSearch, setFlightSearch, setSelectedFlight } = useSearchStore();
  const { error: showError } = useToast();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(false);
  const [searched, setSearched] = useState(true);
  const [activeSort, setActiveSort] = useState('YOU MAY PREFER');
  const [filterStops, setFilterStops] = useState(null);
  const [liveFlights, setLiveFlights] = useState([]);
  const [liveLocation, setLiveLocation] = useState(null);
  const [liveError, setLiveError] = useState('');

  const [form, setForm] = useState({
    from: flightSearch?.from || 'Toronto',
    to: flightSearch?.to || 'Mumbai',
    departDate: flightSearch?.departDate || '2026-05-02',
    passengers: flightSearch?.passengers || 1,
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  React.useEffect(() => {
    // Initial load
    handleSearch();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (e, overrideForm) => {
    if (e && e.preventDefault) e.preventDefault();
    const currentForm = overrideForm || form;
    if (!currentForm.from || !currentForm.to || !currentForm.departDate) {
      showError('Please fill in origin, destination, and date');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const allFlights = await fetchFlights();
      
      const filtered = allFlights.filter(f => 
        (f.from.toLowerCase().includes(currentForm.from.toLowerCase()) || f.fromCode.toLowerCase().includes(currentForm.from.toLowerCase())) &&
        (f.to.toLowerCase().includes(currentForm.to.toLowerCase()) || f.toCode.toLowerCase().includes(currentForm.to.toLowerCase()))
      );
      
      let finalFlights = filtered;
      
      if (filtered.length === 0) {
        const shuffled = [...allFlights].sort(() => 0.5 - Math.random()).slice(0, 10);
        finalFlights = shuffled.map(f => ({
          ...f,
          from: currentForm.from,
          fromCode: toIataLike(currentForm.from),
          to: currentForm.to,
          toCode: toIataLike(currentForm.to),
          date: currentForm.departDate
        }));
      } else {
        finalFlights = finalFlights.map(f => ({ ...f, date: currentForm.departDate }));
      }
      
      setFlights(finalFlights);
      setFlightSearch(currentForm);
    } catch (err) {
      showError(err.message || 'Failed to load flights.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveFlightsNearMe = async () => {
    if (!navigator.geolocation) {
      setLiveError('Geolocation is not supported by your browser.');
      return;
    }

    setLiveLoading(true);
    setLiveError('');
    setLiveFlights([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLiveLocation({ lat, lng });

          // ~180km search box around the user
          const delta = 1.6;
          const lamin = (lat - delta).toFixed(4);
          const lamax = (lat + delta).toFixed(4);
          const lomin = (lng - delta).toFixed(4);
          const lomax = (lng + delta).toFixed(4);

          const payload = await fetchOpenSkyStates({ lamin, lomin, lamax, lomax });
          const states = Array.isArray(payload?.states) ? payload.states : [];

          const normalized = states
            .filter((s) => s && s[5] && s[6])
            .slice(0, 20)
            .map((s, i) => ({
              id: `${s[0]}-${i}`,
              callsign: (s[1] || 'Unknown').trim(),
              country: s[2] || 'Unknown',
              longitude: Number(s[5]).toFixed(4),
              latitude: Number(s[6]).toFixed(4),
              altitude: s[7] ? `${Math.round(s[7])} m` : 'N/A',
              velocity: s[9] ? `${Math.round(s[9] * 3.6)} km/h` : 'N/A',
              onGround: !!s[8],
            }));

          setLiveFlights(normalized);
          if (normalized.length === 0) {
            setLiveError('No live flights found near your current location.');
          }
        } catch (err) {
          setLiveError(err.message || 'Unable to fetch live flights right now.');
        } finally {
          setLiveLoading(false);
        }
      },
      (err) => {
        setLiveLoading(false);
        if (err.code === 1) {
          setLiveError('Location access denied. Please allow location permission and try again.');
        } else {
          setLiveError('Unable to get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const liveSummary = useMemo(() => {
    if (!liveLocation) return '';
    return `${liveLocation.lat.toFixed(3)}, ${liveLocation.lng.toFixed(3)}`;
  }, [liveLocation]);

  const displayedFlights = useMemo(() => {
    let result = [...flights];
    if (filterStops !== null) {
      if (filterStops === 0) result = result.filter(f => f.stops?.toLowerCase().includes('direct'));
      if (filterStops === 1) result = result.filter(f => f.stops?.toLowerCase().includes('1 stop'));
    }
    if (activeSort === 'CHEAPEST') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'FASTEST') {
      result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    }
    return result;
  }, [flights, activeSort, filterStops]);

  const dateCarousel = useMemo(() => {
    const base = new Date(form.departDate + 'T12:00:00');
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [form.departDate]);

  const handleDateClick = (d) => {
    const dateStr = d.toISOString().slice(0, 10);
    const updatedForm = { ...form, departDate: dateStr };
    setForm(updatedForm);
    handleSearch(null, updatedForm);
  };

  const handleBookNow = (f) => {
    const baseDate = form.departDate || new Date().toISOString().slice(0, 10);
    const dep = new Date(`${baseDate}T${f.depart || '08:00'}:00`);
    const durationHours = f.duration?.includes('18') ? 18 : 8;
    const arr = new Date(dep.getTime() + durationHours * 60 * 60 * 1000);

    setSelectedFlight({
      id: String(f.id),
      flightNumber: f.code || `TM-${f.id}`,
      airline: f.airline,
      from: f.departCode || toIataLike(form.from),
      to: f.arriveCode || toIataLike(form.to),
      departureTime: dep.toISOString(),
      arrivalTime: arr.toISOString(),
      duration: f.duration || '8h',
      stops: typeof f.stops === 'string' ? (f.stops.toLowerCase().includes('direct') ? 0 : 1) : Number(f.stops || 0),
      class: f.class || 'Economy',
      baggage: '23kg baggage',
      refundable: true,
      amenities: ['Meal', 'Cabin baggage'],
      price: Number(f.price || 0),
      currency: 'USD',
      logo: '✈️',
    });
    navigate(`/flights/${f.id}`);
  };

  return (
    <div className="flights-page">
      <section className="flights-hero">
        <div className="container">
          <form onSubmit={handleSearch} className="flights-search-shell">
            <div className="flights-search-grid">
              <div className="flights-search-cell">
                <label>Trip Type</label>
                <select>
                  <option>One Way</option>
                </select>
              </div>
              <div className="flights-search-cell">
                <label>From</label>
                <input name="from" value={form.from} onChange={handleChange} />
              </div>
              <div className="flights-search-cell">
                <label>To</label>
                <input name="to" value={form.to} onChange={handleChange} />
              </div>
              <div className="flights-search-cell">
                <label>Depart</label>
                <input type="date" name="departDate" value={form.departDate} onChange={handleChange} />
              </div>
              <div className="flights-search-cell">
                <label>Passengers</label>
                <select name="passengers" value={form.passengers} onChange={handleChange}>
                  <option value="1">1 Adult · Economy</option>
                  <option value="2">2 Adults · Economy</option>
                </select>
              </div>
            </div>
            <button type="submit" className="flights-search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
        </div>
      </section>

      {loading ? (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
          <Loading text="Searching best flights for you..." />
        </div>
      ) : searched ? (
        <div className="perfect-flight-wrapper" style={{ paddingTop: '40px' }}>
          <section className="perfect-flight-section container">
            <aside className="adv-sidebar">
              <div className="adv-filter-box">
                <h4>Show Flights</h4>
                <label className="checkbox-item"><span><input type="checkbox" /> With Check-In Baggage</span></label>
              </div>

              <div className="adv-filter-box">
                <h4>Popular Filters</h4>
                <div className="checkbox-list">
                  <label className="checkbox-item">
                    <span>
                      <input type="checkbox" checked={filterStops === 0} onChange={() => setFilterStops(filterStops === 0 ? null : 0)} /> 
                      Direct Flights
                    </span>
                  </label>
                  <label className="checkbox-item">
                    <span>
                      <input type="checkbox" checked={filterStops === 1} onChange={() => setFilterStops(filterStops === 1 ? null : 1)} /> 
                      1 Stop
                    </span>
                  </label>
                  <label className="checkbox-item">
                    <span><input type="checkbox" /> Morning Departures</span>
                  </label>
                </div>
              </div>
            </aside>

            <div className="adv-main-content">
              <h2 className="adv-page-title">Flights from {form.from} to {form.to}</h2>

              <div className="date-carousel">
                <button className="nav-arrow"><ChevronLeft size={18} /></button>
                <div className="date-items">
                  {dateCarousel.map((d, i) => (
                    <div 
                      key={i} 
                      className={`date-item ${d.toISOString().slice(0, 10) === form.departDate ? 'active' : ''}`}
                      onClick={() => handleDateClick(d)}
                      style={{ cursor: 'pointer' }}
                    >
                      <strong>{d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                      <span>View</span>
                    </div>
                  ))}
                </div>
                <button className="nav-arrow"><ChevronRight size={18} /></button>
              </div>

              <div className="sort-cards">
                <div className={`sort-card ${activeSort === 'CHEAPEST' ? 'active' : ''}`} onClick={() => setActiveSort('CHEAPEST')}>
                  <div className="sort-icon"><Plane size={16} style={{ transform: 'rotate(45deg)' }} /></div>
                  <div><h4>CHEAPEST</h4><p>CAD 1,205 · 20h 35m</p></div>
                </div>
                <div className={`sort-card ${activeSort === 'FASTEST' ? 'active' : ''}`} onClick={() => setActiveSort('FASTEST')}>
                  <div className="sort-icon"><Zap size={16} /></div>
                  <div><h4>FASTEST</h4><p>CAD 1,383 · 18h</p></div>
                </div>
                <div className={`sort-card ${activeSort === 'YOU MAY PREFER' ? 'active' : ''}`} onClick={() => setActiveSort('YOU MAY PREFER')}>
                  <div className="sort-icon"><Star size={16} /></div>
                  <div><h4>YOU MAY PREFER</h4><p>CAD 1,383 · 18h</p></div>
                </div>
                <div className="sort-card">
                  <div className="sort-icon"><Menu size={16} /></div>
                  <div><h4>OTHER SORT</h4></div>
                </div>
              </div>

              <h3 className="sort-header">Flights sorted by popularity (based on price, duration and convenience)</h3>

              <div className="flight-results" style={{ gap: '18px' }}>
                {displayedFlights.map((f) => (
                  <div key={f.id}>
                    <div className="flight-group-header">
                      <img src={f.logo} alt="" />
                      <h4>{f.airline} Flight</h4>
                    </div>
                    <FlightCard flight={f} onBookNow={handleBookNow} />
                  </div>
                ))}
                {displayedFlights.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px' }}>
                    <p style={{ color: '#64748b' }}>No flights match your filters.</p>
                  </div>
                )}
              </div>

              <section className="content-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h3>Live Flights Near You</h3>
                  <button type="button" className="sort-chip" onClick={fetchLiveFlightsNearMe} disabled={liveLoading}>
                    {liveLoading ? 'Locating & Loading...' : 'Use My Location'}
                  </button>
                </div>
                <p style={{ color: '#64748b', marginTop: 8, marginBottom: 12 }}>
                  Real-time aircraft data from OpenSky Network.
                  {liveSummary ? ` Current point: ${liveSummary}` : ''}
                </p>

                {liveError ? (
                  <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', color: '#be123c', borderRadius: 12, padding: 12 }}>
                    {liveError}
                  </div>
                ) : null}

                {!liveError && liveFlights.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                      <thead>
                        <tr style={{ background: '#eef2ff' }}>
                          {['Callsign', 'Country', 'Latitude', 'Longitude', 'Altitude', 'Speed', 'Status'].map((h) => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: '#334155', fontSize: '0.84rem' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {liveFlights.map((f) => (
                          <tr key={f.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>{f.callsign}</td>
                            <td style={{ padding: '10px 12px' }}>{f.country}</td>
                            <td style={{ padding: '10px 12px' }}>{f.latitude}</td>
                            <td style={{ padding: '10px 12px' }}>{f.longitude}</td>
                            <td style={{ padding: '10px 12px' }}>{f.altitude}</td>
                            <td style={{ padding: '10px 12px' }}>{f.velocity}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span className={`badge ${f.onGround ? 'badge-warning' : 'badge-success'}`}>
                                {f.onGround ? 'On Ground' : 'Airborne'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>

              <section className="content-block">
                <h3>Popular Routes From {form.from}</h3>
                <div className="route-grid">
                  {POPULAR_ROUTES.map((route) => (
                    <article key={`${route.from}-${route.to}`} className="route-card">
                      <p>{route.from} -> {route.to}</p>
                      <strong>from {route.price}</strong>
                    </article>
                  ))}
                </div>
              </section>

              <section className="content-block">
                <h3>Travel Tips Before You Book</h3>
                <div className="tips-list">
                  {TRAVEL_NOTES.map((note) => (
                    <div key={note} className="tip-item">{note}</div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
