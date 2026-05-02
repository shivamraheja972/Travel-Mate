const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const sendEmail = require('../utils/emails');

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = await User.create({
      firstName, lastName, email: email.toLowerCase(), phone,
      password, emailVerificationToken: verificationToken,
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'Welcome to TravelMate!',
      html: `<h1>Welcome ${firstName}!</h1><p>Your account has been created successfully.</p>`,
    }).catch(console.error);

    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact support.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/auth/verify
router.post('/verify', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'TravelMate - Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Expires in 1 hour.</p>`,
    }).catch(console.error);

    res.json({ success: true, message: 'Password reset link sent to email.' });
  } catch (err) { next(err); }
});

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (err) { next(err); }
});

module.exports = router;
