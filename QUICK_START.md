# 🚀 SentraAI Quick Start Guide

Get SentraAI running in 5 minutes!

---

## Prerequisites

- Node.js v14+
- npm v6+
- Git
- A Supabase account (free tier available)
- A Firebase account (free tier available)

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/SentraAI.git
cd SentraAI

# Install backend
cd server && npm install

# Install frontend
cd ../client && npm install
```

### Step 2: Create Accounts (2 min)

1. **Firebase** - https://console.firebase.google.com/
   - Create new project named "SentraAI"
   - Enable Email/Password auth
   - Copy credentials

2. **Supabase** - https://app.supabase.com/
   - Create new project
   - Copy API credentials

### Step 3: Configure Environment (1 min)

Create `server/.env`:
```env
PORT=5001
NODE_ENV=development
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_id
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
JWT_SECRET=random_secret_here
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Step 4: Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### Step 5: Login & Explore

1. Visit `http://localhost:5173`
2. Click role (Admin, Guard, or Resident)
3. Use email: `admin@sentraai.com`, password: `TestPassword123!`

✅ **Done!** You're now running SentraAI locally.

---

## 📍 Key URLs

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| Admin Portal | http://localhost:5173/admin |
| Guard Portal | http://localhost:5173/guard |
| Resident Portal | http://localhost:5173/resident |

---

## 🗂️ Project Structure

```
SentraAI/
├── client/                # React frontend
│   └── src/              # Source code
├── server/               # Node.js backend
│   ├── index.js         # Main server file
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
├── supabase/            # Database migrations
└── README.md            # Full documentation
```

---

## 🔍 Core Features to Try

### As Admin
1. **Dashboard** - View analytics and alerts
2. **User Management** - Create Guard/Resident accounts
3. **Analytics** - Check visitor trends

### As Guard
1. **Visitor Entry** - Register a new visitor
2. **QR Pass** - Generate visitor pass
3. **Check Approvals** - See pending visitor approvals

### As Resident
1. **Approvals** - Approve/deny visitor requests
2. **Notifications** - Receive visitor alerts
3. **History** - View past visitors

---

## 📚 Next Steps

1. **Read Full Setup** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **Learn Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **API Reference** → [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. **Deployment** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## ⚡ Common Commands

```bash
# Start development servers
npm run dev          # Frontend
npm start            # Backend

# Build for production
npm run build        # Frontend

# Run database migrations
npm run migrate

# Format code
npm run format

# Run tests
npm test
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5002 npm start
```

### CORS Error
```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:5173
```

### Module Not Found
```bash
npm install
```

### Can't Login
- Verify Firebase credentials in `.env`
- Check email/password auth is enabled in Firebase

---

## 📖 Full Documentation

- [README.md](README.md) - Complete project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All API endpoints
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment

---

**Need Help?** Check [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue on GitHub!

---

**Last Updated**: November 2024
