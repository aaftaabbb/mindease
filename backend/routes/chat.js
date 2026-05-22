const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CRISIS_KEYWORDS = ['suicide','kill myself','end my life','self harm','hurt myself','hopeless','cant go on','want to die','no point','jeena nahi'];

router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ msg: 'Message required' });

    const isCrisis = CRISIS_KEYWORDS.some(k => message.toLowerCase().includes(k));

    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) chat = await Chat.create({ user: req.user.id, messages: [] });

    if (isCrisis) {
      const emergencyResponse = 'I can hear that you are going through something very difficult. Please reach out immediately — iCall: 9152987821. You are not alone. 💙';
      chat.messages.push({ role: 'user', content: message, isCrisis: true });
      chat.messages.push({ role: 'assistant', content: emergencyResponse, isCrisis: true });
      await chat.save();
      return res.json({ response: emergencyResponse, isCrisis: true });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are MindEase, a warm empathetic AI mental wellness companion for Indian college students. Give short 2-3 sentence supportive responses. Use simple language. Occasionally use Hindi words like yaar or sab theek hoga. Never claim to be a doctor.' },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    chat.messages.push({ role: 'user', content: message, isCrisis: false });
    chat.messages.push({ role: 'assistant', content: response, isCrisis: false });
    await chat.save();

    res.json({ response, isCrisis: false });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    res.json(chat ? chat.messages.slice(-20) : []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ user: req.user.id }, { messages: [] });
    res.json({ msg: 'Chat cleared' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;