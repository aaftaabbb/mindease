const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

// Manual CORS middleware — must be FIRST
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    if (!res.headersSent) {
      res.status(504).json({ msg: 'Request timeout, please try again' });
    }
  });
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: 'Too many auth attempts, please try again later.' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { msg: 'Too many messages, please slow down.' }
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/chat', chatLimiter);

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/mood',     require('./routes/mood'));
app.use('/api/journal',  require('./routes/journal'));
app.use('/api/clinic',   require('./routes/clinic'));
app.use('/api/booking',  require('./routes/booking'));
app.use('/api/articles', require('./routes/article'));
app.use('/api/admin',    require('./routes/admin'));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
})
  .then(async () => {
    console.log('MongoDB Connected');
    await seedData();
  })
  .catch(err => console.log('DB Error:', err));

async function seedData() {
  const Clinic = require('./models/Clinic');
  const User = require('./models/User');
  const Article = require('./models/Article');
  const bcrypt = require('bcryptjs');
  
  const clinicCount = await Clinic.countDocuments();
  if (clinicCount === 0) {
    await Clinic.insertMany([
      { name: 'iCall TISS',            city: 'Mumbai',    phone: '9152987821',  type: 'helpline'     },
      { name: 'Vandrevala Foundation', city: 'Pan India', phone: '18602662345', type: 'helpline'     },
      { name: 'NIMHANS',               city: 'Bangalore', phone: '08046110007', type: 'clinic'       },
      { name: 'Fortis Mental Health',  city: 'Delhi',     phone: '8376804102',  type: 'psychiatrist' },
      { name: 'Mpower',                city: 'Mumbai',    phone: '18001208200', type: 'counselor'    }
    ]);
    console.log('Clinics seeded');
  }

  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    await Article.insertMany([
      {
        title: 'Understanding Anxiety: What Every Student Should Know',
        slug: 'understanding-anxiety',
        category: 'anxiety',
        excerpt: 'Anxiety is more than just feeling stressed. Learn to recognize the signs and understand what\'s happening in your body.',
        content: `<h2>What is Anxiety?</h2><p>Anxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. As a student, you might feel anxious before exams, during presentations, or when facing new situations.</p><h2>Common Signs</h2><ul><li>Racing heart or chest tightness</li><li>Difficulty concentrating</li><li>Restlessness or feeling on edge</li><li>Sleep problems</li><li>Avoiding social situations</li></ul><h2>Why Students Face It More</h2><p>Academic pressure, peer relationships, career uncertainty, and financial stress create a perfect storm for anxiety in college life.</p><h2>What You Can Do</h2><p>Practice deep breathing, maintain a routine, talk to someone you trust, and remember — seeking help is a sign of strength, not weakness.</p>`,
        readTime: 4, tags: ['anxiety', 'students', 'mental health'], featured: true
      },
      {
        title: '5 Breathing Techniques That Actually Work',
        slug: 'breathing-techniques',
        category: 'mindfulness',
        excerpt: 'Simple, science-backed breathing exercises you can do anywhere — in class, before exams, or during a panic attack.',
        content: `<h2>Why Breathing Works</h2><p>Controlled breathing activates your parasympathetic nervous system, telling your brain it's safe to relax.</p><h2>1. 4-7-8 Technique</h2><p>Inhale for 4 seconds, hold for 7, exhale for 8. Repeat 4 times.</p><h2>2. Box Breathing</h2><p>Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Used by Navy SEALs.</p><h2>3. Belly Breathing</h2><p>Place hand on stomach. Breathe so your belly rises, not your chest. 5-10 minutes daily.</p><h2>4. Alternate Nostril</h2><p>Close right nostril, inhale left. Close left, exhale right. Reverse. Balances nervous system.</p><h2>5. 5-4-3-2-1 Grounding</h2><p>While breathing slowly: name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.</p>`,
        readTime: 3, tags: ['breathing', 'relaxation', 'techniques'], featured: true
      },
      {
        title: 'Sleep Hygiene: A Guide for Night Owls',
        slug: 'sleep-hygiene',
        category: 'sleep',
        excerpt: 'Struggling to sleep? Your sleep habits might be the problem. Here\'s how to fix your sleep cycle.',
        content: `<h2>Why Sleep Matters</h2><p>Sleep isn't luxury — it's when your brain consolidates memories, processes emotions, and repairs itself.</p><h2>Signs of Poor Sleep Hygiene</h2><ul><li>Taking 30+ minutes to fall asleep</li><li>Waking up multiple times</li><li>Feeling tired despite 8 hours in bed</li></ul><h2>Fix Your Sleep</h2><p><strong>Consistency:</strong> Same bed/wake time daily (yes, weekends too).</p><p><strong>Screen Curfew:</strong> No phones 1 hour before bed. Blue light suppresses melatonin.</p><p><strong>Cool & Dark:</strong> Room should be 18-20°C and pitch dark.</p><p><strong>No Caffeine after 2 PM:</strong> Caffeine has a 6-hour half-life.</p><p><strong>Wind Down:</strong> Read, stretch, or journal before bed.</p>`,
        readTime: 4, tags: ['sleep', 'habits', 'wellness'], featured: false
      },
      {
        title: 'Dealing with Exam Stress: A Practical Guide',
        slug: 'exam-stress',
        category: 'stress',
        excerpt: 'Exams are temporary, but your mental health is not. Learn to manage exam pressure without burning out.',
        content: `<h2>The Exam-Stress Cycle</h2><p>Stress → Procrastination → More Stress → Last-minute Panic → Poor Performance → More Stress. Sound familiar?</p><h2>Breaking the Cycle</h2><p><strong>Pomodoro Technique:</strong> 25 min study + 5 min break. After 4 cycles, take a 30-min break.</p><p><strong>Active Recall:</strong> Close the book and try to remember. Better than re-reading 10 times.</p><p><strong>Study Groups:</strong> Teach someone else. If you can explain it, you know it.</p><h2>During the Exam</h2><p>Read the paper first. Start with what you know. If panic hits — stop, breathe, then continue.</p><h2>Remember</h2><p>One exam doesn't define your life. Your worth isn't measured by marks.</p>`,
        readTime: 3, tags: ['exams', 'stress', 'study tips'], featured: true
      },
      {
        title: 'Self-Care Isn\'t Selfish: Building Healthy Habits',
        slug: 'self-care-habits',
        category: 'self-care',
        excerpt: 'Self-care isn\'t bubble baths and face masks (though those are fine too). It\'s the basics we often ignore.',
        content: `<h2>The Basics (That We Ignore)</h2><p><strong>Eating:</strong> Your brain uses 20% of your calories. Skipping meals = brain fog.</p><p><strong>Moving:</strong> Even a 10-minute walk boosts mood for 2 hours.</p><p><strong>Hydrating:</strong> Dehydration causes fatigue, headaches, and poor focus.</p><p><strong>Connecting:</strong> Loneliness is as harmful as smoking 15 cigarettes/day.</p><h2>Building Habits That Stick</h2><p>Start ridiculously small. Want to exercise? Start with 5 pushups. Want to journal? Write one sentence. Build momentum, then scale up.</p><h2>When Self-Care Feels Hard</h2><p>Some days, getting out of bed IS the self-care. And that's okay.</p>`,
        readTime: 3, tags: ['self-care', 'habits', 'wellness'], featured: false
      },
      {
        title: 'Understanding Depression: It\'s Not Just Sadness',
        slug: 'understanding-depression',
        category: 'depression',
        excerpt: 'Depression is more than feeling sad. It\'s a medical condition that affects how you think, feel, and function.',
        content: `<h2>What Depression Actually Is</h2><p>Depression is a persistent change in brain chemistry that affects mood, energy, sleep, appetite, and concentration.</p><h2>Common Symptoms</h2><ul><li>Loss of interest in things you used to enjoy</li><li>Changes in appetite or weight</li><li>Sleeping too much or too little</li><li>Feeling worthless or guilty</li><li>Difficulty concentrating</li><li>Thoughts of self-harm</li></ul><h2>Myths vs Facts</h2><p><strong>Myth:</strong> "Just snap out of it." <strong>Fact:</strong> Depression is a medical condition, not a choice.</p><p><strong>Myth:</strong> "It's only for weak people." <strong>Fact:</strong> Depression affects 280 million people worldwide.</p><h2>Getting Help</h2><p>Talk to a counselor. Call a helpline. You're not alone, and you deserve help.</p>`,
        readTime: 5, tags: ['depression', 'mental health', 'awareness'], featured: true
      }
    ]);
    console.log('Articles seeded');
  }
  
  const adminPhone = process.env.ADMIN_PHONE || '9999999999';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  
  const adminExists = await User.findOne({ phone: adminPhone });
  if (!adminExists) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin',
      phone: adminPhone,
      password: hashed,
      role: 'admin',
      isVerified: true
    });
    console.log('Admin seeded from environment variables');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
