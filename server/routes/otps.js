const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify = require('../services/notificationService');

// GET /api/otps — admin: all | resident: own | guard: own
router.get('/', verifyToken, async (req, res) => {
  let query = supabaseAdmin.from('otps')
    .select('*, visitors(name, target_flat, photo_url, purpose), resident:users!otps_resident_id_fkey(name, email, flat_num), guard:users!otps_guard_id_fkey(name)')
    .order('created_at', { ascending: false });

  if (req.user.role === 'resident') query = query.eq('resident_id', req.user.id);
  if (req.user.role === 'guard') query = query.eq('guard_id', req.user.id);
  // admin sees all — no filter

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ otps: data });
});

// GET /api/otps/pending — pending OTPs for the calling resident
router.get('/pending', verifyToken, requireRole('resident'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('otps')
    .select('*, visitors(name, target_flat, photo_url, purpose, trust_score, trust_level)')
    .eq('resident_id', req.user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ otps: data });
});

// POST /api/otps/:id/approve — resident approves via OTP code
router.post('/:id/approve', verifyToken, requireRole('resident'), async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'OTP code is required' });

  // Fetch the OTP
  const { data: otp, error: fetchErr } = await supabaseAdmin.from('otps')
    .select('*').eq('id', req.params.id).eq('resident_id', req.user.id).single();

  if (fetchErr || !otp) return res.status(404).json({ error: 'OTP not found' });
  if (otp.status !== 'pending') return res.status(400).json({ error: `OTP is already ${otp.status}` });

  // Check expiry
  if (new Date() > new Date(otp.expires_at)) {
    await supabaseAdmin.from('otps').update({ status: 'expired' }).eq('id', otp.id);
    return res.status(400).json({ error: 'OTP has expired. Visitor must be re-logged.' });
  }

  // Validate code
  if (otp.code !== code.trim()) {
    return res.status(400).json({ error: 'Incorrect OTP code' });
  }

  // Approve OTP + update visitor status
  await Promise.all([
    supabaseAdmin.from('otps').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', otp.id),
    supabaseAdmin.from('visitors').update({ status: 'approved' }).eq('id', otp.visitor_id),
  ]);

  // Fetch visitor info for notification
  const { data: visitor } = await supabaseAdmin.from('visitors').select('name').eq('id', otp.visitor_id).single();
  await notify.notifyOtpApproved({ visitor, guardId: otp.guard_id, residentName: req.user.name });

  res.json({ success: true, message: 'Visitor approved successfully' });
});

// POST /api/otps/:id/reject — resident rejects
router.post('/:id/reject', verifyToken, requireRole('resident'), async (req, res) => {
  const { data: otp, error: fetchErr } = await supabaseAdmin.from('otps')
    .select('*').eq('id', req.params.id).eq('resident_id', req.user.id).single();

  if (fetchErr || !otp) return res.status(404).json({ error: 'OTP not found' });
  if (otp.status !== 'pending') return res.status(400).json({ error: `OTP is already ${otp.status}` });

  await Promise.all([
    supabaseAdmin.from('otps').update({ status: 'rejected' }).eq('id', otp.id),
    supabaseAdmin.from('visitors').update({ status: 'denied' }).eq('id', otp.visitor_id),
  ]);

  const { data: visitor } = await supabaseAdmin.from('visitors').select('name').eq('id', otp.visitor_id).single();
  await notify.notifyOtpRejected({ visitor, guardId: otp.guard_id, residentName: req.user.name });

  res.json({ success: true, message: 'Visitor denied' });
});

module.exports = router;
