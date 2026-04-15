const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify  = require('../services/notificationService');

const CHECKPOINT_SECONDS = 21; // seconds allowed between checkpoints

// POST /api/checkpoints — register a checkpoint event
router.post('/', verifyToken, requireRole('guard', 'admin'), async (req, res) => {
  const { visitor_id, checkpoint } = req.body;
  if (!visitor_id || !checkpoint) return res.status(400).json({ error: 'visitor_id and checkpoint required' });

  const validCheckpoints = ['gate_entry','lift_camera','door_arrival'];
  if (!validCheckpoints.includes(checkpoint)) return res.status(400).json({ error: 'Invalid checkpoint' });

  const now        = new Date();
  const expectedBy = checkpoint !== 'door_arrival'
    ? new Date(now.getTime() + CHECKPOINT_SECONDS * 1000).toISOString()
    : null;

  // Insert checkpoint
  const { data, error } = await supabaseAdmin.from('visitor_checkpoints').insert({
    visitor_id,
    checkpoint,
    expected_by: expectedBy,
    actual_time: now.toISOString(),
    is_breach:   false,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });

  // Update visitor checkpoint_status
  const newStatus = checkpoint === 'door_arrival' ? 'cleared' : 'tracking';
  await supabaseAdmin.from('visitors').update({ checkpoint_status: newStatus }).eq('id', visitor_id);

  // If door_arrival, mark cleared
  if (checkpoint === 'door_arrival') {
    await supabaseAdmin.from('visitor_checkpoints')
      .update({ is_breach: false })
      .eq('visitor_id', visitor_id)
      .is('actual_time', null);
  }

  res.json({ success: true, checkpoint: data, expected_by: expectedBy });
});

// GET /api/checkpoints/active — visitors currently in transit w/ countdown
router.get('/active', verifyToken, async (req, res) => {

  // Get tracking visitors
  const { data: visitors, error } = await supabaseAdmin
    .from('visitors')
    .select('id, name, target_flat, photo_url, guard_photo_url, entry_time')
    .eq('checkpoint_status', 'tracking')
    .eq('status', 'approved');

  if (error) return res.status(500).json({ error: error.message });

  // For each, get latest checkpoint
  const active = await Promise.all((visitors || []).map(async (v) => {
    const { data: cp } = await supabaseAdmin
      .from('visitor_checkpoints')
      .select('*')
      .eq('visitor_id', v.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const secondsLeft = cp?.expected_by
      ? Math.max(0, Math.floor((new Date(cp.expected_by) - new Date()) / 1000))
      : null;

    return { ...v, latest_checkpoint: cp, seconds_left: secondsLeft };
  }));

  res.json({ active });
});

// GET /api/checkpoints/breaches — visitors who triggered infiltration alert
router.get('/breaches', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('visitor_checkpoints')
    .select('*, visitor:visitors(name, target_flat, photo_url, guard_photo_url)')
    .eq('is_breach', true)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ breaches: data });
});

// POST /api/checkpoints/breach-check — called by a periodic server-side job or client
// Marks expired checkpoints as breaches and fires alerts
router.post('/breach-check', verifyToken, async (req, res) => {
  const now = new Date().toISOString();

  // Find checkpoints that have passed expected_by and are not already breached
  const { data: expired, error } = await supabaseAdmin
    .from('visitor_checkpoints')
    .select('*, visitor:visitors(id, name, target_flat, logged_by)')
    .lt('expected_by', now)
    .is('actual_time', null) // not yet recorded
    .eq('is_breach', false);

  if (error) return res.status(500).json({ error: error.message });
  if (!expired || expired.length === 0) return res.json({ breaches: 0 });

  let breachCount = 0;
  for (const cp of expired) {
    // Mark as breach
    await supabaseAdmin.from('visitor_checkpoints').update({ is_breach: true }).eq('id', cp.id);
    await supabaseAdmin.from('visitors').update({ checkpoint_status: 'breach' }).eq('id', cp.visitor_id);

    // Create alert
    await supabaseAdmin.from('alerts').insert({
      type:       'infiltration',
      title:      '🚨 Infiltration Alert — Visitor Timer Expired',
      severity:   'critical',
      visitor_id: cp.visitor_id,
      location:   `Expected at ${cp.checkpoint.replace(/_/g,' ')}`,
      read:       false,
      resolved:   false,
    });

    // Notify all on-duty guards
    const { data: onDutyGuards } = await supabaseAdmin
      .from('users').select('id').eq('role', 'guard').eq('shift_status', 'on_duty');

    await notify.notifyInfiltration({
      visitor:  cp.visitor,
      checkpoint: cp.checkpoint,
      guardIds: (onDutyGuards || []).map(g => g.id),
    });

    breachCount++;
  }

  res.json({ breaches: breachCount });
});

module.exports = router;
