const express = require('express');
const router = express.Router();
const { verifyToken, verifyFirebaseOnly, supabaseAdmin } = require('../middleware/auth');

/**
 * POST /api/auth/profile
 * Called after Google sign-in to sync firebase_uid with Supabase user record.
 * If the email exists without a firebase_uid (admin pre-provisioned), it links them.
 */
router.post('/profile', verifyFirebaseOnly, async (req, res) => {
  const { uid, email } = req.firebaseUser;

  // Try to find by firebase_uid first
  let { data: user } = await supabaseAdmin.from('users').select('*').eq('firebase_uid', uid).single();
  if (user) return res.json({ user });

  // Try to find by email (pre-provisioned by admin with PENDING_ uid)
  const { data: byEmail } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
  if (byEmail) {
    // Link the real firebase_uid
    const { data: updated } = await supabaseAdmin.from('users')
      .update({ firebase_uid: uid, avatar_url: req.body.photoURL || null, updated_at: new Date().toISOString() })
      .eq('id', byEmail.id).select().single();
    return res.json({ user: updated });
  }

  // If no record at all, auto-register the user!
  // First user ever → admin. Otherwise use the intendedRole from the portal they signed into.
  const { count } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true });
  const allowedRoles = ['admin', 'guard', 'resident'];
  const intendedRole = req.body?.intendedRole;
  const newRole = count === 0 ? 'admin' : (allowedRoles.includes(intendedRole) ? intendedRole : 'resident');

  // Use Google display name if available, fallback to email prefix
  const displayName = req.body?.displayName || email.split('@')[0];

  const { data: newUser, error: insertError } = await supabaseAdmin.from('users')
    .insert({
      firebase_uid: uid,
      email: email,
      name: displayName,
      role: newRole,
      status: 'active',
      avatar_url: req.body?.photoURL || null
    })
    .select()
    .single();

  if (insertError) {
    console.error('Registration error:', insertError);
    return res.status(500).json({ error: 'Failed to auto-register user.' });
  }

  console.log(`✅ New user registered: ${email} as ${newRole}`);
  return res.json({ user: newUser });
});

// GET /api/auth/me — returns the calling user's full profile
router.get('/me', verifyToken, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
