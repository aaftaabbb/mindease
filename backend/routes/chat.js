const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CRISIS_KEYWORDS = ['suicide','kill myself','end my life','self harm','hurt myself','hopeless','cant go on','want to die','no point','jeena nahi'];

router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ msg: 'Message required' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ msg: 'Message too long (max 1000 characters)' });
    }

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

    const recentMessages = chat.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: 'You are MindEase, a warm empathetic AI mental wellness companion for Indian college students. Give short 2-3 sentence supportive responses. Use simple language. Occasionally use Hindi words like yaar or sab theek hoga. Never claim to be a doctor. Remember the conversation context.'
    });

    const history = recentMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chatSession = model.startChat({ history });
    const result = await chatSession.sendMessage(message);
    const response = result.response.text();

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
