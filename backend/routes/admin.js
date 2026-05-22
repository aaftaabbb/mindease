const router = require('express').Router();
const auth   = require('../middleware/auth');
const User   = require('../models/User');
const Chat   = require('../models/Chat');

router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalChats = await Chat.countDocuments();
    const allChats   = await Chat.find();
    let crisisCount  = 0;
    
    allChats.forEach(c => c.messages.forEach(m => { if (m.isCrisis) crisisCount++; }));
    
    res.json({ totalUsers, totalChats, crisisCount });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/crisis', auth, async (req, res) => {
  try {
    const chats = await Chat.find().populate('user', 'name phone');
    const crisis = [];
    chats.forEach(c => {
      c.messages.forEach(m => {
        if (m.isCrisis) crisis.push({ user: c.user, message: m.content, timestamp: m.timestamp });
      });
    });
    res.json(crisis);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
