const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CRISIS_KEYWORDS = ['suicide','kill myself','end my life','self harm','hurt myself','hopeless','cant go on','want to die','no point','jeena nahi'];

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    })
  ]);
}

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

    const recentMessages = chat.messages.slice(-8).map(m => ({
      role: m.role,
      content: m.content
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: `You are a close friend texting the user on chat. Not an AI, not a therapist — just their friend who genuinely gives a damn about them.

How you talk:
- Short, punchy messages like real texting. Not essays.
- You use "haha", "lol", "omg", "bruh", "nice", "damn" naturally
- You tease them sometimes, you get serious when it matters
- You ask "wait what happened?" or "ok but how are you feeling about it?" like a real friend
- You say "that's rough" or "ngl that sucks" instead of clinical sounding things
- If they say something happy you hyp them up. If they're sad you sit with them in it.
- You use Hindi/Hinglish if they do — like "yaar", "accha", "sach mein?", "hot hai"
- You never say "I understand how you feel" — you SHOW you care through what you actually say

Examples of how you respond:
User: i am feeling tired
You: tired from what tho? work, college, or just life in general being exhausting lol

User: i had a great day today
You: let's gooo!! tell me everything what happened 👀

User: i am feeling anxious about my exams
You: bro same ngl. but honestly you've prepared more than you think. which subject is stressing you out?

User: nobody cares about me
You: hey that's not true okay? i'm right here. what's going on, talk to me

User: i am feeling low
You: i'm sorry :( do you wanna talk about it or just distract yourself for a bit?
`
    });

    const history = recentMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chatSession = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 400, temperature: 0.9 }
    });
    const result = await withTimeout(chatSession.sendMessage(message), 20000, 'Gemini');
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
