const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const OTP    = require('../models/OTP');

const validatePhone = (phone) => /^\d{10}$/.test(phone);
const validatePassword = (pw) => typeof pw === 'string' && pw.length >= 6;
const validateName = (name) => typeof name === 'string' && name.trim().length >= 2;

router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !validatePhone(phone)) {
      return res.status(400).json({ msg: 'Valid 10-digit phone number required' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp, expiresAt });
    console.log('OTP for ' + phone + ': ' + otp);
    res.json({ msg: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, otp } = req.body;
    if (!name || !validateName(name)) {
      return res.status(400).json({ msg: 'Name must be at least 2 characters' });
    }
    if (!phone || !validatePhone(phone)) {
      return res.status(400).json({ msg: 'Valid 10-digit phone number required' });
    }
    if (!password || !validatePassword(password)) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return res.status(400).json({ msg: 'Valid 6-digit OTP required' });
    }
    const otpDoc = await OTP.findOne({ phone, otp });
    if (!otpDoc) return res.status(400).json({ msg: 'Invalid OTP' });
    if (otpDoc.expiresAt < new Date()) return res.status(400).json({ msg: 'OTP expired' });
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ msg: 'Phone already registered' });
    
    const user = await User.create({ name, phone, password, isVerified: true });
    await OTP.deleteMany({ phone });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !validatePhone(phone)) {
      return res.status(400).json({ msg: 'Valid 10-digit phone number required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ msg: 'Password required' });
    }
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
