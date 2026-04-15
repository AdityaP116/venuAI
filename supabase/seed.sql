-- ============================================================
-- SentraAI — Supabase Seed Data (Demo)
-- Run AFTER schema.sql.
-- Replace firebase_uid values with real ones after first login,
-- OR use the PENDING_ placeholder (server auto-links on first sign-in).
-- ============================================================

-- ── BUILDINGS ───────────────────────────────────────────────
INSERT INTO buildings (id, b_num, b_wing_alphabet, b_floor_num, name) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'B01', 'A', 10, 'Sunrise Tower A'),
  ('b2000000-0000-0000-0000-000000000002', 'B02', 'B', 8,  'Horizon Block B')
ON CONFLICT (b_num) DO NOTHING;

-- ── USERS ───────────────────────────────────────────────────
-- IMPORTANT: Replace PENDING_xxx with actual firebase_uid after first login,
-- or leave as-is — the server auto-links on first Google sign-in by email match.
INSERT INTO users (id, firebase_uid, email, name, role, phone, status, b_num, b_wing_alphabet, b_floor_num, flat_num) VALUES
  -- Admin
  ('a1000000-0000-0000-0000-000000000001',
   'PENDING_ADMIN_001',
   'admin@sentraai.com',
   'System Admin', 'admin', '+91-9000000001', 'active', NULL, NULL, NULL, NULL),

  -- Guards
  ('a2000000-0000-0000-0000-000000000002',
   'PENDING_GUARD_001',
   'guard1@sentraai.com',
   'Rajesh Kumar', 'guard', '+91-9100000001', 'active', NULL, NULL, NULL, NULL),
  ('a2000000-0000-0000-0000-000000000003',
   'PENDING_GUARD_002',
   'guard2@sentraai.com',
   'Suresh Patil', 'guard', '+91-9100000002', 'active', NULL, NULL, NULL, NULL),

  -- Residents
  ('a3000000-0000-0000-0000-000000000004',
   'PENDING_RESIDENT_001',
   'resident1@gmail.com',
   'Priya Sharma', 'resident', '+91-9200000001', 'active', 'B01', 'A', 3, 'A-301'),
  ('a3000000-0000-0000-0000-000000000005',
   'PENDING_RESIDENT_002',
   'resident2@gmail.com',
   'Arjun Mehta', 'resident', '+91-9200000002', 'active', 'B01', 'A', 5, 'A-502'),
  ('a3000000-0000-0000-0000-000000000006',
   'PENDING_RESIDENT_003',
   'resident3@gmail.com',
   'Neha Verma', 'resident', '+91-9200000003', 'active', 'B02', 'B', 2, 'B-201')
ON CONFLICT (email) DO NOTHING;

-- ── FLATS ───────────────────────────────────────────────────
INSERT INTO flats (building_id, flat_num, floor_num, resident_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'A-301', 3, 'a3000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000001', 'A-502', 5, 'a3000000-0000-0000-0000-000000000005'),
  ('b2000000-0000-0000-0000-000000000002', 'B-201', 2, 'a3000000-0000-0000-0000-000000000006')
ON CONFLICT (building_id, flat_num) DO NOTHING;

-- ── SAMPLE VISITORS ─────────────────────────────────────────
INSERT INTO visitors (name, phone, purpose, target_flat, target_resident_id, trust_score, trust_level, face_match, status, logged_by, viewed_by_resident) VALUES
  ('Amit Joshi', '+91-9300000001', 'Delivery', 'A-301',
   'a3000000-0000-0000-0000-000000000004', 82, 'Low', 92, 'approved',
   'a2000000-0000-0000-0000-000000000002', true),
  ('Ravi Desai', '+91-9300000002', 'Plumber visit', 'A-502',
   'a3000000-0000-0000-0000-000000000005', 55, 'Medium', 88, 'pending',
   'a2000000-0000-0000-0000-000000000002', false),
  ('Unknown Person', NULL, 'Unknown', 'B-201',
   'a3000000-0000-0000-0000-000000000006', 25, 'High', 61, 'denied',
   'a2000000-0000-0000-0000-000000000003', false)
ON CONFLICT DO NOTHING;

-- ── SAMPLE ALERT ────────────────────────────────────────────
INSERT INTO alerts (type, title, severity, location, read, resolved) VALUES
  ('face_mismatch', 'High Risk Visitor Detected', 'high', 'Main Gate B', false, false)
ON CONFLICT DO NOTHING;
