const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, requireRole, supabaseAdmin } = require('../middleware/auth');

// Use memory storage — we upload directly to Supabase Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

/**
 * POST /api/photos/upload
 * Guard uploads a visitor photo → stored in Supabase Storage bucket 'visitor-photos'
 * Returns the public URL.
 */
router.post('/upload', verifyToken, requireRole('guard', 'admin'), upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No photo file provided or invalid file type' });

  const ext      = req.file.mimetype.split('/')[1];
  const filename = `visitors/${uuidv4()}.${ext}`;

  const { data: _data, error } = await supabaseAdmin.storage
    .from('visitor-photos')
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (error) return res.status(500).json({ error: `Storage upload failed: ${error.message}` });

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage.from('visitor-photos').getPublicUrl(filename);
  res.json({ success: true, path: filename, url: urlData.publicUrl });
});

/**
 * DELETE /api/photos/:path — admin only
 */
router.delete('/:path(*)', verifyToken, requireRole('admin'), async (req, res) => {
  const { error } = await supabaseAdmin.storage.from('visitor-photos').remove([req.params.path]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
