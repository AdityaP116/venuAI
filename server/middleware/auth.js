const admin = require('firebase-admin');

// Initialize Firebase Admin (once)
if (process.env.FIREBASE_PROJECT_ID && !admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
} else if (!process.env.FIREBASE_PROJECT_ID) {
  console.warn("⚠️  FIREBASE_PROJECT_ID is missing. Firebase Admin SDK will not be initialized.");
}

const { createClient } = require('@supabase/supabase-js');
let supabaseAdmin;
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://YOUR_PROJECT_REF.supabase.co') {
  supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn("⚠️  SUPABASE_URL is missing. Supabase Admin will not be initialized.");
  // Mock object to prevent immediate crashes in the rest of the codebase
  supabaseAdmin = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => ({ data: null, error: { message: "Supabase not configured" } }) }), order: () => ({ limit: () => ({}) }) }),
      insert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: "Supabase not configured" } }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => ({ data: null, error: { message: "Supabase not configured" } }) }) }) }),
      delete: () => ({ eq: () => ({ error: { message: "Supabase not configured" } }) })
    }),
    storage: {
      from: () => ({
        upload: () => ({ error: { message: "Supabase not configured" } }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: () => ({ error: { message: "Supabase not configured" } })
      })
    }
  };
}

/**
 * verifyFirebaseOnly — validates Firebase ID token ONLY.
 * Does NOT require a Supabase record. Used for the registration/profile-sync endpoint.
 * Attaches req.firebaseUser (uid, email)
 */
async function verifyFirebaseOnly(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = auth.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired Firebase token' });
  }
}

/**
 * verifyToken — validates Firebase ID token AND requires existing Supabase profile.
 * Attaches req.firebaseUser  (uid, email)
 * Attaches req.user          (full Supabase profile row)
 */
async function verifyToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = auth.split('Bearer ')[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = { uid: decoded.uid, email: decoded.email };

    // Fetch Supabase profile
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('firebase_uid', decoded.uid)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: 'User not provisioned in system. Contact administrator.' });
    }
    req.user = data;
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * requireRole — must come after verifyToken.
 * Usage: router.get('/path', verifyToken, requireRole('admin'), handler)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
}

module.exports = { verifyToken, verifyFirebaseOnly, requireRole, supabaseAdmin };
