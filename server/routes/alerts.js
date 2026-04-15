const express = require('express');
const router = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');
const notify = require('../services/notificationService');

// GET /api/alerts
router.get('/', verifyToken, async (req, res) => {
  const { severity, resolved } = req.query;
  let query = supabaseAdmin.from('alerts')
    .select('*, visitor:visitors(name, target_flat)')
    .order('created_at', { ascending: false });
  if (severity) query = query.eq('severity', severity);
  if (resolved !== undefined) query = query.eq('resolved', resolved === 'true');
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ alerts: data, total: data.length });
});

// PUT /api/alerts/:id/resolve
router.put('/:id/resolve', verifyToken, requireRole('admin', 'guard'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('alerts')
    .update({ resolved: true, read: true }).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, alert: data });
});

// PUT /api/alerts/:id/read
router.put('/:id/read', verifyToken, async (req, res) => {
  const { error } = await supabaseAdmin.from('alerts').update({ read: true }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// POST /api/alerts/emergency
router.post('/emergency', verifyToken, requireRole('admin', 'guard'), async (req, res) => {
  const { location } = req.body;
  const { data: alert, error } = await supabaseAdmin.from('alerts').insert({
    type: 'emergency', title: 'Emergency Alert Triggered',
    severity: 'critical', location: location || 'All Zones', read: false, resolved: false,
  }).select().single();
  if (error) return res.status(500).json({ error: error.message });
  await notify.notifyEmergency({ alertId: alert.id, location: alert.location });
  res.json({ success: true, alert, message: 'Emergency alert triggered' });
});

module.exports = router;
