import React, { useMemo, useState } from 'react';
import FlightCard from '../components/FlightCard';
import Loading from '../components/Loading';
import { useSearchStore } from '../store/store';
import { useToast } from '../components/Toast';
import { ChevronLeft, ChevronRight, Zap, Star, Menu, Plane } from 'lucide-react';

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

export default function Flights() {
  const { flightSearch, setFlightSearch } = useSearchStore();
  const { error: showError } = useToast();
  const [flights, setFlights] = useState(MOCK_FLIGHTS);
  const [loading, setLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [searched, setSearched] = useState(true);
  const [activeSort, setActiveSort] = useState('YOU MAY PREFER');
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

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!form.from || !form.to || !form.departDate) {
      showError('Please fill in origin, destination, and date');
      return;
    }
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      setFlights(MOCK_FLIGHTS.map((f) => ({ ...f, departCity: form.from, arriveCity: form.to })));
      setFlightSearch(form);
      setLoading(false);
    }, 800);
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

          const res = await fetch(
            `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`
          );

          if (!res.ok) {
            throw new Error(`Live API request failed (${res.status})`);
          }

          const payload = await res.json();
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
                  <label className="checkbox-item"><span><input type="checkbox" /> Morning Departures (30)</span><span className="price-tag">CAD 1,212</span></label>
                  <label className="checkbox-item"><span><input type="checkbox" /> Late Departures (36)</span><span className="price-tag">CAD 1,251</span></label>
                  <label className="checkbox-item"><span><input type="checkbox" /> Hide Nearby Airports (111)</span><span className="price-tag">CAD 1,204</span></label>
                  <label className="checkbox-item"><span><input type="checkbox" /> 1 Stop (64)</span><span className="price-tag">CAD 1,205</span></label>
                  <button className="link-btn">+ 2 more</button>
                </div>
              </div>

              <div className="adv-filter-box">
                <h4>Departure Airports</h4>
                <div className="checkbox-list">
                  <label className="checkbox-item"><span><input type="checkbox" /> Pearson Intl-ON</span><span className="price-tag">CAD 1,205</span></label>
                  <label className="checkbox-item"><span><input type="checkbox" /> Toronto Island-ON (21Km)</span><span className="price-tag">CAD 1,474</span></label>
                </div>
              </div>
            </aside>

            <div className="adv-main-content">
              <h2 className="adv-page-title">Flights from {form.from} to {form.to}</h2>

              <div className="date-carousel">
                <button className="nav-arrow"><ChevronLeft size={18} /></button>
                <div className="date-items">
                  <div className="date-item active"><strong>Sat, May 2</strong><span>View</span></div>
                  <div className="date-item"><strong>Sun, May 3</strong><span>View</span></div>
                  <div className="date-item"><strong>Mon, May 4</strong><span>View</span></div>
                  <div className="date-item"><strong>Tue, May 5</strong><span>View</span></div>
                  <div className="date-item"><strong>Wed, May 6</strong><span>View</span></div>
                  <div className="date-item"><strong>Thu, May 7</strong><span>View</span></div>
                  <div className="date-item"><strong>Fri, May 8</strong><span>View</span></div>
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
                {flights.map((f) => (
                  <div key={f.id}>
                    <div className="flight-group-header">
                      <img src={f.logo} alt="" />
                      <h4>Flights with similar prices</h4>
                    </div>
                    <FlightCard flight={f} />
                  </div>
                ))}
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
