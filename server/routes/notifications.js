const express = require('express');
const router = express.Router();
const { verifyToken, supabaseAdmin } = require('../middleware/auth');

// GET /api/notifications — returns notifications for the calling user
router.get('/', verifyToken, async (req, res) => {
  const { unread_only } = req.query;
  let query = supabaseAdmin.from('notifications')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (unread_only === 'true') query = query.eq('read', false);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ notifications: data, unread: data.filter(n => !n.read).length });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', verifyToken, async (req, res) => {
  const { error } = await supabaseAdmin.from('notifications')
    .update({ read: true }).eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// PUT /api/notifications/read-all
router.put('/read-all', verifyToken, async (req, res) => {
  const { error } = await supabaseAdmin.from('notifications')
    .update({ read: true }).eq('user_id', req.user.id).eq('read', false);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
