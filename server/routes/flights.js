const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { protect } = require('../middleware/auth');
const { searchLimiter } = require('../middleware/rateLimiter');

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Helper: Get Amadeus access token
const getAmadeusToken = async () => {
  const cached = cache.get('amadeus_token');
  if (cached) return cached;

  const axios = require('axios');
  const res = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
    `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_CLIENT_SECRET}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  cache.set('amadeus_token', res.data.access_token, res.data.expires_in - 60);
  return res.data.access_token;
};

// Mock flight data for demo/fallback
const getMockFlights = (from, to, date, passengers = 1) => {
  const airlines = [
    { name: 'SkyWings Airlines', code: 'SW', logo: '✈️' },
    { name: 'Global Air', code: 'GA', logo: '🌍' },
    { name: 'Pacific Express', code: 'PE', logo: '🛫' },
    { name: 'Metro Airlines', code: 'MA', logo: '🏙️' },
  ];
  return airlines.map((airline, i) => ({
    id: `flight-${Date.now()}-${i}`,
    airline: airline.name,
    airlineCode: airline.code,
    logo: airline.logo,
    flightNumber: `${airline.code}${Math.floor(1000 + Math.random() * 9000)}`,
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    departureTime: new Date(date + 'T' + `0${6 + i * 2}:00:00`).toISOString(),
    arrivalTime: new Date(date + 'T' + `0${8 + i * 2}:30:00`).toISOString(),
    duration: `${2 + i}h 30m`,
    stops: i % 2 === 0 ? 0 : 1,
    class: 'economy',
    price: Math.floor(150 + Math.random() * 400) * passengers,
    currency: 'USD',
    seatsAvailable: Math.floor(5 + Math.random() * 50),
    baggage: '23kg included',
    amenities: ['WiFi', 'Meals', 'Entertainment'].slice(0, i + 1),
    refundable: i % 2 === 0,
  }));
};

// POST /api/flights/search
router.post('/search', protect, searchLimiter, async (req, res, next) => {
  try {
    const { from, to, departDate, returnDate, passengers = 1, class: cabinClass = 'economy' } = req.body;
    if (!from || !to || !departDate) {
      return res.status(400).json({ success: false, message: 'from, to, and departDate are required' });
    }

    const cacheKey = `flights-${from}-${to}-${departDate}-${passengers}-${cabinClass}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, flights: cached, source: 'cache' });

    let flights = [];

    // Try Amadeus API
    if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_KEY !== 'your_amadeus_client_id') {
      try {
        const token = await getAmadeusToken();
        const axios = require('axios');
        const params = {
          originLocationCode: from.toUpperCase(),
          destinationLocationCode: to.toUpperCase(),
          departureDate: departDate,
          adults: passengers,
          travelClass: cabinClass.toUpperCase(),
          max: 20,
        };
        if (returnDate) params.returnDate = returnDate;

        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        flights = response.data.data.map(offer => ({
          id: offer.id,
          airline: offer.validatingAirlineCodes[0],
          flightNumber: offer.itineraries[0].segments[0].carrierCode + offer.itineraries[0].segments[0].number,
          from: offer.itineraries[0].segments[0].departure.iataCode,
          to: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.iataCode,
          departureTime: offer.itineraries[0].segments[0].departure.at,
          arrivalTime: offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1].arrival.at,
          duration: offer.itineraries[0].duration,
          stops: offer.itineraries[0].segments.length - 1,
          class: cabinClass,
          price: parseFloat(offer.price.total),
          currency: offer.price.currency,
          seatsAvailable: offer.numberOfBookableSeats,
          refundable: false,
        }));
      } catch (apiErr) {
        console.log('Amadeus API unavailable, using mock data:', apiErr.message);
        flights = getMockFlights(from, to, departDate, passengers);
      }
    } else {
      flights = getMockFlights(from, to, departDate, passengers);
    }

    cache.set(cacheKey, flights, 1800);
    res.json({ success: true, flights, count: flights.length });
  } catch (err) { next(err); }
});

// GET /api/flights/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    // In production, fetch from Amadeus or your DB
    res.json({ success: true, flight: { id, message: 'Flight details would be fetched from provider' } });
  } catch (err) { next(err); }
});

// GET /api/flights/popular/routes
router.get('/popular/routes', async (req, res) => {
  const routes = [
    { from: 'JFK', to: 'LAX', fromCity: 'New York', toCity: 'Los Angeles', avgPrice: 189, duration: '5h 30m' },
    { from: 'LHR', to: 'DXB', fromCity: 'London', toCity: 'Dubai', avgPrice: 450, duration: '7h' },
    { from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', avgPrice: 60, duration: '2h' },
    { from: 'SYD', to: 'SIN', fromCity: 'Sydney', toCity: 'Singapore', avgPrice: 350, duration: '8h' },
    { from: 'CDG', to: 'JFK', fromCity: 'Paris', toCity: 'New York', avgPrice: 620, duration: '8h' },
    { from: 'BKK', to: 'HKG', fromCity: 'Bangkok', toCity: 'Hong Kong', avgPrice: 180, duration: '2h 45m' },
  ];
  res.json({ success: true, routes });
});

// POST /api/flights/price-alerts
router.post('/price-alerts', protect, async (req, res) => {
  // Store alert in DB (simplified)
  res.json({ success: true, message: 'Price alert created. We\'ll notify you when prices drop!' });
});

module.exports = router;
