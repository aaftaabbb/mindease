const router = require('express').Router();
const auth = require('../middleware/auth');
const Journal = require('../models/Journal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ msg: 'Title required' });
    }
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ msg: 'Content required' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ msg: 'Content too long (max 2000 characters)' });
    }

    let reflection = '';
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: 'You are a gentle, supportive mental wellness companion. Give a short 1-2 sentence reflection on the user\'s journal entry. Be warm, validating, and encouraging. Use simple language. Sometimes use Hindi words like "sab theek hoga" or "bilkul".'
      });
      const result = await model.generateContent(`My mood: ${mood}\n\nJournal entry: ${content}`);
      reflection = result.response.text();
    } catch (e) {
      reflection = 'Thank you for sharing. Keep writing, it helps! 💜';
    }

    const entry = await Journal.create({
      user: req.user.id,
      title: title.trim(),
      content: content.trim(),
      mood: mood || 'neutral',
      tags: Array.isArray(tags) ? tags.slice(0, 5) : [],
      reflection
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('Journal error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const entries = await Journal.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Journal.countDocuments({ user: req.user.id });

    res.json({ entries, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Journal.findOne({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json({ msg: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
