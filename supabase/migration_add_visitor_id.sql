-- ============================================================
-- SentraAI Migration: Add visitor_unique_id and captured_at
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add visitor_unique_id column (unique identifier per visitor)
ALTER TABLE visitors
  ADD COLUMN IF NOT EXISTS visitor_unique_id TEXT;

-- 2. Add captured_at column (ISO timestamp of when photo was taken)
ALTER TABLE visitors
  ADD COLUMN IF NOT EXISTS captured_at TIMESTAMPTZ;

-- 3. Backfill existing rows with a generated ID (for old records)
UPDATE visitors
SET visitor_unique_id = 'VIS-' || LPAD(
  COALESCE(
    RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 6),
    'XXXXXX'
  ), 6, '0'
) || '-' || EXTRACT(EPOCH FROM created_at)::BIGINT
WHERE visitor_unique_id IS NULL;

-- 4. Create index for fast lookups by visitor_unique_id
CREATE INDEX IF NOT EXISTS idx_visitors_unique_id ON visitors(visitor_unique_id);

-- ============================================================
-- Optional: Add resident_unique_id to users table
-- ============================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS resident_unique_id TEXT;

-- Backfill for existing residents
UPDATE users
SET resident_unique_id = 'RES-' || 
  COALESCE(b_wing_alphabet || '-' || flat_num, 
           SUBSTRING(id::text, 1, 8))
WHERE role = 'resident' AND resident_unique_id IS NULL;

-- ============================================================
-- Verify: check new columns exist
-- ============================================================
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'visitors' AND column_name IN ('visitor_unique_id', 'captured_at');
