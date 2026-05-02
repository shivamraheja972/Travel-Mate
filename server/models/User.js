const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, minlength: 8 },
  profileImage: { type: String, default: null },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  dateOfBirth: Date,
  address: {
    street: String, city: String, state: String, country: String, zipCode: String,
  },
  passportNumber: String,
  passportExpiry: Date,
  preferredCurrency: { type: String, default: 'USD' },
  whatsappNumber: String,
  whatsappOptIn: { type: Boolean, default: false },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
  },
  role: { type: String, enum: ['user', 'admin', 'partner'], default: 'user' },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  savedItineraries: [{ type: mongoose.Schema.Types.ObjectId }],
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
  },
  loyaltyPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  lastLogin: Date,
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.emailVerificationToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
