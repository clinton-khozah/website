import { createClient } from '@supabase/supabase-js'

// Use the correct Supabase URL - hardcoded to ensure it works
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qvyofdffddwgpduljlit.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eW9mZGZmZGR3Z3BkdWxqbGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NDE5ODUsImV4cCI6MjA3MjQxNzk4NX0.TEEUTy4cgKsL_g8QGdupjCkvXqueN8qFFrf4JO6QQPs'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Log for debugging (remove in production)
if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 