import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/store';
import { Plane, ArrowRightLeft, Calendar, User, Search, ChevronDown, CheckCircle2 } from 'lucide-react';

const destinations = [
  { city: 'Tokyo', date: '24 Dec 2025 - 07 Jan 2026', price: 'USD $450', img: '/images/tokyo.png' },
  { city: 'New York', date: '24 Dec 2025 - 07 Jan 2026', price: 'USD $249', img: '/images/newyork.png' },
  { city: 'Dubai', date: '24 Dec 2025 - 07 Jan 2026', price: 'USD $310', img: '/images/dubai.png' },
  { city: 'Paris', date: '10 Feb 2026 - 20 Feb 2026', price: 'USD $550', img: 'https://images.unsplash.com/photo-1502602881469-44781cf434e3?auto=format&fit=crop&w=900&q=80' },
  { city: 'London', date: '15 Mar 2026 - 25 Mar 2026', price: 'USD $420', img: 'https://images.unsplash.com/photo-1513635269975-5969336ac1fc?auto=format&fit=crop&w=900&q=80' },
  { city: 'Sydney', date: '05 Apr 2026 - 15 Apr 2026', price: 'USD $680', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80' }
];

const flights = [
  { airline: 'Turkish Airlines', code: 'GI 2023', class: 'Business', depart: '06:00', arrive: '07:40', duration: '1h 40m', stops: 'Direct', from: 'Jakarta', to: 'Jakarta', price: 380.50, oldPrice: 380.50, logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&w=64&h=64&q=80' },
  { airline: 'Emirates Airlines', code: 'GI 2023', class: 'Business', depart: '06:00', arrive: '07:40', duration: '1h 40m', stops: 'Direct', from: 'Jakarta', to: 'Jakarta', price: 380.50, logo: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?auto=format&fit=crop&w=64&h=64&q=80' }
];

const airlines = [
  'Emirates', 'Singapore Airlines', 'Turkish Airlines',
  'Qatar Airways', 'Malaysia Airlines', 'Etihad Airways',
  'Cathay Pacific', 'Himalaya Airlines', 'Saudia Airlines'
];

export default function Home() {
  const navigate = useNavigate();
  const { setFlightSearch } = useSearchStore();
  const [tripType, setTripType] = useState('one-way');
  const [form, setForm] = useState({
    from: 'Jakarta',
    to: 'Jakarta',
    departDate: '2025-12-04',
    passengers: 2,
    children: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setFlightSearch({
      from: form.from,
      to: form.to,
      departDate: form.departDate,
      passengers: form.passengers,
      class: 'economy',
    });
    navigate('/flights');
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Smart Flight Finder</h1>
          <p className="hero-subtitle">
            Discover a smarter way to fly — easy booking, reliable service, and a journey designed around your comfort.
          </p>
          <img src="/images/hero_airplane_1777682199094.png" alt="Airplane" className="hero-plane-img" />
        </div>
      </section>

      {/* Flight Search Widget */}
      <div className="search-widget-container">
        <div className="search-widget-top">
          <div className="trip-types">
            <label className={`trip-type-label ${tripType === 'one-way' ? 'active' : ''}`}>
              <input type="radio" checked={tripType === 'one-way'} onChange={() => setTripType('one-way')} />
              One Way
            </label>
            <label className={`trip-type-label ${tripType === 'multi' ? 'active' : ''}`}>
              <input type="radio" checked={tripType === 'multi'} onChange={() => setTripType('multi')} />
              Multicity
            </label>
            <label className={`trip-type-label ${tripType === 'round' ? 'active' : ''}`}>
              <input type="radio" checked={tripType === 'round'} onChange={() => setTripType('round')} />
              Round Trip
            </label>
          </div>
          <div className="class-selector">
            Select Class <ChevronDown size={16} />
          </div>
        </div>

        <form onSubmit={handleSearch} className="search-inputs-grid">
          <div className="search-input-group">
            <label><Plane size={14} /> Departure City</label>
            <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
          </div>
          
          <div className="search-input-group">
            <label><Plane size={14} style={{ transform: 'rotate(90deg)' }} /> Arrival City</label>
            <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          </div>
          
          <div className="search-input-group">
            <label><Calendar size={14} /> Departure - Return</label>
            <input type="date" value={form.departDate} onChange={(e) => setForm({ ...form, departDate: e.target.value })} />
          </div>
          
          <div className="search-input-group">
            <label><User size={14} /> Traveler</label>
            <select value={form.passengers} onChange={(e) => setForm({ ...form, passengers: e.target.value })}>
              <option value="1">1 Adult</option>
              <option value="2">2 Adults, 1 Child</option>
              <option value="3">3 Adults</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            <Search size={18} /> Search
          </button>
        </form>
      </div>

      {/* Top Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Top Destinations</h2>
            <p className="section-subtitle">Get Exclusive Flight Deals To Your Favorite Cities.</p>
          </div>
        </div>
        <div className="destinations-slider-wrapper">
          <div className="destinations-grid">
            {destinations.map((dest, i) => (
              <div key={i} className="destination-card" style={{ backgroundImage: `url(${dest.img})` }}>
                <div className="destination-overlay">
                  <div className="dest-info">
                    <h3>{dest.city}</h3>
                    <p>{dest.date}</p>
                  </div>
                  <div className="dest-price">
                    <span>Economy From</span>
                    <strong>{dest.price}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Perfect Flight */}
      <section className="perfect-flight-section container">
        <div className="perfect-flight-left">
          <div className="perfect-flight-header">
            <h2>Choose Your Perfect Flight</h2>
          </div>
          <aside className="filters-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-btn">Reset</button>
            </div>
            
            <div className="filter-group">
              <h4 className="filter-title">Price</h4>
              <div className="range-slider-wrapper">
                <input type="range" className="range-slider" min="0" max="1000" defaultValue="450" />
              </div>
            </div>

            <div className="filter-group">
              <h4 className="filter-title">Airlines</h4>
              <div className="checkbox-list">
                <label className="checkbox-item"><input type="checkbox" /> All</label>
                <label className="checkbox-item"><input type="checkbox" defaultChecked /> Emirates</label>
                <label className="checkbox-item"><input type="checkbox" /> Cathay Pacific</label>
              </div>
            </div>
          </aside>
        </div>

        <div className="perfect-flight-right">
          <div className="perfect-flight-header" style={{ justifyContent: 'flex-end' }}>
            <label className="offer-toggle">
              <input type="checkbox" style={{ accentColor: 'var(--brand-blue)', width: 36, height: 20 }} defaultChecked />
              Offer
            </label>
          </div>

          <div className="flight-results">
            {flights.map((flight, i) => (
              <div key={i} className="flight-card">
                <div className="flight-airline">
                  <img src={flight.logo} alt={flight.airline} />
                  <div>
                    <h4>{flight.airline}</h4>
                    <p>{flight.code} <span className="class-badge">{flight.class}</span></p>
                  </div>
                </div>

                <div className="flight-time-info">
                  <div className="time-block">
                    <h4>{flight.depart}</h4>
                    <p>{flight.from}</p>
                  </div>
                  
                  <div className="duration-block">
                    <Plane size={16} />
                    <div className="duration-line"></div>
                    <span>{flight.duration} · {flight.stops}</span>
                  </div>

                  <div className="time-block">
                    <h4>{flight.arrive}</h4>
                    <p>{flight.to}</p>
                  </div>
                </div>

                <div className="flight-price-action">
                  <h3><span>USD</span> {flight.price.toFixed(2)} <span>/Pax</span></h3>
                  {flight.oldPrice && <s>USD {flight.oldPrice.toFixed(2)}</s>}
                  <button className="choose-flight-btn">Choose Flight</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banners Section */}
      <section className="container">
        <div className="banners-grid">
          <div className="banners-left">
            <div className="banner banner-student" style={{ backgroundImage: `url(/images/student_banner_1777682217594.png)` }}>
              <h3>Exclusive Student Flight Discounts!</h3>
              <button className="banner-btn">Book Student Flight</button>
            </div>
            <div className="banner banner-smooth" style={{ backgroundImage: `url(/images/beach_banner_1777682230365.png)` }}>
              <h3>Smooth Flights<br/>Smart Choices</h3>
              <button className="banner-btn">Endless Destinations</button>
            </div>
          </div>
          <div className="banner banner-tall" style={{ backgroundImage: `url(/images/dream_banner_1777682241634.png)` }}>
            <h3>Fly To Your Dream Destination</h3>
            <p>Discover exclusive deals and hassle-free booking for every journey.</p>
            <button className="banner-btn" style={{ marginTop: 'auto' }}>Explore Deals</button>
          </div>
        </div>
      </section>

      {/* Airlines Grid */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">Most Popular Airlines</h2>
          <p className="section-subtitle">Discover Top Airlines On ShareTrip And Seamlessly Search Any Flight.</p>
        </div>
        <div className="airlines-grid">
          {airlines.map((airline, i) => (
            <div key={i} className="airline-pill-btn">
              <div className="airline-pill-left">
                <div style={{ width: 24, height: 24, background: '#f1f5f9', borderRadius: '50%' }}></div>
                {airline}
              </div>
              <ArrowRightLeft size={16} color="#94a3b8" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Travelers Say</h2>
          <p className="section-subtitle">Hear Real Stories From Passengers Who Found The Best Deals.</p>
        </div>
        <div className="container">
          <div className="testimonial-container">
            <div className="testimonial-logos">
              <div className="testimonial-logo active">
                <div style={{ width: 28, height: 28, background: '#cbd5e1', borderRadius: '50%' }}></div>
                Rakib Kowshar
              </div>
              <div className="testimonial-logo">
                <CheckCircle2 size={24} /> Delisas.com
              </div>
              <div className="testimonial-logo">
                <div style={{ width: 28, height: 28, background: '#cbd5e1', borderRadius: '50%' }}></div>
                Michael R.
              </div>
            </div>
            
            <p className="testimonial-quote">
              "Booking my flights has never been easier! I found the best deals, and the booking process was super smooth. Thanks to this platform, my vacation to Paris was stress-free and unforgettable."
            </p>
            
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=48&h=48&q=80" alt="Rakib Kowshar" />
              <div>
                <h5>Rakib Kowshar</h5>
                <p>www.Delisas.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
