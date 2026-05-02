import React, { useState } from 'react';
import { ChevronDown, Info, Lock } from 'lucide-react';

export default function FlightCard({ flight }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="adv-flight-card">
      <div className="flight-tags">
        <div className="tag-left">{flight.tags[0] || 'Transit Visa may be required'}</div>
        <div className="tag-right">{flight.tags[1] || 'MMTINTLCA coupon applied'} <Info size={12} /></div>
      </div>

      <div className="adv-flight-main">
        <div className="flight-airline">
          <img src={flight.logo} alt={flight.airline} />
          <div>
            <h4>{flight.airline}</h4>
            <p>{flight.code}</p>
          </div>
        </div>

        <div className="flight-time-info">
          <div className="time-block">
            <h4>{flight.depart}</h4>
            <p>{flight.departCity}</p>
            <small>{flight.departCode}</small>
          </div>
          
          <div className="duration-block">
            <span>{flight.duration}</span>
            <div className="duration-line-container">
              <div className="duration-line"></div>
            </div>
            <span>{flight.stops}</span>
          </div>

          <div className="time-block">
            <h4>{flight.arrive} <sup className="plus-day">{flight.plusDay}</sup></h4>
            <p>{flight.arriveCity}</p>
            <small>{flight.arriveCode}</small>
          </div>
        </div>

        <div className="flight-price-action">
          {flight.oldPrice && <s>CAD {flight.oldPrice}</s>}
          <h3><span>CAD</span> {flight.price}</h3>
          <button className="book-now-btn">BOOK NOW</button>
        </div>
      </div>

      {flight.price < 1350 ? null : (
        <div className="lock-price-banner">
          <Lock size={12} /> Lock this price for 4 hours at CAD 26.74 →
        </div>
      )}

      {flight.alternatives && flight.alternatives.length > 0 && (
        <div className="flight-alternatives">
          <div className="view-details-link">View Flight Details</div>
          
          {expanded && (
            <div className="alternatives-list">
              {flight.alternatives.map((alt, idx) => (
                <div key={idx} className="alt-row">
                  <div className="alt-airline"><img src={flight.logo} alt="" style={{width: 16, height: 16, borderRadius: '50%'}} /> {alt.airline}</div>
                  <div className="alt-times">{alt.times} <span>{alt.duration}</span></div>
                  <div className="alt-price">CAD {alt.price}</div>
                </div>
              ))}
            </div>
          )}

          <div className="view-all-wrapper">
            <button className="view-all-btn" onClick={() => setExpanded(!expanded)}>
              VIEW ALL ({flight.alternatives.length}) <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
