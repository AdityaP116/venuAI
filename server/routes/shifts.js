const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify  = require('../services/notificationService');

const SHIFT_HOURS = 12;

// POST /api/shifts/start — guard starts shift
router.post('/start', verifyToken, requireRole('guard'), async (req, res) => {
  // Check if already on duty
  if (req.user.shift_status === 'on_duty') {
    // Return existing active shift
    const { data: existing } = await supabaseAdmin
      .from('guard_shifts').select('*').eq('guard_id', req.user.id).eq('status', 'active').single();
    return res.json({ success: true, shift: existing, already_active: true });
  }

  const now         = new Date();
  const expectedEnd = new Date(now.getTime() + SHIFT_HOURS * 60 * 60 * 1000);

  const { data: shift, error } = await supabaseAdmin.from('guard_shifts').insert({
    guard_id:     req.user.id,
    shift_start:  now.toISOString(),
    expected_end: expectedEnd.toISOString(),
    status:       'active',
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });

  // Mark user as on_duty
  await supabaseAdmin.from('users')
    .update({ shift_status: 'on_duty', updated_at: now.toISOString() })
    .eq('id', req.user.id);

  await notify.notifyShiftChange({ guardName: req.user.name, status: 'started' });

  res.json({ success: true, shift });
});

// POST /api/shifts/end — guard ends shift
router.post('/end', verifyToken, requireRole('guard'), async (req, res) => {
  const now = new Date();

  const { data: activeShift } = await supabaseAdmin
    .from('guard_shifts').select('*').eq('guard_id', req.user.id).eq('status', 'active').single();

  if (!activeShift) return res.status(400).json({ error: 'No active shift found' });

  const started    = new Date(activeShift.shift_start);
  const totalHours = (now - started) / (1000 * 60 * 60);

  const { data: shift, error } = await supabaseAdmin.from('guard_shifts')
    .update({
      shift_end:   now.toISOString(),
      status:      'completed',
      total_hours: parseFloat(totalHours.toFixed(2)),
    })
    .eq('id', activeShift.id)
    .select().single();

  if (error) return res.status(500).json({ error: error.message });

  // Mark user as off_duty
  await supabaseAdmin.from('users')
    .update({ shift_status: 'off_duty', updated_at: now.toISOString() })
    .eq('id', req.user.id);

  await notify.notifyShiftChange({ guardName: req.user.name, status: 'ended', totalHours });

  res.json({ success: true, shift });
});

// GET /api/shifts/current — calling guard's active shift
router.get('/current', verifyToken, requireRole('guard'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('guard_shifts')
    .select('*')
    .eq('guard_id', req.user.id)
    .eq('status', 'active')
    .single();

  if (error || !data) return res.json({ shift: null });

  const elapsed = (Date.now() - new Date(data.shift_start).getTime()) / 1000; // seconds
  res.json({ shift: data, elapsed_seconds: Math.floor(elapsed) });
});

// GET /api/shifts/history — calling guard's past shifts
router.get('/history', verifyToken, requireRole('guard'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('guard_shifts').select('*').eq('guard_id', req.user.id)
    .order('shift_start', { ascending: false }).limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ shifts: data });
});

// GET /api/shifts/all — admin views all shifts
router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('guard_shifts')
    .select('*, guard:users!guard_shifts_guard_id_fkey(name, email, profile_image_url, avatar_url)')
    .order('shift_start', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ shifts: data });
});

// POST /api/shifts/overtime-check — AI agent: check for overtime guards
// Called periodically (every minute from the client's polling)
router.post('/overtime-check', verifyToken, async (req, res) => {
  const now = new Date();
  const warningThresholdSeconds = 11 * 60 * 60; // 11 hours — warn 1 hour before

  const { data: activeShifts } = await supabaseAdmin
    .from('guard_shifts')
    .select('*, guard:users!guard_shifts_guard_id_fkey(id, name, email)')
    .eq('status', 'active');

  let overtimeCount = 0;
  for (const shift of activeShifts || []) {
    const elapsed = (now - new Date(shift.shift_start)) / 1000;

    if (elapsed >= SHIFT_HOURS * 3600) {
      // Past 12 hours — mark as overtime & notify
      await supabaseAdmin.from('guard_shifts').update({ status: 'overtime' }).eq('id', shift.id);
      await supabaseAdmin.from('alerts').insert({
        type: 'shift_overtime', title: `⏰ Shift Overtime — ${shift.guard?.name}`,
        severity: 'high', location: 'Guard Station', read: false, resolved: false,
      });
      const { data: admins } = await supabaseAdmin.from('users').select('id').eq('role', 'admin').eq('status', 'active');
      for (const admin of admins || []) {
        await supabaseAdmin.from('notifications').insert({
          user_id: admin.id,
          title:   '⏰ Guard Overtime Alert',
          message: `${shift.guard?.name} has been on duty for over 12 hours. Please arrange a shift change.`,
          type:    'alert',
        });
      }
      // Also notify the guard
      await supabaseAdmin.from('notifications').insert({
        user_id: shift.guard_id,
        title:   '⏰ Shift Overtime Warning',
        message: 'Your shift has exceeded 12 hours. Please hand over to the next guard.',
        type:    'alert',
      });
      overtimeCount++;
    } else if (elapsed >= warningThresholdSeconds) {
      // Approaching 12 hours — send warning
      await supabaseAdmin.from('notifications').insert({
        user_id: shift.guard_id,
        title:   '⚠️ Shift Ending Soon',
        message: `You have been on shift for ${Math.floor(elapsed/3600)} hours. Your shift ends in ${SHIFT_HOURS - Math.floor(elapsed/3600)} hour(s).`,
        type:    'system',
      });
    }
  }

  res.json({ checked: (activeShifts || []).length, overtime: overtimeCount });
});

module.exports = router;
