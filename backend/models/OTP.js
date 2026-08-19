const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phone:     { type: String, required: true },
  otp:       { type: String, required: true },
  expiresAt: { type: Date,   required: true }
}, { timestamps: true });

OTPSchema.index({ phone: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('OTP', OTPSchema);
