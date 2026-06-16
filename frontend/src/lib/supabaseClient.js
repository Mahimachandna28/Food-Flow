import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
export const supabaseConfigError = !isSupabaseConfigured
  ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Create a `.env` file from `.env.example`.'
  : null

// Important: only create the client when env vars exist.
// Otherwise `createClient()` throws and breaks the dev server.
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
