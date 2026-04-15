const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, supabaseAdmin } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype));
  },
});

// GET /api/profile — current user's full profile
router.get('/', verifyToken, async (req, res) => {
  res.json({ user: req.user });
});

// GET /api/profile/:id — any user's public profile (name, role, avatar, flat_num, shift_status)
router.get('/:id', verifyToken, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, username, role, avatar_url, profile_image_url, flat_num, b_num, b_wing_alphabet, b_floor_num, shift_status, user_unique_id, created_at')
    .eq('id', req.params.id)
    .single();
  if (error || !data) return res.status(404).json({ error: 'User not found' });
  res.json({ user: data });
});

// PUT /api/profile — update name, username, phone, flat_num (residents)
router.put('/', verifyToken, async (req, res) => {
  const { name, username, phone, flat_num, b_num, b_wing_alphabet, b_floor_num } = req.body;

  // Build update payload — only include provided fields
  const updates = { updated_at: new Date().toISOString() };
  if (name       !== undefined) updates.name       = name;
  if (username   !== undefined) updates.username   = username;
  if (phone      !== undefined) updates.phone      = phone;

  // Flat details — residents only
  if (req.user.role === 'resident') {
    if (flat_num          !== undefined) updates.flat_num          = flat_num;
    if (b_num             !== undefined) updates.b_num             = b_num;
    if (b_wing_alphabet   !== undefined) updates.b_wing_alphabet   = b_wing_alphabet;
    if (b_floor_num       !== undefined) updates.b_floor_num       = b_floor_num;
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Sync flat_num into the flats table if resident
  if (req.user.role === 'resident' && flat_num) {
    // Upsert into flats: find existing or create new
    const { data: existingFlat } = await supabaseAdmin
      .from('flats')
      .select('id')
      .eq('resident_id', req.user.id)
      .single();

    if (existingFlat) {
      await supabaseAdmin.from('flats')
        .update({ flat_num, floor_num: b_floor_num || null })
        .eq('id', existingFlat.id);
    } else {
      await supabaseAdmin.from('flats').insert({
        flat_num,
        floor_num: b_floor_num || null,
        resident_id: req.user.id,
      });
    }
  }

  res.json({ success: true, user: data });
});

// POST /api/profile/avatar — upload profile/avatar image
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });

  const ext      = req.file.mimetype.split('/')[1];
  const filename = `avatars/${req.user.id}/${uuidv4()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('visitor-photos') // reuse existing bucket
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

  if (error) return res.status(500).json({ error: `Upload failed: ${error.message}` });

  const { data: urlData } = supabaseAdmin.storage
    .from('visitor-photos')
    .getPublicUrl(filename);

  // Save URL to user profile
  await supabaseAdmin.from('users')
    .update({ profile_image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', req.user.id);

  res.json({ success: true, url: urlData.publicUrl });
});

module.exports = router;
