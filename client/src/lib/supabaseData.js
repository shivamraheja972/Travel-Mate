import { supabase } from '../config/supabase';

const randomCode = (length = 10) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const generateBookingId = () => `TM${randomCode(10)}`;

export async function createBooking({ userId, bookingType, flightDetails, hotelDetails, price, specialRequests }) {
  const payload = {
    booking_id: generateBookingId(),
    user_id: userId,
    booking_type: bookingType,
    flight_details: flightDetails || null,
    hotel_details: hotelDetails || null,
    price: price || {},
    payment: { status: 'pending' },
    special_requests: specialRequests || null,
    timeline: [{ event: 'Booking created', timestamp: new Date().toISOString() }],
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function confirmBookingPayment({ bookingId, paymentMethod, paymentIntentId }) {
  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('payment, timeline')
    .eq('id', bookingId)
    .single();
  if (findError) throw findError;

  const payment = {
    ...(booking?.payment || {}),
    method: paymentMethod || 'stripe',
    paymentId: paymentIntentId || `demo-${Date.now()}`,
    status: 'completed',
    paidAt: new Date().toISOString(),
  };
  const timeline = [
    ...(booking?.timeline || []),
    { event: 'Payment confirmed', timestamp: new Date().toISOString() },
  ];

  const { data, error } = await supabase
    .from('bookings')
    .update({ payment, status: 'confirmed', timeline })
    .eq('id', bookingId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getBookingById(id) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileById(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getAdminDashboardData() {
  const [{ data: bookings, error: bookingsError }, { data: users, error: usersError }] = await Promise.all([
    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ]);
  if (bookingsError) throw bookingsError;
  if (usersError) throw usersError;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === 'confirmed').length,
    cancelledBookings: bookings.filter((b) => b.status === 'cancelled').length,
    totalUsers: users.filter((u) => u.role === 'user').length,
    totalRevenue: bookings.reduce((sum, b) => {
      if (b.payment?.status !== 'completed') return sum;
      return sum + (b.price?.totalPrice || b.price?.total_price || 0);
    }, 0),
    todayBookings: bookings.filter((b) => new Date(b.created_at) >= today).length,
  };

  const userMap = new Map(users.map((u) => [u.id, u]));
  const bookingsWithUser = bookings.map((b) => ({
    ...b,
    bookingId: b.booking_id,
    bookingType: b.booking_type,
    createdAt: b.created_at,
    user: userMap.get(b.user_id)
      ? {
          firstName: userMap.get(b.user_id).first_name,
          lastName: userMap.get(b.user_id).last_name,
          email: userMap.get(b.user_id).email,
        }
      : null,
  }));

  const mappedUsers = users.map((u) => ({
    ...u,
    _id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    createdAt: u.created_at,
    isActive: u.is_active,
  }));

  return { stats, bookings: bookingsWithUser, users: mappedUsers };
}

const getMockHotels = (city, checkIn, checkOut, rooms = 1) => {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1;
  return [
    {
      id: `hotel-1-${Date.now()}`,
      name: 'The Grand Palace Hotel',
      address: `123 Main Blvd, ${city}`,
      city,
      rating: 4.8,
      reviewCount: 2341,
      stars: 5,
      pricePerNight: 280,
      totalPrice: 280 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      amenities: ['WiFi', 'Pool', 'Spa', 'Gym'],
      roomTypes: ['Deluxe King', 'Suite'],
      breakfast: true,
      refundable: true,
      description: 'Luxury 5-star hotel in the heart of the city.',
      checkIn: '15:00',
      checkOut: '11:00',
    },
    {
      id: `hotel-2-${Date.now()}`,
      name: 'Comfort Inn & Suites',
      address: `456 Park Ave, ${city}`,
      city,
      rating: 4.3,
      reviewCount: 876,
      stars: 4,
      pricePerNight: 120,
      totalPrice: 120 * nights * rooms,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
      amenities: ['WiFi', 'Gym', 'Parking'],
      roomTypes: ['Standard Queen', 'Deluxe Double'],
      breakfast: false,
      refundable: true,
      description: 'Modern 4-star hotel with excellent value.',
      checkIn: '14:00',
      checkOut: '12:00',
    },
  ];
};

export async function searchHotels(form) {
  const { city, checkIn, checkOut, guests = 2, rooms = 1 } = form;
  return getMockHotels(city, checkIn, checkOut, guests, rooms);
}
