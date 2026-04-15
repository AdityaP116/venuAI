# SentraAI Deployment Guide

Production deployment guide for SentraAI with step-by-step instructions.

---

## 📋 Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Frontend Deployment](#frontend-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Database Migration](#database-migration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Rollback Procedure](#rollback-procedure)

---

## Deployment Overview

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Production                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (CDN)    Backend (Cloud)   Database (SQL) │
│  Vercel/Netlify    Railway/Render    Supabase       │
│  Next.js Build     Node.js Server    PostgreSQL     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Recommended Platforms

| Component | Recommended | Alternative |
|---|---|---|
| Frontend | Vercel | Netlify, GitHub Pages |
| Backend | Railway | Render, Heroku, AWS |
| Database | Supabase | AWS RDS, DigitalOcean |
| Storage | Supabase Storage | AWS S3, Cloudinary |
| Logging | LogRocket | Sentry, DataDog |

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm test`)
- [ ] No console warnings or errors
- [ ] Environment variables configured for production
- [ ] Database migrations completed
- [ ] API endpoints verified in staging
- [ ] SSL/HTTPS configured
- [ ] Backup of current production database
- [ ] Monitoring/alerting configured
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled if needed

---

## Frontend Deployment

### Option 1: Deploy to Vercel

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Project Setup**

```bash
cd client
vercel
# Follow interactive prompts
# - Confirm project name
# - Select framework: Vite
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

**Step 3: Configure Environment Variables**

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add production variables:

```
VITE_FIREBASE_API_KEY=production_key
VITE_FIREBASE_AUTH_DOMAIN=prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prod-project
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key
VITE_API_URL=https://api.sentraai.com
```

**Step 4: Deploy**

```bash
vercel --prod
```

**Step 5: Configure Domain**

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records (provided by Vercel)

### Option 2: Deploy to Netlify

**Step 1: Connect GitHub**

