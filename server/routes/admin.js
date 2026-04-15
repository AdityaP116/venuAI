const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify = require('../services/notificationService');

// GET /api/admin/users — all users
router.get('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('users').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ users: data });
});

// POST /api/admin/users — create user (admin provisions Google account)
router.post('/users', verifyToken, requireRole('admin'), async (req, res) => {
  const { email, name, role, phone, b_num, b_wing_alphabet, b_floor_num, flat_num } = req.body;
  if (!email || !name || !role) return res.status(400).json({ error: 'email, name and role are required' });

  // Generate unique user ID: USR-{ROLE}-{TIMESTAMP_BASE36}
  const rolePrefix = { admin: 'ADM', guard: 'GRD', resident: 'RES' }[role] || 'USR';
  const userUniqueId = `USR-${rolePrefix}-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await supabaseAdmin.from('users').insert({
    email, name, role, phone: phone || null,
    b_num: b_num || null, b_wing_alphabet: b_wing_alphabet || null,
    b_floor_num: b_floor_num || null, flat_num: flat_num || null,
    firebase_uid: 'PENDING_' + Date.now(),
    status: 'active',
    user_unique_id: userUniqueId,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  await notify.notifyNewUser({ newUser: data, adminName: req.user.name });
  res.json({ success: true, user: data });
});

// PUT /api/admin/users/:id — update user info / building assignment
router.put('/users/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, role, phone, status, b_num, b_wing_alphabet, b_floor_num, flat_num } = req.body;
  const { data, error } = await supabaseAdmin.from('users')
    .update({ name, role, phone, status, b_num, b_wing_alphabet, b_floor_num, flat_num, updated_at: new Date().toISOString() })
    .eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, user: data });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { error } = await supabaseAdmin.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/admin/buildings
router.get('/buildings', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('buildings').select('*, flats(*)').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ buildings: data });
});

// POST /api/admin/buildings
router.post('/buildings', verifyToken, requireRole('admin'), async (req, res) => {
  const { b_num, b_wing_alphabet, b_floor_num, name } = req.body;
  if (!b_num || !b_wing_alphabet || b_floor_num === undefined) {
    return res.status(400).json({ error: 'b_num, b_wing_alphabet, b_floor_num required' });
  }
  const { data, error } = await supabaseAdmin.from('buildings')
    .insert({ b_num, b_wing_alphabet, b_floor_num, name: name || `Building ${b_num}` })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, building: data });
});

// DELETE /api/admin/buildings/:id
router.delete('/buildings/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { error } = await supabaseAdmin.from('buildings').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// GET /api/admin/flats
router.get('/flats', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('flats')
    .select('*, buildings(b_num, b_wing_alphabet), users(name, email)').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ flats: data });
});

// POST /api/admin/flats — assign flat
router.post('/flats', verifyToken, requireRole('admin'), async (req, res) => {
  const { building_id, flat_num, floor_num, resident_id } = req.body;
  const { data, error } = await supabaseAdmin.from('flats')
    .insert({ building_id, flat_num, floor_num, resident_id }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, flat: data });
});

// PUT /api/admin/flats/:id
router.put('/flats/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { resident_id, flat_num, floor_num } = req.body;
  const { data, error } = await supabaseAdmin.from('flats')
    .update({ resident_id, flat_num, floor_num }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, flat: data });
});

// GET /api/admin/otps — read-only for admin
router.get('/otps', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('otps')
    .select('*, visitors(name, target_flat, photo_url), residents:users!otps_resident_id_fkey(name, email), guards:users!otps_guard_id_fkey(name)')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ otps: data });
});

// GET /api/admin/dashboard — legacy route for backward compat
router.get('/dashboard', verifyToken, requireRole('admin'), async (req, res) => {
  const [visitors, alerts, pending, users] = await Promise.all([
    supabaseAdmin.from('visitors').select('id', { count: 'exact' }),
    supabaseAdmin.from('alerts').select('id', { count: 'exact' }).eq('resolved', false),
    supabaseAdmin.from('visitors').select('id', { count: 'exact' }).eq('status', 'pending'),
    supabaseAdmin.from('users').select('id', { count: 'exact' }).eq('status', 'active'),
  ]);
  res.json({
    totalVisitors: visitors.count || 0,
    activeAlerts: alerts.count || 0,
    pendingApprovals: pending.count || 0,
    activeUsers: users.count || 0,
  });
});

// GET /api/admin/stats — unified dashboard stats (used by new Dashboard.jsx)
router.get('/stats', verifyToken, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Last 7 days range
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const [totalRes, todayRes, alertsRes, pendingRes, weeklyRes] = await Promise.all([
      supabaseAdmin.from('visitors').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('visitors').select('id', { count: 'exact', head: true }).gte('entry_time', todayISO),
      supabaseAdmin.from('alerts').select('id', { count: 'exact', head: true }).eq('resolved', false),
      supabaseAdmin.from('visitors').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseAdmin.from('visitors').select('entry_time, created_at').gte('created_at', sevenDaysAgo),
    ]);

    // Build weekly breakdown by day name
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    for (const v of (weeklyRes.data || [])) {
      const d = new Date(v.entry_time || v.created_at);
      const label = days[d.getDay()];
      if (counts[label] !== undefined) counts[label]++;
    }
    // Return in week order starting Monday
    const weekly_visitors = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => ({ day, count: counts[day] }));

    res.json({
      stats: {
        total_visitors:    totalRes.count   || 0,
        today_visitors:    todayRes.count   || 0,
        active_alerts:     alertsRes.count  || 0,
        pending_approvals: pendingRes.count || 0,
        weekly_visitors,
      }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/residents — list of all residents (for guard visitor form dropdown)
router.get('/residents', verifyToken, requireRole('admin', 'guard'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, flat_num, b_num, b_wing_alphabet, b_floor_num')
    .eq('role', 'resident')
    .eq('status', 'active')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ residents: data });
});

// GET/POST/DELETE /api/admin/blacklist
router.get('/blacklist', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('blacklist').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ blacklist: data });
});

router.post('/blacklist', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, reason, photo_url } = req.body;
  const { data, error } = await supabaseAdmin.from('blacklist')
    .insert({ name, reason, photo_url, added_by: req.user.id }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, entry: data });
});

router.delete('/blacklist/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { error } = await supabaseAdmin.from('blacklist').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
