import { createClient } from '@supabase/supabase-js'

export function createClientComponentClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
  )
}
