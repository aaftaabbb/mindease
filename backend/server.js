const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

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

app.use(express.json());

app.use('/api/auth',   require('./routes/auth'));
app.use('/api/chat',   require('./routes/chat'));
app.use('/api/mood',   require('./routes/mood'));
app.use('/api/clinic', require('./routes/clinic'));
app.use('/api/admin',  require('./routes/admin'));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedData();
  })
  .catch(err => console.log('DB Error:', err));

async function seedData() {
  const Clinic = require('./models/Clinic');
  const User = require('./models/User');
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
  
  const adminExists = await User.findOne({ phone: '9999999999' });
  if (!adminExists) {
    const hashed = await bcrypt.hash('admin1234', 10);
    await User.create({
      name: 'Admin',
      phone: '9999999999',
      password: hashed,
      role: 'admin',
      isVerified: true
    });
    console.log('Admin created: 9999999999 / admin1234');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
