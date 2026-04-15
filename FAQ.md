# ❓ SentraAI FAQ

Frequently asked questions and quick answers.

---

## 📋 Table of Contents

- [General](#general)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)

---

## General

### Q: What is SentraAI?

**A:** SentraAI is an enterprise-grade visitor management and access control system designed for residential complexes, corporate offices, and secure facilities. It provides real-time visitor tracking, approval workflows, and comprehensive analytics with AI-powered insights.

### Q: Who should use SentraAI?

**A:** SentraAI is ideal for:
- Residential apartment complexes
- Corporate office buildings
- Hospital/Medical facilities
- Government offices
- Educational institutions
- Any facility requiring visitor management

### Q: What are the main features?

**A:** Main features include:
- Multi-role portal system (Admin, Guard, Resident)
- Real-time visitor check-in and registration
- QR code-based visitor passes
- AI-powered visitor verification (simulated)
- Approval workflow system
- Real-time notifications
- Comprehensive analytics dashboard
- Audit logging and activity tracking
- Mobile-responsive interface
- Alert management system

### Q: Is SentraAI open source?

**A:** Yes! SentraAI is open source under the MIT License. You can freely use, modify, and distribute it.

### Q: What is the tech stack?

**A:** 
- **Frontend:** React 18.2, Vite, React Router
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Firebase Auth
- **Styling:** Vanilla CSS3

### Q: Can I use SentraAI commercially?

**A:** Yes! MIT License allows commercial use. The only requirement is to include the license in your distribution.

---

## Setup & Installation

### Q: Do I need special hardware?

**A:** No. SentraAI runs on standard hardware:
- Any modern server (1GB RAM minimum)
- Any computer with Node.js
- Any modern web browser
- Optional: Camera/QR scanner for Check-in

### Q: What are the minimum system requirements?

**A:** 
- **Node.js** v14 or higher
- **npm** v6 or higher
- **4GB RAM** (development), **8GB RAM** (production)
- **Modern browser** (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Q: How long does setup take?

**A:** With QUICK_START.md, you can be running in **5 minutes**. Full setup with Firebase and Supabase configuration takes about **15-20 minutes**.

### Q: Can I use SentraAI without Firebase?

**A:** Currently, Firebase Auth is required for authentication. However, you can modify the code to use any auth provider (Supabase Auth, Auth0, Keycloak, etc.).

### Q: Can I self-host Supabase?

**A:** Supabase can be self-hosted using Docker, but we recommend using Supabase Cloud for simplicity. Alternatively, you can use any PostgreSQL database.

### Q: What if I need help with setup?

**A:** Check these resources:
1. [QUICK_START.md](QUICK_START.md) - 5-minute quick start
2. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
3. GitHub Issues - Ask questions
4. Email: support@sentraai.com

---

## Usage

### Q: How do I add a new user?

**A:** 
1. Login as Admin
2. Navigate to Admin Panel
3. Click "Create User"
4. Fill in user details and role
5. Click Create

### Q: How do I check in a visitor?

**A:**
1. Login as Guard
2. Go to "Visitor Entry"
3. Fill visitor information (name, email, phone, purpose, unit)
4. Upload/capture photo (optional)
5. Click "Register Visitor"
6. Guard receives QR code

### Q: How do I approve a visitor as a resident?

**A:**
1. Receive notification (in-app, email, SMS)
2. Login to Resident portal
3. Go to "Approvals"
4. Click on pending visitor
5. Click "Approve" or "Deny"
6. Guard is notified immediately

### Q: Can I retroactively change a visitor status?

**A:** Yes, as Admin:
1. Go to Dashboard or Logs
2. Find the visitor
3. Click on their record
4. Change status
5. Save changes

### Q: Can multiple people approve one visitor?

**A:** Currently, one approval per visitor. The first approval/denial is final. (Multi-approval coming in Phase 2)

### Q: Can I bulk import visitors?

**A:** Not yet. Manual registration is currently required. Bulk import is on the roadmap.

### Q: How do I export reports?

**A:** As Admin:
1. Go to Analytics
2. Select date range
3. Click "Export" button
4. Choose format (PDF or CSV)
5. Download report

### Q: Can I schedule recurring visitors?

**A:** Not yet. Each visit requires separate approval. Recurring visitor profiles coming in Phase 2.

---

## Troubleshooting

### Q: I get "Connection Refused" error

**A:** 
- Verify backend is running: `npm start` in server folder
- Check PORT in .env (should be 5001)
- Try different port: `PORT=5002 npm start`

### Q: "Firebase: Error (auth/invalid-api-key)"

**A:**
- Verify Firebase credentials in .env
- Check if auth is enabled in Firebase Console
- Ensure API key is correct
- Check if project is active

### Q: "Unable to connect to Supabase"

**A:**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check if Supabase project is active
- Run database migrations: Check schema.sql executed
- Verify network connectivity

### Q: CORS errors in browser console

**A:**
- Update CORS_ORIGIN in .env to match frontend URL
- Example: `CORS_ORIGIN=http://localhost:5173`
- Restart backend server

### Q: "Module not found" errors

**A:**
```bash
cd server
npm install
# or
npm install --force
```

### Q: Changes to code not reflected (hot reload not working)

**A:**
- Frontend: Stop Vite server (Ctrl+C), restart with `npm run dev`
- Backend: Restart Node server
- Clear browser cache (Ctrl+Shift+Delete)
- Force refresh (Ctrl+Shift+R)

### Q: Port already in use

**A:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5001
kill -9 <PID>

# Or use diferent port
PORT=5002 npm start
```

### Q: Database says "relation does not exist"

**A:**
- Run schema.sql in Supabase SQL Editor
- Verify all tables created
- Check Table Editor in Supabase

### Q: Can't login with test credentials

**A:**
- Verify Firebase is running
- Check if user exists in Firebase Console
- Verify email/password are correct (case-sensitive)
- Check if email/password auth is enabled in Firebase

### Q: Slow API responses

**A:**
- Check database connection
- Verify indexes created
- Monitor server CPU/memory
- Check network latency
- See [PERFORMANCE.md](PERFORMANCE.md)

---

## Development

### Q: How do I add a new page?

**A:**
1. Create component: `src/pages/NewPage.jsx`
2. Create stylesheet: `src/pages/NewPage.css`
3. Add route in `App.jsx`
4. Import and add to appropriate role layout
5. Test all three roles have access (if applicable)

### Q: How do I add a new API endpoint?

**A:**
1. Create route file: `server/routes/newResource.js`
2. Implement GET/POST/PUT/DELETE handlers
3. Add authentication middleware
4. Import route in `server/index.js`
5. Test with Postman
6. Document in API_DOCUMENTATION.md

### Q: Can I modify the UI colors?

**A:** Yes! CSS is in `src/index.css`:
```css
:root {
  --primary-color: #8b5cf6; /* Change this */
  --secondary-color: #22d3ee;
}
```

### Q: How do I add authentication for a new role?

**A:**
1. Create new role in Firebase/Database
2. Create new layout: `src/pages/newRole/NewRoleLayout.jsx`
3. Create login: `src/pages/newRole/NewRoleLogin.jsx`
4. Add routes: `/newrole/login`, `/newrole/dashboard`
5. Update RBAC in backend
6. Add to RoleGateway

### Q: Can I remove a role?

**A:** Yes:
1. Back up database
2. Remove role routes from App.jsx
3. Remove from role layouts
4. Remove from RoleGateway
5. Update backend RBAC
6. Test thoroughly

### Q: How do I run tests?

**A:**
```bash
npm test # Run unit tests
npm run test:e2e # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

See [TESTING.md](TESTING.md) for detailed guide.

### Q: Where do I add logging?

**A:**
```javascript
import logger from './services/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Failed to load visitors', { error });
logger.debug('Query result', { data });
```

### Q: How do I add a new dependency?

**A:**
```bash
npm install package-name
# or for development only
npm install --save-dev package-name
```

---

## Deployment

### Q: What are hosting options?

**A:**
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** Railway, Render, Heroku, AWS
- **Database:** Supabase Cloud, AWS RDS, DigitalOcean

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Q: How do I set environment variables in Vercel?

**A:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable
5. Deploy

### Q: Can I use a custom domain?

**A:** Yes:
1. Buy domain from registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records to your hosting provider
3. Enable HTTPS (automatic on Vercel)
4. Test domain

### Q: How do I set up SSL/HTTPS?

**A:**
- **Vercel:** Auto-provisioned
- **Railway:** Auto-provisioned
- **Render:** Auto-provisioned
- **Self-hosted:** Use Let's Encrypt (Certbot)

### Q: What's the minimum production setup?

**A:**
- Frontend: Vercel (free tier)
- Backend: Railway (free tier)
- Database: Supabase (free tier)
- Auth: Firebase (free tier)

Total cost: $0-10/month depending on usage.

### Q: How do I scale for more users?

**A:**
- Add database replicas
- Use caching layer (Redis)
- Load balancer for servers
- CDN for static assets
- See [PERFORMANCE.md](PERFORMANCE.md)

### Q: How do I backup production database?

**A:**
- Supabase: Settings → Backups (auto-configured)
- Manual: Export database via pg_dump
- Schedule: Set automated daily backups

---

## Security

### Q: Is my data encrypted?

**A:** Yes:
- HTTPS/TLS for data in transit
- AES-256 encryption at rest (Supabase)
- Passwords securely hashed (Firebase)
- Secrets in environment variables

See [SECURITY.md](SECURITY.md) for details.

### Q: Can I set up 2FA?

**A:** Not yet in core. Roadmap for Phase 2.
You can enable in Firebase Console for admin accounts.

### Q: How do I report a security issue?

**A:** Email: **security@sentraai.com**
- DO NOT post in GitHub issues
- Include description, steps to reproduce
- Allow 48 hours for response

### Q: What compliance standards apply?

**A:**
- GDPR-ready (CCPA compliance)
- SOC 2 Type II (auditable)
- HIPAA (if medical facility)

See [SECURITY.md](SECURITY.md) for compliance checklist.

### Q: Can I self-host everything?

**A:** Yes:
- Frontend: Any static hosting or server
- Backend: Any VPS or server
- Database: PostgreSQL on VPS
- Auth: Supabase self-hosted or custom

---

## Still Have Questions?

**Resources:**
- 📖 [README.md](README.md) - Project overview
- 🚀 [QUICK_START.md](QUICK_START.md) - 5-minute setup
- 🛠️ [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- 📡 [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- 🧪 [TESTING.md](TESTING.md) - Testing guide
- 🔐 [SECURITY.md](SECURITY.md) - Security guide
- ⚡ [PERFORMANCE.md](PERFORMANCE.md) - Performance tips
- 📝 [CODING_STANDARDS.md](CODING_STANDARDS.md) - Code style

**Contact:**
- 📧 Email: support@sentraai.com
- 🐛 GitHub Issues: [Create Issue](https://github.com/yourusername/SentraAI/issues)
- 💬 Discussions: [Community](https://github.com/yourusername/SentraAI/discussions)

---

**Last Updated**: November 2024
