const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self harm', 'self-harm',
  'hurt myself', 'want to die', 'i want to die', 'i dont want to live',
  "i don't want to live", 'end it all', 'no reason to live',
  'jeena nahi', 'marna hai', 'khud ko maar', 'khud ko hurt'
];

const SYSTEM_PROMPT = `You are MindEase, an AI mental wellness companion designed for college students in India. Your job is to have a natural, thoughtful and context-aware conversation with the user.

CORE CONVERSATION STYLE:
1. Sound natural. Talk like a thoughtful, emotionally intelligent companion. Do not sound like a scripted chatbot, motivational speaker, customer support, or use overly formal/clinical language.
2. Respond to what the user ACTUALLY said. Pay attention to the specific situation. Do not give generic advice when the user has provided specific details. If the user asks a direct question, answer it directly.
3. Avoid repetitive phrases. NEVER repeatedly use: "Yaar", "Sab theek hoga", "Aap akele nahi hain", "I'm sorry you're going through this", "I understand how you feel", "Everything will be okay", "Take a deep breath", "You are stronger than you think".
4. Do not force Hindi or Hinglish. Match the language used by the user.
5. Do not force reassurance. Never promise that everything will be okay. Acknowledge the situation realistically.
6. Vary your responses. Sometimes acknowledge first, sometimes answer directly, sometimes ask a question, sometimes offer a practical suggestion.
7. Response length: 3-7 sentences when appropriate. Simple questions can be shorter. Complex situations can be more detailed.
8. Questions: Ask follow-up only when it genuinely helps. Do NOT end every response with a question.
9. Emotional situations: Be empathetic without exaggerating. Don't diagnose emotions. Don't turn every problem into a crisis.
10. Student context: Understand exam pressure, assignments, career uncertainty, internships, friendships, relationships, family pressure, loneliness, financial stress, motivation, sleep problems.
11. Medical boundaries: Never diagnose, prescribe medication, or claim to be a doctor/therapist.
12. Crisis situations: If suicidal intent or immediate danger, prioritize safety. Encourage helpline contact. Do not provide self-harm instructions.

Every response should feel like it was written specifically for this conversation. Be genuine, relevant, calm and conversational.`;

async function callGemini(message, history) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY missing');

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  const contents = [
    ...history.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: { maxOutputTokens: 300, temperature: 0.75, topP: 0.9 }
  };

  for (const model of models) {
    let timer;
    try {
      const ctrl = new AbortController();
      timer = setTimeout(() => ctrl.abort(), 30000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify(payload)
        }
      );
      clearTimeout(timer);

      if (res.status === 503 || res.status === 429) {
        console.log(`${model} busy, trying next...`);
        continue;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error(`${model} error ${res.status}`);
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) return text;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        console.log(`${model} timeout`);
        continue;
      }
    }
  }

  return null;
}

router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ msg: 'Message required' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ msg: 'Message too long (max 1000 characters)' });
    }

    const cleanMessage = message.trim();
    const isCrisis = CRISIS_KEYWORDS.some((k) => cleanMessage.toLowerCase().includes(k));

    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) chat = await Chat.create({ user: req.user.id, messages: [] });

    if (isCrisis) {
      const emergencyResponse = "What you're describing sounds serious, and I don't want you to handle it alone right now. Please contact someone you trust who can stay with you, or reach out to a professional crisis service immediately. In India, you can contact Tele-MANAS at 14416 or 1-800-891-4416.";
      chat.messages.push({ role: 'user', content: cleanMessage, isCrisis: true });
      chat.messages.push({ role: 'assistant', content: emergencyResponse, isCrisis: true });
      await chat.save();
      return res.json({ response: emergencyResponse, isCrisis: true });
    }

    const aiResponse = await callGemini(cleanMessage, chat.messages);

    if (!aiResponse) {
      return res.json({
        response: "I'm having trouble connecting right now. But I'm here — can you tell me more about what's on your mind?",
        isCrisis: false
      });
    }

    chat.messages.push({ role: 'user', content: cleanMessage, isCrisis: false });
    chat.messages.push({ role: 'assistant', content: aiResponse, isCrisis: false });
    chat.save().catch(() => {});

    return res.json({ response: aiResponse, isCrisis: false });
  } catch (err) {
    console.error('Chat error:', err.message);
    if (!res.headersSent) {
      return res.status(500).json({ msg: 'Server error' });
    }
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    return res.json(chat ? chat.messages.slice(-20) : []);
  } catch (err) {
    if (!res.headersSent) return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ user: req.user.id }, { messages: [] });
    return res.json({ msg: 'Chat cleared' });
  } catch (err) {
    if (!res.headersSent) return res.status(503).json({ msg: 'Server error' });
  }
});

module.exports = router;