1. Go to [Netlify](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Select GitHub
4. Choose your repository

**Step 2: Configure Build**

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

**Step 3: Environment Variables**

Go to **Site settings** → **Build & deploy** → **Environment**

Add all `VITE_*` variables

**Step 4: Deploy**

Automatic deployment on `main` branch push

---

## Backend Deployment

### Option 1: Deploy to Railway

**Step 1: Create Railway Account**

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub

**Step 2: Create New Project**

1. Click **Create New Project**
2. Connect GitHub repository
3. Select `server` as root directory

**Step 3: Configure Environment**

In Railway Dashboard:
1. Go to **Variables**
2. Add all production variables from `.env`

```
PORT=5001
NODE_ENV=production
FIREBASE_API_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
```

**Step 4: Deploy**

Railway auto-deploys on GitHub push

**Step 5: Get Production URL**

Go to **Settings** → find generated URL:
```
https://sentraai-api-prod-xxxx.railway.app
```

### Option 2: Deploy to Render

**Step 1: Create Render Account**

1. Go to [Render](https://render.com/)
2. Sign up with GitHub

**Step 2: Create Web Service**

1. Click **New** → **Web Service**
2. Connect GitHub repository
3. Configure:
   - **Root directory**: `server`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Environment**: Node

**Step 3: Set Environment Variables**

In Render Dashboard → **Environment**:
Add all production `.env` variables

**Step 4: Deploy**

Click **Create Web Service**

---

## Database Migration

### Step 1: Backup Existing Database

```bash
# Export current database
pg_dump postgresql://user:password@db.supabase.co:5432/postgres > backup.sql

# Or use Supabase Dashboard:
# Settings → Database → Backups → Create Backup
```

### Step 2: Apply Latest Migrations

```bash
# Run migration scripts
node migrations/run.js

# Or via SQL Editor in Supabase:
# Paste latest migration SQL and execute
```

### Step 3: Verify Data Integrity

```bash
# Connect to production database
psql postgresql://user:password@db.supabase.co:5432/postgres

# Verify tables
\dt

# Check row counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM visitors;
SELECT COUNT(*) FROM alerts;
```

### Step 4: Test Critical Paths

- ✅ User login flow
- ✅ Visitor registration
- ✅ Approval workflow
- ✅ Notification sending
- ✅ Report generation

---

## Production Environment Variables

### Backend (Production `.env`)

```env
# ============================================
# SERVER
# ============================================
PORT=5001
NODE_ENV=production

# ============================================
# FIREBASE (Production Project)
# ============================================
FIREBASE_API_KEY=prod_api_key
FIREBASE_AUTH_DOMAIN=prod.firebaseapp.com
FIREBASE_PROJECT_ID=prod-project
FIREBASE_STORAGE_BUCKET=prod.appspot.com
FIREBASE_MESSAGING_SENDER_ID=prod_sender
FIREBASE_APP_ID=prod_app_id

# ============================================
# SUPABASE (Production Project)
# ============================================
SUPABASE_URL=https://prod.supabase.co
SUPABASE_ANON_KEY=prod_anon_key_long_string
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key

# ============================================
# JWT
# ============================================
JWT_SECRET=very_long_random_secret_key_minimum_32_chars
JWT_EXPIRES_IN=7d

# ============================================
# CORS
# ============================================
CORS_ORIGIN=https://sentraai.com,https://www.sentraai.com

# ============================================
# EMAIL (Production SMTP)
# ============================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=prod_sendgrid_password
SMTP_FROM=noreply@sentraai.com

# ============================================
# SECURITY
# ============================================
SESSION_SECRET=prod_session_secret
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# MONITORING
# ============================================
SENTRY_DSN=https://sentry.io/...
LOG_LEVEL=info
```

---

## Monitoring & Maintenance

### Health Checks

Add health check endpoint monitoring:

```bash
# Every 5 minutes, check:
curl https://api.sentraai.com/api/health

# Should return:
{
  "status": "ok",
  "uptime": 12345,
  "database": "connected"
}
```

### Error Tracking

1. **Set up Sentry**:
   - Go to [Sentry.io](https://sentry.io/)
   - Create new project
   - Add `SENTRY_DSN` to environment

2. **Configure in Backend**:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```bash
# Monitor database performance
SELECT query, mean_time FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

# Check API response times
# Use Vercel Analytics or Railway metrics
```

### Automated Backups

Configure Supabase backups:
1. Go to Supabase → **Settings** → **Backups**
2. Enable automated backups
3. Set frequency: Daily
4. Retention: 30 days

---

## SSL/HTTPS Configuration

### DNS Setup

1. **For Vercel**:
   - Vercel auto-provisions SSL certificate
   - Update DNS CNAME record to Vercel domain

2. **For Render**:
   - Render auto-provisions SSL via Let's Encrypt
   - Update DNS CNAME record

3. **For Railway**:
   - Go to **Settings** → **Domain**
   - Add custom domain
   - Update DNS records
   - SSL auto-provisioned

### HTTPS Redirect

Ensure all HTTP traffic redirects to HTTPS. In Express:

```javascript
const helmet = require("helmet");
const app = express();

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use(helmet()); // Security headers
```

---

## Rollback Procedure

### If Deployment Fails

**Step 1: Identify Issue**

```bash
# Check logs in deployment platform
# Vercel: Deployments → Failed build
# Railway: Logs tab
# Render: Logs
```

**Step 2: Revert Code**

```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Deployment automatically triggers
```

**Step 3: Database Rollback (if needed)**

```bash
# Restore from backup
pg_restore postgresql://user:password@db.supabase.co:5432/postgres < backup.sql

# Or via Supabase:
# Settings → Backups → Restore backup
```

**Step 4: Verify Rollback**

- ✅ Application loads
- ✅ API endpoints respond
- ✅ Database queries work
- ✅ No errors in logs

### Post-Rollback

1. Investigate root cause
2. Create issue on GitHub
3. Fix in development
4. Test thoroughly
5. Redeploy when ready

---

## Performance Optimization

### Frontend Optimization

```bash
# Check bundle size
npm run build
# Review dist/ folder size

# Analyze bundle
npm install -g webpack-bundle-analyzer
# Add to Vite config
```

### Backend Optimization

```javascript
// Enable compression
const compression = require("compression");
app.use(compression());

// Database connection pooling
const { Pool } = require("pg");
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
});

// Cache frequently accessed data
const redis = require("redis");
const client = redis.createClient();
```

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection via helmet.js
- [ ] CSRF tokens implemented
- [ ] Sensitive data encrypted
- [ ] Access logs enabled
- [ ] Security headers set
- [ ] Dependency vulnerabilities checked (`npm audit`)

---

## Troubleshooting Deployment

### Build Fails

```bash
# Check Node version compatibility
node --version

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build locally
npm run build
```

### Database Connection Fails

```bash
# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test connection
psql $SUPABASE_URL
```

### High Memory Usage

```javascript
// Add memory monitoring
const os = require("os");

setInterval(() => {
  const memory = os.freemem() / os.totalmem();
  console.log(`Memory usage: ${(1 - memory) * 100}%`);
}, 60000);
```

---

## Support & Escalation

**Deployment Issues?**
- Check deployment platform logs
- Verify environment variables
- Test locally first
- Create GitHub issue

**Need Help?**
- Email: ops@sentraai.com
- GitHub: [Issues](https://github.com/yourusername/SentraAI/issues)
- Slack: #deployment channel

---

**Last Updated**: November 2024
