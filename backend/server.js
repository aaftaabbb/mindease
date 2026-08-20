const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

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
  res.setTimeout(60000, () => {
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

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/mood',     require('./routes/mood'));
app.use('/api/journal',  require('./routes/journal'));
app.use('/api/clinic',   require('./routes/clinic'));
app.use('/api/booking',  require('./routes/booking'));
app.use('/api/articles', require('./routes/article'));
app.use('/api/admin',    require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
}).then(async () => {
  console.log('MongoDB Connected');
  const seedData = require('./seed');
  await seedData();
}).catch(err => console.log('DB Error:', err.message));
