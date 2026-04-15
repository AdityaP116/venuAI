const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify = require('../services/notificationService');

// GET /api/visitors — filtered by role
router.get('/', verifyToken, async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  let query = supabaseAdmin.from('visitors')
    .select('*, guard:users!visitors_logged_by_fkey(name, email), resident:users!visitors_target_resident_id_fkey(name, flat_num, b_num, b_wing_alphabet)')
    .order('created_at', { ascending: false });

  // Residents only see their own flat's visitors
  if (req.user.role === 'resident') {
    query = query.eq('target_resident_id', req.user.id);
  }
  if (status) query = query.eq('status', status);
  if (search) query = query.ilike('name', `%${search}%`);

  const from = (page - 1) * limit;
  query = query.range(from, from + parseInt(limit) - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ visitors: data, total: count, page: parseInt(page) });
});

// GET /api/visitors/:id
router.get('/:id', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin.from('visitors')
    .select('*, guard:users!visitors_logged_by_fkey(name), resident:users!visitors_target_resident_id_fkey(name, flat_num)')
    .eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Visitor not found' });

  // Residents mark as viewed when they open the visitor record
  if (req.user.role === 'resident' && data.target_resident_id === req.user.id) {
    await supabaseAdmin.from('visitors').update({ viewed_by_resident: true }).eq('id', req.params.id);
  }
  res.json({ visitor: data });
});

// POST /api/visitors — guard logs a new visitor
router.post('/', verifyToken, requireRole('guard'), async (req, res) => {
  const { name, phone, purpose, target_flat, target_resident_id, photo_url, trust_score, trust_level, captured_at, captured_by_guard_id: _captured_by_guard_id } = req.body;
  if (!name || !target_flat) return res.status(400).json({ error: 'name and target_flat are required' });

  const score = trust_score ?? Math.floor(Math.random() * 60) + 40;
  const level = trust_level ?? (score >= 75 ? 'Low' : score >= 45 ? 'Medium' : 'High');

  // Generate unique visitor ID: VIS-{PHONE_LAST6}-{UNIX_TS}
  const phoneSuffix = phone ? phone.replace(/\D/g, '').slice(-6).padStart(6, '0') : 'XXXXXX';
  const visitorUniqueId = `VIS-${phoneSuffix}-${Date.now()}`;

  // Create visitor record
  const { data: visitor, error: vErr } = await supabaseAdmin.from('visitors').insert({
    name, phone, purpose, target_flat, target_resident_id,
    photo_url: photo_url || null,
    trust_score: score, trust_level: level,
    status: level === 'High' ? 'denied' : 'pending',
    logged_by: req.user.id,
    viewed_by_resident: false,
    entry_time: new Date().toISOString(),
    visitor_unique_id: visitorUniqueId,
    captured_at: captured_at || null,
  }).select().single();
  if (vErr) return res.status(500).json({ error: vErr.message });

  // Generate OTP
  let otp = null;
  if (visitor.status === 'pending' && target_resident_id) {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { data: otpData } = await supabaseAdmin.from('otps').insert({
      code: otpCode,
      visitor_id: visitor.id,
      resident_id: target_resident_id,
      guard_id: req.user.id,
      status: 'pending',
      expires_at: expiresAt,
    }).select().single();
    otp = otpData;

    // Link OTP to visitor
    await supabaseAdmin.from('visitors').update({ otp_id: otpData?.id }).eq('id', visitor.id);

    // Notify resident
    if (target_resident_id) {
      await notify.notifyVisitorArrival({ visitor, residentId: target_resident_id });
      await notify.notifyOtpGenerated({ otp: otpData, visitor, residentId: target_resident_id });
    }
  }

  // High-risk alert
  if (level === 'High') {
    const { data: _newAlert } = await supabaseAdmin.from('alerts').insert({
      type: 'face_mismatch', title: 'High Risk Visitor Detected',
      severity: 'high', visitor_id: visitor.id, location: 'Main Gate', read: false, resolved: false,
    }).select().single();

    // Notify all admins
    const { data: admins } = await supabaseAdmin.from('users').select('id').eq('role', 'admin').eq('status', 'active');
    await notify.notifyHighRisk({ visitor, guardId: req.user.id, adminIds: (admins || []).map(a => a.id) });
  }

  res.json({ success: true, visitor, otp_code: otp?.code || null,
    message: level === 'High' ? 'Access denied – high risk detected' : 'Visitor logged, OTP sent to resident' });
});

// PUT /api/visitors/:id/approve — admin, guard, or the target resident
router.put('/:id/approve', verifyToken, async (req, res) => {
  // Residents can only approve visitors targeted at them
  if (req.user.role === 'resident') {
    const { data: v } = await supabaseAdmin.from('visitors').select('target_resident_id').eq('id', req.params.id).single();
    if (v?.target_resident_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  }
  const { data: visitor, error } = await supabaseAdmin.from('visitors')
    .update({ status: 'approved' }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, visitor });
});

// PUT /api/visitors/:id/deny — admin, guard, or the target resident
router.put('/:id/deny', verifyToken, async (req, res) => {
  if (req.user.role === 'resident') {
    const { data: v } = await supabaseAdmin.from('visitors').select('target_resident_id').eq('id', req.params.id).single();
    if (v?.target_resident_id !== req.user.id) return res.status(403).json({ error: 'Access denied' });
  }
  const { data: visitor, error } = await supabaseAdmin.from('visitors')
    .update({ status: 'denied' }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, visitor });
});

// PUT /api/visitors/:id/exit
router.put('/:id/exit', verifyToken, requireRole('admin', 'guard'), async (req, res) => {
  const { data: visitor, error } = await supabaseAdmin.from('visitors')
    .update({ status: 'exited', exit_time: new Date().toISOString() }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });

  // Notify resident that visitor has left
  if (visitor?.target_resident_id) {
    await notify.notifyVisitorExited({ visitor, residentId: visitor.target_resident_id });
  }
  res.json({ success: true, visitor });
});

module.exports = router;
