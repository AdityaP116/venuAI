const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app  = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ──────────────────────────────────────────────
const allowedOrigins = process.env.CORS_ORIGIN
  ? [process.env.CORS_ORIGIN]
  : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'];
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/visitors',      require('./routes/visitors'));
app.use('/api/otps',          require('./routes/otps'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/alerts',        require('./routes/alerts'));
app.use('/api/photos',        require('./routes/photos'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/guards',        require('./routes/guards'));
app.use('/api/checkpoints',   require('./routes/checkpoints'));
app.use('/api/cameras',       require('./routes/cameras'));
app.use('/api/shifts',        require('./routes/shifts'));

// ── Photo upload via Supabase Storage ──────────────────────
// (handled in routes/photos.js — uses multer memoryStorage + supabase.storage)

// ── AI Simulation (still useful for demo without real ML) ──
const { verifyToken } = require('./middleware/auth');

app.post('/api/ai/verify-face', verifyToken, (req, res) => {
  const faceMatch = Math.floor(Math.random() * 15) + 85;
  res.json({ success: true, faceMatch, isMatch: faceMatch >= 85, confidence: faceMatch / 100,
    message: faceMatch >= 85 ? 'Face verified successfully' : 'Face verification failed' });
});

app.post('/api/ai/trust-score', verifyToken, (req, res) => {
  const score = Math.floor(Math.random() * 60) + 40;
  const level = score >= 75 ? 'Low' : score >= 45 ? 'Medium' : 'High';
  const anomalies = [];
  if (level === 'High') anomalies.push('Potential identity mismatch');
  if (score < 50)        anomalies.push('Unusual visit pattern');
  res.json({ success: true, score, level, anomalies,
    factors: {
      faceRecognition: Math.floor(Math.random() * 20) + 80,
      visitHistory:    Math.floor(Math.random() * 30) + 70,
      behaviorPattern: Math.floor(Math.random() * 40) + 60,
      timeAnalysis:    Math.floor(Math.random() * 25) + 75,
    }
  });
});

app.post('/api/ai/anomaly-detect', verifyToken, (req, res) => {
  const anomalies = [];
  if (Math.random() > 0.7) anomalies.push({ type: 'face_mismatch',     confidence: 0.85 });
  if (Math.random() > 0.8) anomalies.push({ type: 'suspicious_timing', confidence: 0.72 });
  if (Math.random() > 0.9) anomalies.push({ type: 'blacklisted',       confidence: 0.95 });
  res.json({ success: true, anomaliesDetected: anomalies.length > 0, anomalies,
    overallRisk: anomalies.length > 1 ? 'high' : anomalies.length === 1 ? 'medium' : 'low' });
});

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'running', version: '2.0.0', uptime: process.uptime(), timestamp: new Date() });
});

// ── Catch Chrome DevTools probes to prevent CSP console errors ──
app.get('/.well-known/*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Static Files (React Frontend) ───────────────────────────
app.use(express.static(path.join(__dirname, '../dist')));

// ── Catch-all 404 & SPA handler ─────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛡️  SentraAI Server v2.0.0`);
  console.log(`✅ Running on http://localhost:${PORT}`);
  console.log(`🔐 Firebase Auth    → enabled`);
  console.log(`🗄️  Supabase DB      → ${process.env.SUPABASE_URL ? 'connected' : '⚠️  URL missing'}`);
  console.log(`\n📡 Routes:`);
  console.log(`   /api/auth, /api/admin, /api/visitors, /api/profile`);
  console.log(`   /api/otps, /api/notifications, /api/alerts, /api/photos`);
  console.log(`   /api/guards, /api/checkpoints, /api/cameras, /api/shifts`);
  console.log(`\n🚀 Ready!\n`);
});
