import { create } from 'zustand';
import { supabase } from '../config/supabase';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('tm_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('tm_user'),

  login: (user) => {
    localStorage.setItem('tm_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase sign out error:', error);
    }
    localStorage.removeItem('tm_user');
    set({ user: null, isAuthenticated: false });
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
