const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, default: () => 'TM' + uuidv4().replace(/-/g, '').slice(0, 10).toUpperCase() },
  bookingType: { type: String, enum: ['flight', 'hotel', 'flight+hotel'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightDetails: {
    flightNumber: String,
    airline: String,
    from: String,
    to: String,
    departureTime: Date,
    arrivalTime: Date,
    class: { type: String, enum: ['economy', 'business', 'first'] },
    passengers: [{
      firstName: String, lastName: String, passportNumber: String,
      dateOfBirth: Date, nationality: String, seatNumber: String,
    }],
    baggage: String,
    pnr: String,
  },
  hotelDetails: {
    hotelId: String,
    hotelName: String,
    address: String,
    city: String,
    country: String,
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    roomNumber: String,
    guests: Number,
    rooms: Number,
    amenities: [String],
    confirmationNumber: String,
  },
  price: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
  },
  payment: {
    method: { type: String, enum: ['stripe', 'razorpay', 'wallet', 'upi'] },
    paymentId: String,
    orderId: String,
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
    paidAt: Date,
    refundId: String,
    refundedAt: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refund-requested', 'refunded'],
    default: 'pending',
  },
  specialRequests: String,
  insurance: {
    selected: { type: Boolean, default: false },
    type: String,
    price: Number,
    provider: String,
  },
  contactInfo: {
    email: String, phone: String, emergencyContact: String,
  },
  documents: [{
    type: String, url: String, uploadedAt: Date,
  }],
  timeline: [{
    event: String, timestamp: { type: Date, default: Date.now }, note: String,
  }],
  notes: String,
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: String,
  cancelledAt: Date,
}, { timestamps: true });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
