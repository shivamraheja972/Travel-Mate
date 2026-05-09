import { supabase } from '../config/supabase';

const MOCK_DB_KEY = 'tm_mock_db_v1';

const isSupabaseConfigured = () => {
  const url = process.env.REACT_APP_SUPABASE_URL || '';
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
  return !!url && !!key && !url.includes('placeholder') && !key.includes('placeholder');
};

const nowIso = () => new Date().toISOString();

const readMockDb = () => {
  const raw = localStorage.getItem(MOCK_DB_KEY);
  if (!raw) {
    return { users: [], bookings: [] };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    };
  } catch {
    return { users: [], bookings: [] };
  }
};

const writeMockDb = (db) => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
};

const toPublicUser = (u) => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName || '',
  lastName: u.lastName || '',
  phone: u.phone || '',
  role: u.role || 'user',
});

const randomCode = (length = 10) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

export const generateBookingId = () => `TM${randomCode(10)}`;

export async function registerUser({ firstName, lastName, email, phone, password }) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || '',
        },
      },
    });
    if (error) throw error;
    return { requiresEmailVerification: !data.session, user: data.user };
  }

  const db = readMockDb();
  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || '',
    role: db.users.length === 0 ? 'admin' : 'user',
    password,
    created_at: nowIso(),
  };

  db.users.unshift(user);
  writeMockDb(db);
  return { requiresEmailVerification: false, user };
}

export async function loginUser({ email, password }) {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;
    const profile = await getProfileById(data.user.id).catch(() => null);
    return {
      id: data.user.id,
      email: data.user.email,
      firstName: profile?.first_name || data.user.user_metadata?.first_name || '',
      lastName: profile?.last_name || data.user.user_metadata?.last_name || '',
      phone: profile?.phone || data.user.user_metadata?.phone || '',
      role: profile?.role || 'user',
    };
  }

  const db = readMockDb();
  const found = db.users.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
  if (!found) throw new Error('Invalid email or password. Please try again.');
  return toPublicUser(found);
}

export async function createBooking({ userId, bookingType, flightDetails, hotelDetails, price, specialRequests }) {
  if (!userId) throw new Error('Please login before creating a booking.');

  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    const record = {
      id: crypto.randomUUID(),
      booking_id: generateBookingId(),
      user_id: userId,
      booking_type: bookingType,
      flight_details: flightDetails || null,
      hotel_details: hotelDetails || null,
      price: price || {},
      payment: { status: 'pending' },
      special_requests: specialRequests || null,
      status: 'pending',
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    db.bookings.unshift(record);
    writeMockDb(db);
    return record;
  }

  const payload = {
    booking_id: generateBookingId(),
    user_id: userId,
    booking_type: bookingType,
    flight_details: flightDetails || null,
    hotel_details: hotelDetails || null,
    price: price || {},
    payment: { status: 'pending' },
    special_requests: specialRequests || null,
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
  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    const idx = db.bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    const current = db.bookings[idx];
    const updated = {
      ...current,
      payment: {
        ...(current.payment || {}),
        method: paymentMethod || 'card',
        paymentId: paymentIntentId || `demo-${Date.now()}`,
        status: 'completed',
        paidAt: nowIso(),
      },
      status: 'confirmed',
      updated_at: nowIso(),
    };
    db.bookings[idx] = updated;
    writeMockDb(db);
    return updated;
  }

  const { data: booking, error: findError } = await supabase
    .from('bookings')
    .select('payment')
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
  const { data, error } = await supabase
    .from('bookings')
    .update({ payment, status: 'confirmed' })
    .eq('id', bookingId)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getBookingById(id) {
  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    return db.bookings.find((b) => b.id === id) || null;
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileById(id) {
  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) throw new Error('Profile not found');
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone || null,
      role: user.role || 'user',
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getUserBookings(userId) {
  if (!userId) return [];
  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    return db.bookings
      .filter((b) => b.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAdminDashboardData() {
  let bookings = [];
  let users = [];

  if (!isSupabaseConfigured()) {
    const db = readMockDb();
    bookings = db.bookings;
    users = db.users.map((u) => ({
      id: u.id,
      first_name: u.firstName,
      last_name: u.lastName,
      email: u.email,
      role: u.role || 'user',
      created_at: u.created_at,
      is_active: true,
    }));
  } else {
    const [{ data: b, error: bookingsError }, { data: u, error: usersError }] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    if (bookingsError) throw bookingsError;
    if (usersError) throw usersError;
    bookings = b || [];
    users = u || [];
  }

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
    isActive: u.is_active !== false,
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
