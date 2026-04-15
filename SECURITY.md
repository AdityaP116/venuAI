# 🔐 SentraAI Security Guide

Security best practices, guidelines, and detailed security architecture.

---

## 📋 Table of Contents

1. [Security Principles](#security-principles)
2. [Authentication Security](#authentication-security)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Infrastructure Security](#infrastructure-security)
6. [Vulnerability Management](#vulnerability-management)
7. [Security Incident Response](#security-incident-response)
8. [Compliance](#compliance)

---

## 🛡️ Security Principles

### Defense in Depth

SentraAI implements multiple layers of security:

```
Layer 1: Network Security
├─ HTTPS/TLS encryption
├─ CORS validation
├─ WAF (optional)
└─ DDoS protection

Layer 2: Authentication
├─ Firebase Auth
├─ JWT tokens
├─ MFA (future)
└─ Session management

Layer 3: Authorization
├─ Role-Based Access Control (RBAC)
├─ Resource ownership checks
├─ API permission validation
└─ Feature flags

Layer 4: Data Protection
├─ Input validation
├─ Output encoding
├─ SQL parameterization
├─ Encryption at rest
└─ Encryption in transit

Layer 5: Auditing
├─ Activity logs
├─ Error tracking
├─ Performance monitoring
└─ Security alerts
```

### Core Principles

1. **Least Privilege** - Users have minimal required permissions
2. **Defense in Depth** - Multiple security layers
3. **Secure by Default** - Safe defaults, opt-in less secure features
4. **Zero Trust** - Don't trust any request automatically
5. **Fail Securely** - Deny access on errors
6. **Keep It Simple** - Complex security often has flaws

---

## 🔐 Authentication Security

### Firebase Authentication

#### Email/Password Security

```javascript
// ✅ Good: Firebase handles hashing
firebase.auth().signInWithEmailAndPassword(email, password)

// ❌ Bad: Never hash passwords on client
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update(password);
```

**Firebase Features:**
- Salted + bcrypt hashing
- Password complexity enforcement (optional)
- Account recovery flows
- Suspicious activity detection
- Anonymous login support

#### Google OAuth

```javascript
// ✅ Secure OAuth flow
const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider)
```

**Benefits:**
- Firebase handles OAuth securely
- User identity verified by Google
- No password exposure
- Automatic security updates

### JWT Token Security

#### Token Structure

```
Header.Payload.Signature

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": "...", "role": "...", "iat": ..., "exp": ... }
Signature: HMACSHA256(base64url(header) + "." + base64url(payload), secret)
```

#### Token Handling

```javascript
// ✅ Secure setup
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d', issuer: 'sentraai' }
);

// ✅ Secure verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// ❌ Insecure: Trusting unverified tokens
const decoded = jwt.decode(token); // No verification!
```

#### Token Storage (Frontend)

```javascript
// ✅ Best: Memory/Context (cleared on refresh)
const [token, setToken] = useState('');

// ⚠️ Acceptable: SessionStorage (cleared on browser close)
sessionStorage.setItem('token', token);

// ⚠️ Acceptable: HttpOnly Cookie (if properly configured)
// Set by server with HttpOnly, Secure, SameSite flags

// ❌ Worst: LocalStorage (persistent XSS risk)
localStorage.setItem('token', token); // Vulnerable to XSS
```

### Session Management

```javascript
// Set session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let sessionTimer = setTimeout(() => {
  // Force logout
  logout();
}, SESSION_TIMEOUT);

// Reset timer on activity
document.addEventListener('mousemove', () => {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(logout, SESSION_TIMEOUT);
});
```

---

## 🔒 Data Protection

### Encryption in Transit

```javascript
// ✅ HTTPS enforced
process.env.NODE_ENV === 'production' &&
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });

// ✅ Security headers
const helmet = require('helmet');
app.use(helmet());

// Includes:
// Strict-Transport-Security: HSTS
// Content-Security-Policy: CSP
// X-Content-Type-Options: nosniff
// X-Frame-Options: DENY
// X-XSS-Protection: block
```

### Encryption at Rest

```sql
-- Supabase handles encryption automatically
-- Tables encrypted with AES-256
-- Backups encrypted
-- Column-level encryption (if needed)

CREATE TABLE visitors (
  ...
  sensitive_data TEXT, -- Automatically encrypted
  ...
);
```

### Password Security

```javascript
// ✅ Firebase handles securely
firebase.auth().createUserWithEmailAndPassword(email, password)

// Password requirements (set in Firebase Console):
// - Minimum 6 characters (configurable)
// - Mix of upper/lower case (configurable)
// - Numbers (configurable)
// - Special characters (configurable)

// ❌ Never do this:
const hashedPassword = Buffer.from(password).toString('base64'); // Not encryption!
db.save({ password: hashedPassword }); // Never store passwords!
```

### Data Classification

```
Public Data
├─ Application name
├─ Public documentation
└─ General features

Confidential Data (Log IP, encrypt)
├─ User names/emails
├─ Visitor information
├─ Approval decisions
└─ System logs

Top Secret Data (Encrypt, audit, access control)
├─ JWT secrets
├─ API keys
├─ Database passwords
└─ Encryption keys
```

---

## 🔌 API Security

### Input Validation

```javascript
// ✅ Validate all inputs
const Joi = require('joi');

const visitorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^\+?[0-9]{10,15}$/).required(),
  purpose: Joi.string().max(500).required(),
});

app.post('/api/visitors', (req, res) => {
  const { error, value } = visitorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details });
  // Process validated data
});

// ❌ Never trust user input
app.post('/api/visitors', (req, res) => {
  const visitor = req.body; // No validation!
  db.create(visitor);
});
```

### SQL Injection Prevention

```javascript
// ✅ Parameterized queries (safe)
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
);

// ❌ String concatenation (vulnerable!)
const result = await db.query(
  `SELECT * FROM users WHERE email = '${userEmail}'`
);
// Attack: userEmail = "'; DROP TABLE users; --"
```

### XSS Prevention

```javascript
// ✅ Output encoding (React does this by default)
<div>{userInput}</div> /* Safe - React encodes */

// ✅ Sanitize HTML if needed
const DOMPurify = require('dompurify');
const clean = DOMPurify.sanitize(userInput);

// ❌ Never use dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> /* Unsafe! */
```

### CSRF Prevention

```javascript
// ✅ CSRF tokens
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: false });

app.post('/api/visitors', csrfProtection, (req, res) => {
  // Process POST
});

// In form:
<form method="post">
  <input type="hidden" name="_csrf" value={csrfToken} />
</form>

// ❌ SameSite cookie alternative
res.cookie('session', token, { SameSite: 'Strict' });
```

### CORS Configuration

```javascript
// ✅ Strict CORS configuration
const cors = require('cors');

const allowedOrigins = [
  'https://sentraai.com',
  'https://www.sentraai.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// ❌ Allow all origins (insecure)
app.use(cors()); // Allows ANY origin!
```

### Rate Limiting

```javascript
// ✅ Rate limiting enabled
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all API routes
app.use('/api/', limiter);

// Stricter limit for auth endpoint
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  skipSuccessfulRequests: true,
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  // Handle login
});
```

---

## 🏗️ Infrastructure Security

### Environment Variables

```bash
# ✅ Secure practices
export JWT_SECRET=$(openssl rand -hex 32)
export SUPABASE_ANON_KEY="secure_key_from_supabase"

# ✅ Never commit secrets to git
echo ".env" > .gitignore
echo ".env.local" >> .gitignore

# ✅ Use environment management
# GitHub Secrets, Railway Variables, Render Environment
```

### Dependency Management

```bash
# ✅ Check for vulnerabilities regularly
npm audit

# ✅ Fix vulnerabilities
npm audit fix

# ✅ Update dependencies safely
npm update

# ✅ Lock dependency versions
npm ci # Uses package-lock.json

# ❌ Never use old/unmaintained packages
```

### Database Security

```sql
-- ✅ Enable SSL connections
ALTER SYSTEM SET ssl = on;

-- ✅ Supabase provides SSL certificates
-- Connection string: postgresql://user:password@host/db?sslmode=require

-- ✅ Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY visitors_policy ON visitors
  FOR SELECT
  USING (auth.uid() = created_by OR auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  ));

-- ✅ Backup security (automatic)
-- Supabase backups encrypted, retention set
```

### API Key Security

```javascript
// ✅ Never expose API keys
export const apiConfig = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY, // Limited permissions
};

// ❌ Never expose service role key on frontend
export const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // NO!

// ✅ Use service role key only on backend
const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
); // Backend only
```

---

## 🐛 Vulnerability Management

### Common Vulnerabilities

| Vulnerability | Prevention | Status |
|---|---|---|
| SQL Injection | Parameterized queries | ✅ Implemented |
| XSS | Output encoding, CSP | ✅ Implemented |
| CSRF | CSRF tokens, SameSite | ✅ Implemented |
| Insecure Direct Object References | Authorization checks | ✅ Implemented |
| Broken Access Control | RBAC, role checks | ✅ Implemented |
| Sensitive Data Exposure | Encryption, HTTPS | ✅ Implemented |
| Weak Cryptography | Strong algorithms | ✅ Firebase handles |
| Insecure Dependencies | Regular audits | ✅ In process |

### Dependency Scanning

```bash
# Automated scanning
npm audit --production

# View vulnerabilities
npm audit --json

# Fix automatically where possible
npm audit fix

# Update to latest safe versions
npm update --save
```

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

---

## 🚨 Security Incident Response

### Incident Classification

```
Critical (Respond immediately)
├─ Active exploitation
├─ Data breach
└─ Service unavailable

High (Respond within hours)
├─ Authentication bypass
├─ Unauthorized access
└─ Data compromise

Medium (Respond within 24 hours)
├─ Vulnerability discovered
├─ Access control issue
└─ Configuration error

Low (Respond within 7 days)
├─ Weak security practice
├─ Outdated dependency
└─ Documentation issue
```

### Incident Response Process

```
1. DETECT
   ├─ Monitor alerts
   ├─ Receive reports
   └─ Automated scans

2. ANALYZE
   ├─ Confirm incident
   ├─ Assess scope
   ├─ Identify impact
   └─ Determine root cause

3. CONTAIN
   ├─ Stop active threats
   ├─ Isolate systems
   ├─ Preserve evidence
   └─ Prevent spread

4. ERADICATE
   ├─ Remove malicious code
   ├─ Patch vulnerabilities
   ├─ Fix misconfigurations
   └─ Update security

5. RECOVER
   ├─ Restore services
   ├─ Verify integrity
   ├─ Monitor systems
   └─ Restore backups

6. LEARN
   ├─ Conduct postmortem
   ├─ Update procedures
   ├─ Improve monitoring
   └─ Share lessons
```

### Reporting Security Issues

**Do NOT open public GitHub issues for security bugs!**

Instead, email: **security@sentraai.com**

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

---

## 📋 Compliance

### Data Privacy (GDPR)

- ✅ User consent for data collection
- ✅ Privacy policy available
- ✅ Right to access personal data
- ✅ Right to be forgotten (delete account)
- ✅ Data portability (export data)
- ✅ Breach notification (72 hours)

### SOC 2 Compliance

- ✅ Access controls (RBAC)
- ✅ Audit logs (complete activity trail)
- ✅ Encryption (transit and rest)
- ✅ Incident response (procedures)
- ✅ Change management (versioning)
- ✅ Monitoring & alerting

### Regular Security Audits

```
Quarterly
├─ Dependency scanning
├─ Code review sample
└─ Access control review

Annually
├─ Penetration testing
├─ Security audit
├─ Compliance review
└─ Disaster recovery test
```

---

## 🔍 Security Checklist

Before production deployment:

- [ ] All secrets in environment variables
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Authentication working
- [ ] Authorization checks in place
- [ ] Audit logging enabled
- [ ] Error handling secure (no info leaks)
- [ ] Dependencies audited
- [ ] No console.log of sensitive data
- [ ] Security headers set
- [ ] Monitoring & alerting configured
- [ ] Backup procedures tested
- [ ] Incident response plan documented

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: November 2024

**For security issues, email: security@sentraai.com**
