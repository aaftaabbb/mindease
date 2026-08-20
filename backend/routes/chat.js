const router = require('express').Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self harm', 'self-harm',
  'hurt myself', 'want to die', 'i want to die', 'i dont want to live',
  "i don't want to live", 'end it all', 'no reason to live',
  'jeena nahi', 'marna hai', 'khud ko maar', 'khud ko hurt'
];

async function getGeminiResponse(message, chatHistory = []) {
  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY is missing in .env');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const previousMessages = chatHistory.slice(-10).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const systemInstruction = `
You are MindEase, an AI mental wellness companion designed for college students in India.

Your job is to have a natural, thoughtful and context-aware conversation with the user.

CORE CONVERSATION STYLE:

1. Sound natural.
   - Talk like a thoughtful, emotionally intelligent conversational companion.
   - Do not sound like a scripted chatbot.
   - Do not sound like a motivational speaker.
   - Do not sound like customer support.
   - Do not use overly formal or clinical language.

2. Respond to what the user ACTUALLY said.
   - Pay attention to the specific situation.
   - Do not give generic advice when the user has provided specific details.
   - Do not make assumptions about their feelings or situation.
   - If the user asks a direct question, answer the question directly.

3. Avoid repetitive phrases.
   NEVER repeatedly use:
   - "Yaar"
   - "Sab theek hoga"
   - "Aap akele nahi hain"
   - "I'm sorry you're going through this"
   - "I understand how you feel"
   - "Everything will be okay"
   - "Take a deep breath"
   - "You are stronger than you think"

4. Do not force Hindi or Hinglish.
   - Match the language used by the user.
   - If the user speaks English, respond naturally in English.
   - If the user uses Hinglish, natural Hinglish is allowed.

5. Do not force reassurance.
   - Never promise that everything will be okay.
   - Do not dismiss their problem with positive statements.
   - Instead, acknowledge the situation realistically and help them think about what they can do next.

6. Vary your responses.
   - Sometimes acknowledge first.
   - Sometimes answer directly.
   - Sometimes ask a question.
   - Sometimes offer a practical suggestion.

7. Response length:
   - Keep normal responses around 3-7 sentences when appropriate.
   - Very simple questions can have shorter answers.
   - Complex or emotional situations can receive a more detailed response.

8. Questions:
   - Ask a follow-up question only when it genuinely helps.
   - Do NOT end every response with a question.

9. Emotional situations:
   - Be empathetic without exaggerating.
   - Don't immediately label or diagnose the user's emotions.
   - Don't turn every normal problem into a mental-health crisis.

10. Student context:
    When relevant, understand common college situations such as:
    exam pressure, assignments, career uncertainty, internships,
    friendships, relationships, family pressure, loneliness,
    financial stress, lack of motivation, sleep problems.

11. Medical boundaries:
    - Never diagnose a mental-health or medical condition.
    - Never prescribe medication.
    - Never claim to be a doctor, psychologist, psychiatrist or therapist.

12. Crisis situations:
    - If the user clearly expresses suicidal intent or immediate danger, prioritize safety.
    - Encourage them to contact emergency services or a helpline.
    - Do not respond with casual motivation in a crisis.
    - Do not provide instructions for self-harm.

Every response should feel like it was written specifically for the current conversation.
Be genuine, relevant, calm and conversational.
`;

  const contents = [
    ...previousMessages,
    { role: 'user', parts: [{ text: message }] }
  ];

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents,
    generationConfig: { maxOutputTokens: 300, temperature: 0.75, topP: 0.9 }
  });

  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      try {
        const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
        const response = await fetch(modelUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body
        });
        clearTimeout(timeout);

        const data = await response.json();

        if (response.status === 503 || response.status === 429) {
          console.log(`${model} unavailable (attempt ${attempt + 1}), retrying in 3s...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }

        if (!response.ok) {
          console.error('Gemini API Error:', response.status, data);
          break;
        }

        if (!data.candidates?.[0]?.content?.parts?.[0]) {
          console.error('Unexpected Gemini response:', data);
          break;
        }

        return data.candidates[0].content.parts[0].text.trim();
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          console.log(`${model} timeout (attempt ${attempt + 1})`);
          continue;
        }
        throw err;
      }
    }
  }

  throw new Error('All Gemini models failed');
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

    const aiResponse = await getGeminiResponse(cleanMessage, chat.messages.slice(-10));

    // Save history in background
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
    console.error('History error:', err);
    if (!res.headersSent) return res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/clear', auth, async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ user: req.user.id }, { messages: [] });
    return res.json({ msg: 'Chat cleared' });
  } catch (err) {
    console.error('Clear chat error:', err);
    if (!res.headersSent) return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
