const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  address:   { type: String, default: '' },
  city:      { type: String, required: true },
  phone:     { type: String, required: true },
  type:      { type: String, enum: ['psychiatrist','counselor','clinic','helpline'] },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Clinic', ClinicSchema);
