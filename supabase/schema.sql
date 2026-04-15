-- ============================================================
-- SentraAI — Supabase PostgreSQL Schema
-- Paste this entire file into your Supabase SQL Editor and run.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid      TEXT UNIQUE NOT NULL,
  email             TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  role              TEXT NOT NULL CHECK (role IN ('admin', 'guard', 'resident')),
  phone             TEXT,
  avatar_url        TEXT,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  -- Building assignment (set by admin)
  b_num             TEXT,
  b_wing_alphabet   TEXT,
  b_floor_num       INTEGER,
  flat_num          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── BUILDINGS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS buildings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  b_num           TEXT UNIQUE NOT NULL,
  b_wing_alphabet TEXT NOT NULL,
  b_floor_num     INTEGER NOT NULL,
  name            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── FLATS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS flats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  flat_num    TEXT NOT NULL,
  floor_num   INTEGER,
  resident_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(building_id, flat_num)
);

-- ── VISITORS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visitors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  phone               TEXT,
  purpose             TEXT,
  target_flat         TEXT NOT NULL,
  target_resident_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  photo_url           TEXT,
  trust_score         INTEGER,
  trust_level         TEXT CHECK (trust_level IN ('Low', 'Medium', 'High')),
  face_match          INTEGER,
  status              TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'approved', 'denied', 'exited')),
  otp_id              UUID,
  entry_time          TIMESTAMPTZ NOT NULL DEFAULT now(),
  exit_time           TIMESTAMPTZ,
  logged_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  viewed_by_resident  BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── OTPS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL,
  visitor_id  UUID REFERENCES visitors(id) ON DELETE CASCADE,
  resident_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guard_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '10 minutes'),
  approved_at TIMESTAMPTZ
);

-- Back-reference: visitors.otp_id → otps.id
ALTER TABLE visitors ADD CONSTRAINT fk_visitors_otp
  FOREIGN KEY (otp_id) REFERENCES otps(id) ON DELETE SET NULL;

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  type         TEXT NOT NULL
               CHECK (type IN ('visitor_arrival','otp_request','approval','alert','system')),
  reference_id UUID,
  read         BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── ALERTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  severity   TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  location   TEXT,
  read       BOOLEAN NOT NULL DEFAULT false,
  resolved   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── BLACKLIST ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blacklist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  reason     TEXT,
  photo_url  TEXT,
  added_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  attempts   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_visitors_resident   ON visitors(target_resident_id);
CREATE INDEX IF NOT EXISTS idx_visitors_status     ON visitors(status);
CREATE INDEX IF NOT EXISTS idx_visitors_logged_by  ON visitors(logged_by);
CREATE INDEX IF NOT EXISTS idx_otps_visitor        ON otps(visitor_id);
CREATE INDEX IF NOT EXISTS idx_otps_resident       ON otps(resident_id);
CREATE INDEX IF NOT EXISTS idx_otps_status         ON otps(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user  ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read  ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved     ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_flats_resident      ON flats(resident_id);
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid  ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role          ON users(role);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklist      ENABLE ROW LEVEL SECURITY;

-- NOTE: All DB operations in SentraAI go through the Express server using the
-- SERVICE ROLE key (bypasses RLS). The RLS policies below protect direct
-- client-side Supabase queries (if ever used) and adds defence-in-depth.

-- Service role bypasses all RLS — no policy needed for server-side ops.
-- For anon/authenticated client-side access, policies would be added here.
-- Example (users can read their own row):
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT USING (firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' LIMIT 1)
  );

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE USING (
    user_id = (SELECT id FROM users WHERE firebase_uid = current_setting('request.jwt.claims', true)::json->>'sub' LIMIT 1)
  );

-- ============================================================
-- SUPABASE STORAGE BUCKET
-- ============================================================
-- Run this in the Storage section OR via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('visitor-photos', 'visitor-photos', true)
-- ON CONFLICT (id) DO NOTHING;
