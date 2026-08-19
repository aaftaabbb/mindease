# MindEase

A mental wellness platform for Indian college students featuring AI-powered chat support, mood tracking, breathing exercises, affirmations, and a clinic directory.

## Tech Stack

**Frontend:** React 19, Vite, React Router, Recharts, Framer Motion, Lucide Icons  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Groq SDK (LLaMA 3.3)  
**Deployed on:** Vercel (frontend) + Render/Railway (backend)

## Features

- **AI Chat** - Empathetic mental wellness companion powered by Groq
- **Mood Tracker** - Log daily moods with notes and view statistics
- **Breathing Exercises** - Guided breathing animations
- **Affirmations** - Daily positive affirmations
- **Clinic Directory** - Find mental health professionals nearby
- **Crisis Detection** - Automatic detection of crisis keywords with helpline info
- **Admin Dashboard** - Monitor users, chats, and crisis reports

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Groq API key (free at console.groq.com)

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
PORT=5000
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=change_this_password
```

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/send-otp | Send OTP for registration |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/chat/message | Send chat message |
| GET | /api/chat/history | Get chat history |
| DELETE | /api/chat/clear | Clear chat history |
| POST | /api/mood | Log mood |
| GET | /api/mood/history | Get mood history |
| GET | /api/mood/stats | Get mood statistics |
| GET | /api/clinic | List clinics |
| GET | /api/admin/stats | Admin dashboard stats |
| GET | /api/admin/users | List all users |
| GET | /api/admin/crisis | Crisis reports |

## Security Notes

- Never commit `.env` files
- Rotate API keys if accidentally exposed
- Admin credentials are set via environment variables
- Rate limiting is applied to all endpoints
- Input validation on all API routes

## Disclaimer

MindEase is an AI companion, not a replacement for professional medical advice.

## Built by

Aftab, Adarsh & Ambar
