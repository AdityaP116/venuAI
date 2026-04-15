// ============================================================
// SUPABASE CONFIGURATION
// 1. Go to https://supabase.com and create a project
// 2. Go to Project Settings → API
// 3. Copy the Project URL and anon/public key below
// 4. Run supabase/schema.sql in the Supabase SQL Editor
// 5. Optionally run supabase/seed.sql for demo data
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_REF.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: get signed URL for a photo in Supabase Storage
export const getPhotoUrl = async (path) => {
  if (!path) return null;
  const { data } = await supabase.storage
    .from('visitor-photos')
    .getPublicUrl(path);
  return data?.publicUrl || null;
};

export default supabase;
