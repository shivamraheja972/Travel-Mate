const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', async (req, res, next) => {
  try {
    const [totalBookings, confirmedBookings, cancelledBookings, totalUsers, revenueData] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'user' }),
      Booking.aggregate([
        { $match: { 'payment.status': 'completed' } },
        { $group: { _id: null, total: { $sum: '$price.totalPrice' } } },
      ]),
    ]);

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: todayStart } });

    res.json({
      success: true,
      stats: {
        totalBookings, confirmedBookings, cancelledBookings, totalUsers,
        totalRevenue: revenueData[0]?.total || 0,
        todayBookings,
      },
    });
  } catch (err) { next(err); }
});

// GET /api/admin/bookings/all
router.get('/bookings/all', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.bookingId = { $regex: search, $options: 'i' };

    const bookings = await Booking.find(filter)
      .populate('user', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);
    res.json({ success: true, bookings, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/admin/users/all
router.get('/users/all', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
    ];

    const users = await User.find(filter).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PATCH /api/admin/bookings/:id/status
router.patch('/bookings/:id/status', async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = status;
    booking.timeline.push({ event: `Status updated to ${status}`, note, timestamp: new Date() });
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) { next(err); }
});

// GET /api/admin/reports/revenue
router.get('/reports/revenue', async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const revenue = await Booking.aggregate([
      { $match: { 'payment.status': 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$price.totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, revenue });
  } catch (err) { next(err); }
});

module.exports = router;
