const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify  = require('../services/notificationService');

// GET /api/guards/available — all guards currently on-duty
router.get('/available', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, username, profile_image_url, avatar_url, phone, shift_status, updated_at')
    .eq('role', 'guard')
    .eq('status', 'active')
    .eq('shift_status', 'on_duty')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });

  // Attach current shift info to each guard
  const guards = await Promise.all((data || []).map(async (g) => {
    const { data: shift } = await supabaseAdmin
      .from('guard_shifts')
      .select('shift_start, expected_end, status')
      .eq('guard_id', g.id)
      .eq('status', 'active')
      .order('shift_start', { ascending: false })
      .limit(1)
      .single();
    return { ...g, current_shift: shift || null };
  }));

  res.json({ guards });
});

// GET /api/guards/all — all guards (for admin)
router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, username, profile_image_url, avatar_url, phone, shift_status, status, user_unique_id')
    .eq('role', 'guard')
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ guards: data });
});

// POST /api/guards/call — resident calls a guard
router.post('/call', verifyToken, requireRole('resident'), async (req, res) => {
  const { guard_id, call_type = 'general', message } = req.body;
  if (!guard_id) return res.status(400).json({ error: 'guard_id is required' });

  // Verify guard is on duty
  const { data: guard } = await supabaseAdmin
    .from('users')
    .select('id, name, shift_status')
    .eq('id', guard_id)
    .eq('role', 'guard')
    .single();
  if (!guard) return res.status(404).json({ error: 'Guard not found' });
  if (guard.shift_status !== 'on_duty') return res.status(400).json({ error: 'Guard is currently off duty' });

  const { data: call, error } = await supabaseAdmin
    .from('guard_calls')
    .insert({
      resident_id: req.user.id,
      guard_id,
      status:    'pending',
      call_type,
      message:   message || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Notify guard
  await notify.notifyGuardCall({ call, guardId: guard_id, residentName: req.user.name, residentFlat: req.user.flat_num });

  res.json({ success: true, call });
});

// PUT /api/guards/call/:id/respond — guard accepts or completes a call
router.put('/call/:id/respond', verifyToken, requireRole('guard'), async (req, res) => {
  const { status } = req.body; // 'accepted' | 'completed' | 'missed'
  if (!['accepted','completed','missed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const { data, error } = await supabaseAdmin
    .from('guard_calls')
    .update({ status, responded_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('guard_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, call: data });
});

// GET /api/guards/calls — list calls for the calling user
router.get('/calls', verifyToken, async (req, res) => {
  let query = supabaseAdmin
    .from('guard_calls')
    .select('*, resident:users!guard_calls_resident_id_fkey(name, flat_num, profile_image_url, avatar_url), guard:users!guard_calls_guard_id_fkey(name, profile_image_url, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (req.user.role === 'guard')    query = query.eq('guard_id', req.user.id);
  if (req.user.role === 'resident') query = query.eq('resident_id', req.user.id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ calls: data });
});

module.exports = router;
