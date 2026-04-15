const express = require('express');
const router  = express.Router();
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');

// GET /api/cameras — all cameras
router.get('/', verifyToken, async (req, res) => {
  const { type } = req.query;
  let query = supabaseAdmin.from('camera_feeds').select('*').order('floor').order('name');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ cameras: data });
});

// GET /api/cameras/lift — lift cameras with active visitor info
router.get('/lift', verifyToken, async (req, res) => {
  const { data: cameras, error } = await supabaseAdmin
    .from('camera_feeds').select('*').eq('type', 'lift').eq('status', 'online');
  if (error) return res.status(500).json({ error: error.message });

  // Get active tracking visitors
  const { data: activeVisitors } = await supabaseAdmin
    .from('visitors')
    .select('id, name, target_flat, entry_time, guard_photo_url')
    .eq('checkpoint_status', 'tracking')
    .eq('status', 'approved');

  res.json({ cameras, active_visitors: activeVisitors || [] });
});

// POST /api/cameras — admin adds a camera
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, location, type, floor, stream_url } = req.body;
  if (!name || !location) return res.status(400).json({ error: 'name and location required' });
  const { data, error } = await supabaseAdmin
    .from('camera_feeds')
    .insert({ name, location, type: type || 'corridor', floor: floor || 0, stream_url: stream_url || null, status: 'online' })
    .select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, camera: data });
});

// PUT /api/cameras/:id — update camera status or info
router.put('/:id', verifyToken, requireRole('admin', 'guard'), async (req, res) => {
  const { name, location, type, floor, status, stream_url } = req.body;
  const updates = { updated_at: new Date().toISOString() };
  if (name       !== undefined) updates.name       = name;
  if (location   !== undefined) updates.location   = location;
  if (type       !== undefined) updates.type       = type;
  if (floor      !== undefined) updates.floor      = floor;
  if (status     !== undefined) updates.status     = status;
  if (stream_url !== undefined) updates.stream_url = stream_url;

  const { data, error } = await supabaseAdmin
    .from('camera_feeds').update(updates).eq('id', req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, camera: data });
});

// DELETE /api/cameras/:id — admin removes a camera
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  const { error } = await supabaseAdmin.from('camera_feeds').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
