const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/users/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/users/:id
router.patch('/:id', protect, async (req, res, next) => {
  try {
    if (req.params.id !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const allowed = ['firstName', 'lastName', 'phone', 'gender', 'dateOfBirth', 'address', 'passportNumber', 'passportExpiry', 'preferredCurrency', 'profileImage'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/users/:id/notifications
router.patch('/:id/notifications', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { notifications: req.body }, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/users/:id/whatsapp
router.patch('/:id/whatsapp', protect, async (req, res, next) => {
  try {
    const { whatsappNumber, whatsappOptIn } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { whatsappNumber, whatsappOptIn }, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// GET /api/users/:id/wallet
router.get('/:id/wallet', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('wallet loyaltyPoints');
    res.json({ success: true, wallet: user.wallet, loyaltyPoints: user.loyaltyPoints });
  } catch (err) { next(err); }
});

module.exports = router;
