const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const sendEmail = require('../utils/emails');

// POST /api/payments/create-payment-intent (Stripe)
router.post('/create-payment-intent', protect, paymentLimiter, async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_')) {
      return res.status(503).json({ success: false, message: 'Stripe not configured. Add STRIPE_SECRET_KEY to .env' });
    }
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { bookingId, amount, currency = 'usd' } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { bookingId: booking.bookingId, userId: req.user._id.toString() },
    });

    booking.payment = { method: 'stripe', paymentId: paymentIntent.id, status: 'processing' };
    await booking.save();

    res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) { next(err); }
});

// POST /api/payments/confirm
router.post('/confirm', protect, async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.payment.status = 'completed';
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';
    booking.timeline.push({ event: 'Payment confirmed', timestamp: new Date() });
    await booking.save();

    // Real-time notification
    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('payment-confirmed', { bookingId: booking.bookingId });

    // Email confirmation
    sendEmail({
      to: booking.user.email,
      subject: `Booking Confirmed - ${booking.bookingId}`,
      html: `<h2>Booking Confirmed!</h2><p>Your booking <strong>${booking.bookingId}</strong> is confirmed.</p><p>Total: ${booking.price.currency} ${booking.price.totalPrice}</p>`,
    }).catch(console.error);

    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// POST /api/payments/razorpay/order
router.post('/razorpay/order', protect, paymentLimiter, async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('your_')) {
      return res.status(503).json({ success: false, message: 'Razorpay not configured. Add RAZORPAY_KEY_ID to .env' });
    }
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

    const { bookingId, amount, currency = 'INR' } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: bookingId,
    });

    res.json({ success: true, order });
  } catch (err) { next(err); }
});

// POST /api/payments/razorpay/verify
router.post('/razorpay/verify', protect, async (req, res, next) => {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated = hmac.digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.payment = { method: 'razorpay', paymentId: razorpay_payment_id, orderId: razorpay_order_id, status: 'completed', paidAt: new Date() };
      booking.status = 'confirmed';
      booking.timeline.push({ event: 'Payment verified (Razorpay)', timestamp: new Date() });
      await booking.save();
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) { next(err); }
});

// POST /api/payments/refund
router.post('/refund', protect, async (req, res, next) => {
  try {
    const { bookingId, reason } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.payment.method === 'stripe' && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_')) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const refund = await stripe.refunds.create({ payment_intent: booking.payment.paymentId });
      booking.payment.refundId = refund.id;
    }

    booking.payment.status = 'refunded';
    booking.payment.refundedAt = new Date();
    booking.status = 'refunded';
    booking.timeline.push({ event: 'Refund processed', note: reason });
    await booking.save();

    res.json({ success: true, message: 'Refund processed', booking });
  } catch (err) { next(err); }
});

// GET /api/payments/history/:userId
router.get('/history/:userId', protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId, 'payment.status': 'completed' })
      .select('bookingId bookingType price payment createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, payments: bookings });
  } catch (err) { next(err); }
});

module.exports = router;
