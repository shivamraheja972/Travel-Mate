const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const { protect } = require('../middleware/auth');
const { searchLimiter } = require('../middleware/rateLimiter');

const cache = new NodeCache({ stdTTL: 3600 });

const getMockHotels = (city, checkIn, checkOut, guests = 2, rooms = 1) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1;
  const hotels = [
    {
      id: `hotel-1-${Date.now()}`,
      name: 'The Grand Palace Hotel',
      address: `123 Main Blvd, ${city}`,
      city, country: 'US',
      rating: 4.8, reviewCount: 2341,
      stars: 5,
      pricePerNight: 280,
      totalPrice: 280 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      images: [],
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 'Concierge'],
      roomTypes: ['Deluxe King', 'Suite', 'Presidential Suite'],
      breakfast: true,
      refundable: true,
      description: 'Luxury 5-star hotel in the heart of the city with world-class amenities.',
      checkIn: '15:00', checkOut: '11:00',
    },
    {
      id: `hotel-2-${Date.now()}`,
      name: 'Comfort Inn & Suites',
      address: `456 Park Ave, ${city}`,
      city, country: 'US',
      rating: 4.3, reviewCount: 876,
      stars: 4,
      pricePerNight: 120,
      totalPrice: 120 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
      images: [],
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Parking', 'Business Center'],
      roomTypes: ['Standard Queen', 'Deluxe Double'],
      breakfast: false,
      refundable: true,
      description: 'Modern 4-star hotel offering excellent value for business and leisure travelers.',
      checkIn: '14:00', checkOut: '12:00',
    },
    {
      id: `hotel-3-${Date.now()}`,
      name: 'Boutique Nest',
      address: `789 Heritage St, ${city}`,
      city, country: 'US',
      rating: 4.6, reviewCount: 523,
      stars: 4,
      pricePerNight: 165,
      totalPrice: 165 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
      images: [],
      amenities: ['WiFi', 'Pool', 'Restaurant', 'Garden', 'Bike Rental'],
      roomTypes: ['Garden View', 'City View', 'Terrace Suite'],
      breakfast: true,
      refundable: false,
      description: 'Charming boutique hotel with unique character and personalized service.',
      checkIn: '15:00', checkOut: '11:00',
    },
    {
      id: `hotel-4-${Date.now()}`,
      name: 'Budget Stay Express',
      address: `101 Economy Rd, ${city}`,
      city, country: 'US',
      rating: 3.9, reviewCount: 1204,
      stars: 3,
      pricePerNight: 55,
      totalPrice: 55 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
      images: [],
      amenities: ['WiFi', 'Parking', 'Laundry'],
      roomTypes: ['Standard Twin', 'Standard Double'],
      breakfast: false,
      refundable: true,
      description: 'Clean, comfortable rooms at budget-friendly prices.',
      checkIn: '13:00', checkOut: '11:00',
    },
  ];
  return hotels;
};

// POST /api/hotels/search
router.post('/search', protect, searchLimiter, async (req, res, next) => {
  try {
    const { city, checkIn, checkOut, guests = 2, rooms = 1, minPrice, maxPrice, stars } = req.body;
    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'city, checkIn, and checkOut are required' });
    }

    const cacheKey = `hotels-${city}-${checkIn}-${checkOut}-${guests}-${rooms}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ success: true, hotels: cached, source: 'cache' });

    let hotels = getMockHotels(city, checkIn, checkOut, guests, rooms);

    // Apply filters
    if (minPrice) hotels = hotels.filter(h => h.pricePerNight >= minPrice);
    if (maxPrice) hotels = hotels.filter(h => h.pricePerNight <= maxPrice);
    if (stars) hotels = hotels.filter(h => h.stars === parseInt(stars));

    cache.set(cacheKey, hotels, 1800);
    res.json({ success: true, hotels, count: hotels.length });
  } catch (err) { next(err); }
});

// GET /api/hotels/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    res.json({ success: true, hotel: { id: req.params.id, message: 'Full hotel details' } });
  } catch (err) { next(err); }
});

// GET /api/hotels/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const reviews = [
    { user: 'Alice M.', rating: 5, comment: 'Absolutely amazing stay! Will return.', date: '2024-01-15' },
    { user: 'Bob K.', rating: 4, comment: 'Great location and friendly staff.', date: '2024-01-10' },
    { user: 'Carol T.', rating: 5, comment: 'Outstanding service and beautiful rooms.', date: '2024-01-05' },
  ];
  res.json({ success: true, reviews, count: reviews.length });
});

// GET /api/hotels/popular/destinations
router.get('/popular/destinations', async (req, res) => {
  const destinations = [
    { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', avgPrice: 80, rating: 4.8 },
    { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', avgPrice: 200, rating: 4.7 },
    { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', avgPrice: 150, rating: 4.9 },
    { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', avgPrice: 250, rating: 4.6 },
    { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', avgPrice: 180, rating: 4.7 },
    { city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=400', avgPrice: 220, rating: 4.9 },
  ];
  res.json({ success: true, destinations });
});

module.exports = router;
