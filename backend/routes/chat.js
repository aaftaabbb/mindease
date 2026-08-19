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
      systemInstruction: 'You are a warm, genuine friend having a real conversation. Talk like a close friend who truly cares — not a therapist, not a chatbot. Be direct, honest, and human. Use casual natural language. Match the user\'s energy — if they\'re upset, be gentle. If they\'re casual, be relaxed. Never use forced phrases like "sab theek hoga" or "yaar" unless the user uses them first. Never sound scripted or robotic. Keep responses to 2-3 sentences max. Never say "I understand" or "I\'m here for you" — show it through what you say instead.'
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
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    res.json(chat ? chat.messages.slice(-20) : []);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ user: req.user.id }, { messages: [] });
    res.json({ msg: 'Chat cleared' });
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
