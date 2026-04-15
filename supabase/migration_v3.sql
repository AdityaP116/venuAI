-- ============================================================
-- SentraAI — Migration v3
-- Paste into Supabase SQL Editor and run.
-- ============================================================

-- ── NEW COLUMNS ON EXISTING TABLES ─────────────────────────

-- users: username, profile image, shift status, unique user ID
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS username          TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
  ADD COLUMN IF NOT EXISTS shift_status      TEXT NOT NULL DEFAULT 'off_duty'
                           CHECK (shift_status IN ('on_duty', 'off_duty')),
  ADD COLUMN IF NOT EXISTS user_unique_id    TEXT UNIQUE;

-- visitors: guard photo, checkpoint status
ALTER TABLE visitors
  ADD COLUMN IF NOT EXISTS guard_photo_url    TEXT,
  ADD COLUMN IF NOT EXISTS checkpoint_status  TEXT NOT NULL DEFAULT 'pending'
                           CHECK (checkpoint_status IN ('pending','tracking','cleared','breach'));

-- ── GUARD SHIFTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guard_shifts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guard_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_start   TIMESTAMPTZ NOT NULL DEFAULT now(),
  shift_end     TIMESTAMPTZ,
  expected_end  TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '12 hours'),
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'completed', 'overtime')),
  total_hours   NUMERIC(5,2),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guard_shifts_guard_id ON guard_shifts(guard_id);
CREATE INDEX IF NOT EXISTS idx_guard_shifts_status   ON guard_shifts(status);

-- ── GUARD CALLS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guard_calls (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guard_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','completed','missed')),
  call_type     TEXT NOT NULL DEFAULT 'general'
                CHECK (call_type IN ('general','emergency','visitor_query','maintenance')),
  message       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_guard_calls_resident ON guard_calls(resident_id);
CREATE INDEX IF NOT EXISTS idx_guard_calls_guard    ON guard_calls(guard_id);
CREATE INDEX IF NOT EXISTS idx_guard_calls_status   ON guard_calls(status);

-- ── VISITOR CHECKPOINTS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitor_checkpoints (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id   UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  checkpoint   TEXT NOT NULL
               CHECK (checkpoint IN ('gate_entry','lift_camera','door_arrival')),
  expected_by  TIMESTAMPTZ,
  actual_time  TIMESTAMPTZ,
  is_breach    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkpoints_visitor ON visitor_checkpoints(visitor_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_breach  ON visitor_checkpoints(is_breach);

-- ── CAMERA FEEDS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS camera_feeds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'corridor'
              CHECK (type IN ('gate','lift','corridor','door','lobby')),
  floor       INTEGER,
  status      TEXT NOT NULL DEFAULT 'online'
              CHECK (status IN ('online','offline','maintenance')),
  stream_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with default cameras
INSERT INTO camera_feeds (name, location, type, floor, status) VALUES
  ('Main Gate Cam',       'Main Entrance',     'gate',     0, 'online'),
  ('Gate Side Cam',       'Side Entrance',     'gate',     0, 'online'),
  ('Lift A - Ground',     'Lift A Ground Fl',  'lift',     0, 'online'),
  ('Lift B - Ground',     'Lift B Ground Fl',  'lift',     0, 'online'),
  ('Lobby Camera',        'Main Lobby',        'lobby',    0, 'online'),
  ('Corridor Floor 1',    'Corridor Block A',  'corridor', 1, 'online'),
  ('Corridor Floor 2',    'Corridor Block A',  'corridor', 2, 'online'),
  ('Corridor Floor 3',    'Corridor Block A',  'corridor', 3, 'offline')
ON CONFLICT DO NOTHING;

-- ── ENABLE RLS ON NEW TABLES ────────────────────────────────
ALTER TABLE guard_shifts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guard_calls          ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_checkpoints  ENABLE ROW LEVEL SECURITY;
ALTER TABLE camera_feeds         ENABLE ROW LEVEL SECURITY;

-- ── UPDATED_AT TRIGGER FOR CAMERAS ─────────────────────────
CREATE TRIGGER trg_cameras_updated_at
  BEFORE UPDATE ON camera_feeds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
