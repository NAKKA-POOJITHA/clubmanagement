import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpapvtthlzralwkjaalf.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYXB2dHRobHpyYWx3a2phYWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjYwOTYsImV4cCI6MjEwNTE0MjA5Nn0.vLJtK9cvjrk19dyAS6D6ouJl_Zf1NnDvwoOVM6L-SPE';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
