# SentraAI Setup Guide

Complete step-by-step guide to set up SentraAI for development or production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Supabase Configuration](#supabase-configuration)
5. [Environment Setup](#environment-setup)
6. [Running the Application](#running-the-application)
7. [Verification Checklist](#verification-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Connection**: Stable internet connection

### Software Requirements
- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v6.0.0 or higher (ships with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))
- **Terminal**: Command line interface (PowerShell, Terminal, Bash)

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v14.x.x or higher

# Check npm version
npm --version
# Should output: 6.x.x or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

### External Service Accounts (Free Tier Available)
- **Firebase** - For authentication ([Firebase Console](https://console.firebase.google.com/))
- **Supabase** - For database ([Supabase Dashboard](https://app.supabase.com/))

---

## Development Setup

### Step 1: Clone Repository

```bash
# Navigate to your desired workspace location
cd /path/to/your/workspace

# Clone the repository
git clone https://github.com/yourusername/SentraAI.git

# Navigate into project directory
cd SentraAI

# Verify structure
ls -la
# You should see: client/, server/, supabase/, README.md, etc.
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install all npm dependencies
npm install

# Verify installation
npm list
# Should show the dependency tree without errors
```

### Step 3: Install Frontend Dependencies

```bash
# Navigate to client directory
cd ../client

# Install all npm dependencies
npm install

# Verify installation
npm list
# Should show React 18.2, Vite 4.3, etc.
```

### Step 4: Return to Root

```bash
# Navigate back to project root
cd ..

# Verify structure
ls -la
# Output should show:
# client/
# server/
# supabase/
# CONTRIBUTING.md
# CHANGELOG.md
# LICENSE
# README.md
# etc.
```

---

## Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Create Project** or select existing project
3. Choose project name: `SentraAI` (or your preferred name)
4. Select **Enable Google Analytics** (optional)
5. Click **Create project**
6. Wait for project creation (~ 2-3 minutes)

### Step 2: Set Up Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** authentication:
   - Go to **Sign-in method** tab
   - Click **Email/Password** provider
   - Toggle **Enable** switch
   - Save changes

4. Enable **Google Sign-In** (optional):
   - In **Sign-in method** tab
   - Click **Google** provider
   - Configure consent screen if needed
   - Save changes

### Step 3: Create Firebase Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **Your apps**, click **Add app** → **Web**
3. Register app as `SentraAI Web`
4. Copy the Firebase configuration

### Step 4: Get Firebase Credentials

In **Project Settings**:
1. Go to **General** tab
2. Scroll to **Your apps** section
3. Under your app, click **Config** button
4. Copy these values:

```javascript
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 5: Create Test User

1. In Firebase Console, go to **Authentication** → **Users** tab
2. Click **Create user**
3. Email: `admin@sentraai.com`
4. Password: `TestPassword123!`
5. Click **Create user**
6. Repeat for additional test users:
   - `guard@sentraai.com`
   - `resident@sentraai.com`

---

## Supabase Configuration

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **New project**
3. Fill in project details:
   - **Name**: `SentraAI`
   - **Password**: Create a strong password (save it!)
   - **Region**: Select nearest to your location
4. Click **Create new project**
5. Wait for project initialization (~ 5 minutes)

### Step 2: Get Connection Credentials

1. Go to **Settings** → **API** in your Supabase project
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New query**
3. Open [supabase/schema.sql](../supabase/schema.sql) in your editor
4. Copy entire contents
5. Paste into Supabase SQL Editor
6. Click **Run** button
7. Verify all tables are created (check **Table Editor**)

### Step 4: Seed Sample Data (Optional)

1. In Supabase **SQL Editor**, click **New query**
2. Open [supabase/seed.sql](../supabase/seed.sql)
3. Copy entire contents
4. Paste into SQL Editor
5. Click **Run**
6. Verify data is inserted

### Step 5: Enable Real-time

1. In Supabase, go to **Database** → **Replication**
2. For each relevant table, click the **Publication** toggle
3. Tables to enable:
   - `visitors`
   - `alerts`
   - `notifications`
   - `approvals`

---

## Environment Setup

### Step 1: Create `.env` File

Navigate to `server/` directory and create `.env`:

```bash
cd server
touch .env  # macOS/Linux
# Or for Windows: type nul > .env
```

### Step 2: Configure Environment Variables

Open `server/.env` in your editor and add:

```env
# ============================================
# SERVER CONFIGURATION
# ============================================
PORT=5001
NODE_ENV=development

# ============================================
# FIREBASE CONFIGURATION
# ============================================
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain.firebaseapp.com
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# ============================================
# SUPABASE CONFIGURATION
# ============================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ============================================
# JWT CONFIGURATION
# ============================================
JWT_SECRET=your_very_secure_random_secret_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# ============================================
# EMAIL CONFIGURATION (OPTIONAL)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@sentraai.com

# ============================================
# OTP CONFIGURATION
# ============================================
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3

# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=postgres
```

### Step 3: Secure `.env` File

Add `.env` to `.gitignore` (if not already):

```bash
# In project root
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Verify
cat .gitignore | grep -E "\.env"
```

### Step 4: Frontend Environment Setup

Frontend uses Vite environment variables. Create or update `client/.env.local`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5001/api
```

---

## Running the Application

### Development Mode

**Terminal 1 — Start Backend:**

```bash
cd server
npm start
```

Expected output:
```
Server running on http://localhost:5001
Connected to Supabase
Ready to accept connections
```

**Terminal 2 — Start Frontend:**

```bash
cd client
npm run dev
```

Expected output:
```
VITE v4.3.9  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Accessing the Application

1. Open browser and navigate to `http://localhost:5173`
2. You should see the **SentraAI Role Gateway** landing page
3. Click on **Admin**, **Guard**, or **Resident** portal
4. Use test credentials:
   - **Admin**: admin@sentraai.com / TestPassword123!
   - **Guard**: guard@sentraai.com / TestPassword123!
   - **Resident**: resident@sentraai.com / TestPassword123!

---

## Verification Checklist

After setup, verify everything works:

- [ ] Node.js and npm installed (`node --version`, `npm --version`)
- [ ] Repository cloned successfully
- [ ] Backend dependencies installed (`cd server && npm list`)
- [ ] Frontend dependencies installed (`cd client && npm list`)
- [ ] Firebase project created and credentials added
- [ ] Supabase project created and database initialized
- [ ] Environment variables configured in `server/.env`
- [ ] Frontend environment variables in `client/.env.local`
- [ ] Backend running on `localhost:5001`
- [ ] Frontend running on `localhost:5173`
- [ ] Role Gateway page loads without errors
- [ ] Can login with test credentials
- [ ] Dashboard displays without errors
- [ ] No console errors (F12 Developer Tools)

---

## Troubleshooting

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5001`

**Solution:**

```bash
# Kill process on port 5001 (Windows)
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or use different port
PORT=5002 npm start
```

### Module Not Found

**Error**: `Cannot find module 'react'`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# If issue persists, try:
npm cache clean --force
npm install
```

### CORS Errors in Console

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**

Verify `CORS_ORIGIN` in `server/.env`:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Firebase Authentication Fails

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution:**
1. Verify Firebase credentials in `.env`
2. Go to Firebase Console → Settings → API keys
3. Create new Web API key if needed
4. Ensure email/password auth is enabled

### Supabase Connection Issues

**Error**: `Error: Unable to connect to Supabase`

**Solution:**
1. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
2. Check Supabase project status (active = green)
3. Verify network connectivity
4. Check firewall/VPN settings

### Database Table Not Found

**Error**: `error: relation "visitors" does not exist`

**Solution:**
1. Go to Supabase → SQL Editor
2. Run [supabase/schema.sql](../supabase/schema.sql) again
3. Verify tables in Table Editor

### Hot Reload Not Working

**Error**: Frontend doesn't update on file save

**Solution:**
```bash
# Restart Vite dev server
# In Terminal: Ctrl+C to stop
npm run dev

# Clear browser cache (Ctrl+Shift+Delete)
# Force refresh (Ctrl+Shift+R)
```

---

## Next Steps

After successful setup:

1. **Explore**:
   - Navigate through different user roles
   - Test visitor registration workflow
   - Try approval process

2. **Customize**:
   - Update branding/colors in CSS
   - Add company logo
   - Configure notification settings

3. **Develop**:
   - Read [CONTRIBUTING.md](../CONTRIBUTING.md)
   - Check [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
   - Review code structure in README.md

4. **Deploy**:
   - See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
   - Configure production environment
   - Set up CI/CD pipeline

---

**Need Help?**
- GitHub Issues: [Create an issue](https://github.com/yourusername/SentraAI/issues)
- Documentation: [API Docs](../API_DOCUMENTATION.md)
- Discussions: [Community](https://github.com/yourusername/SentraAI/discussions)

---

**Last Updated**: November 2024
