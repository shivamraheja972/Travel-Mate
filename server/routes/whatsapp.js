const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

const sendWhatsApp = async (to, body) => {
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.includes('ACb1234')) {
    console.log(`[Mock WhatsApp] To: ${to} | Message: ${body}`);
    return { sid: 'mock-' + Date.now() };
  }
  const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilio.messages.create({ from: process.env.TWILIO_WHATSAPP_NUMBER, to: `whatsapp:${to}`, body });
};

// Process incoming WhatsApp message (booking bot)
const processWhatsAppBooking = async (from, body) => {
  const message = body.toLowerCase().trim();

  if (message.includes('book flight') || message.includes('flight from')) {
    return `✈️ *TravelMate Flight Booking*\n\nTo book a flight, please provide:\n1. Origin city/airport\n2. Destination city/airport\n3. Travel date\n4. Number of passengers\n\nOr visit: ${process.env.FRONTEND_URL || 'https://travelmate.com'}/flights`;
  }

  if (message.includes('book hotel') || message.includes('hotel in')) {
    return `🏨 *TravelMate Hotel Booking*\n\nTo book a hotel, please provide:\n1. City\n2. Check-in date\n3. Check-out date\n4. Number of guests\n\nOr visit: ${process.env.FRONTEND_URL || 'https://travelmate.com'}/hotels`;
  }

  if (message.includes('my booking') || message.includes('booking status')) {
    return `📋 *Check Your Bookings*\n\nView all your bookings at:\n${process.env.FRONTEND_URL || 'https://travelmate.com'}/dashboard\n\nOr reply with your Booking ID (e.g., TM123ABC456)`;
  }

  if (message.includes('cancel')) {
    return `❌ *Cancel a Booking*\n\nTo cancel a booking, please log in at:\n${process.env.FRONTEND_URL || 'https://travelmate.com'}/dashboard\n\nOr contact support: support@travelmate.com`;
  }

  return `👋 *Welcome to TravelMate!*\n\nI can help you with:\n✈️ Book a flight - "Book flight from [city] to [city]"\n🏨 Book a hotel - "Book hotel in [city]"\n📋 Check bookings - "My booking"\n❌ Cancel - "Cancel booking"\n\nOr visit: ${process.env.FRONTEND_URL || 'https://travelmate.com'}`;
};

// POST /api/whatsapp/webhook
router.post('/webhook', async (req, res) => {
  try {
    const { From, Body } = req.body;
    if (!From || !Body) return res.status(200).send('OK');

    const replyMessage = await processWhatsAppBooking(From, Body);
    await sendWhatsApp(From.replace('whatsapp:', ''), replyMessage);

    res.status(200).send('OK');
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    res.status(200).send('OK');
  }
});

// POST /api/whatsapp/send-confirmation/:id
router.post('/send-confirmation/:id', protect, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const user = booking.user;
    const whatsappNumber = user.whatsappNumber || req.body.phone;
    if (!whatsappNumber) return res.status(400).json({ success: false, message: 'No WhatsApp number on file' });

    const message = `✅ *Booking Confirmed!*\n\nBooking ID: ${booking.bookingId}\nType: ${booking.bookingType}\nTotal: ${booking.price.currency} ${booking.price.totalPrice}\n\nTrack your booking: ${process.env.FRONTEND_URL || 'https://travelmate.com'}/booking/${booking._id}`;

    await sendWhatsApp(whatsappNumber, message);
    res.json({ success: true, message: 'WhatsApp confirmation sent' });
  } catch (err) { next(err); }
});

// POST /api/whatsapp/send-promo
router.post('/send-promo', protect, adminOnly, async (req, res, next) => {
  try {
    const { phones, message } = req.body;
    if (!phones?.length || !message) {
      return res.status(400).json({ success: false, message: 'phones array and message required' });
    }

    const results = await Promise.allSettled(phones.map(phone => sendWhatsApp(phone, message)));
    const sent = results.filter(r => r.status === 'fulfilled').length;

    res.json({ success: true, sent, total: phones.length });
  } catch (err) { next(err); }
});

module.exports = router;
