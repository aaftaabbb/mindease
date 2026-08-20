const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CRISIS_KEYWORDS = ['suicide','kill myself','end my life','self harm','hurt myself','hopeless','cant go on','want to die','no point','jeena nahi'];

router.post('/message', auth, async (req, res) => {
  if (res.headersSent) return;

  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ msg: 'Message required' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ msg: 'Message too long (max 1000 characters)' });
  }

  const isCrisis = CRISIS_KEYWORDS.some(k => message.toLowerCase().includes(k));

  if (isCrisis) {
    const emergencyResponse = 'I can hear that you are going through something very difficult. Please reach out immediately — iCall: 9152987821. You are not alone. 💙';
    try {
      const chat = await Chat.findOne({ user: req.user.id }) || await Chat.create({ user: req.user.id, messages: [] });
      chat.messages.push({ role: 'user', content: message, isCrisis: true });
      chat.messages.push({ role: 'assistant', content: emergencyResponse, isCrisis: true });
      await chat.save();
    } catch (_) {}
    return res.json({ response: emergencyResponse, isCrisis: true });
  }

  try {
    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) chat = await Chat.create({ user: req.user.id, messages: [] });

    const recentMessages = chat.messages.slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: 'You are the user\'s close friend chatting on text. Be casual, warm, real. Talk like a genuine friend — not a therapist or bot. Use short natural messages. React with real emotion. Use "haha", "lol", "nice", "damn" naturally. If they use Hindi/Hinglish, match it. Ask follow-up questions like a real friend.'
    });

    const history = recentMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chatSession = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 200, temperature: 0.85 }
    });

    const result = await Promise.race([
      chatSession.sendMessage(message),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 45000))
    ]);
    const response = result.response.text();

    if (res.headersSent) return;
    res.json({ response, isCrisis: false });

    chat.messages.push({ role: 'user', content: message, isCrisis: false });
    chat.messages.push({ role: 'assistant', content: response, isCrisis: false });
    chat.save().catch(() => {});
  } catch (err) {
    console.error('Chat error:', err.message);
    if (!res.headersSent) {
      const msg = err.message?.includes('timeout')
        ? 'AI is taking too long, please try again.'
        : 'Server error';
      res.status(500).json({ msg });
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
