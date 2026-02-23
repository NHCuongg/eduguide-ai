import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Dùng Service Role Key để có quyền Admin trên server (bỏ qua RLS, được phép broadcast)
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
