import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('tm_user') || 'null'),
  token: localStorage.getItem('tm_token'),
  isAuthenticated: !!localStorage.getItem('tm_token'),

  login: (user, token) => {
    localStorage.setItem('tm_token', token);
    localStorage.setItem('tm_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem('tm_user', JSON.stringify(user));
    set({ user });
  },
}));

export const useSearchStore = create((set) => ({
  flightSearch: null,
  hotelSearch: null,
  selectedFlight: null,
  selectedHotel: null,
  setFlightSearch: (data) => set({ flightSearch: data }),
  setHotelSearch: (data) => set({ hotelSearch: data }),
  setSelectedFlight: (flight) => set({ selectedFlight: flight }),
  setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
  clearSearch: () => set({ flightSearch: null, hotelSearch: null, selectedFlight: null, selectedHotel: null }),
}));

export const useBookingStore = create((set) => ({
  currentBooking: null,
  bookings: [],
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set((s) => ({ bookings: [booking, ...s.bookings] })),
}));
