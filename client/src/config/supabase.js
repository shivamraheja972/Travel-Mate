import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const normalizedSupabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseUrl = normalizedSupabaseUrl || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
