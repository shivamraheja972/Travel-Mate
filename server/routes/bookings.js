const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const sendEmail = require('../utils/emails');

// POST /api/bookings/create
router.post('/create', protect, async (req, res, next) => {
  try {
    const { bookingType, flightDetails, hotelDetails, price, insurance, contactInfo, specialRequests } = req.body;
    if (!bookingType || !price) {
      return res.status(400).json({ success: false, message: 'bookingType and price are required' });
    }

    const booking = await Booking.create({
      bookingType, flightDetails, hotelDetails, price, insurance,
      contactInfo: contactInfo || { email: req.user.email, phone: req.user.phone },
      specialRequests,
      user: req.user._id,
      timeline: [{ event: 'Booking created', timestamp: new Date() }],
    });

    // Add booking to user
    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });

    // Emit socket event
    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('booking-created', booking);

    res.status(201).json({ success: true, booking });
  } catch (err) { next(err); }
});

// GET /api/bookings/user/:id
router.get('/user/:id', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.params.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);
    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'firstName lastName email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    // Ownership check
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.status}` });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    booking.timeline.push({ event: 'Booking cancelled', timestamp: new Date(), note: req.body.reason });
    await booking.save();

    sendEmail({
      to: req.user.email,
      subject: `Booking ${booking.bookingId} Cancelled`,
      html: `<p>Your booking ${booking.bookingId} has been cancelled.</p>`,
    }).catch(console.error);

    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// PATCH /api/bookings/:id/requests
router.patch('/:id/requests', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { specialRequests: req.body.specialRequests },
      { new: true }
    );
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// GET /api/bookings/:id/timeline
router.get('/:id/timeline', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).select('timeline bookingId');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, timeline: booking.timeline });
  } catch (err) { next(err); }
});

module.exports = router;
