// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://egkqgvlxdxycyawyouik.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVna3Fndmx4ZHh5Y3lhd3lvdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDkzMTYsImV4cCI6MjA2NzAyNTMxNn0.H9sS3_pM7lpcAQJwPVdKevRF1iSWkZUrbs9cJbWwVDc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});