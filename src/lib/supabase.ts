import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
}

import { Roadmap } from './types'

export type LearningPath = {
    id: string
    user_id: string
    goals: string
    json_content: Roadmap 
    created_at: string
}
