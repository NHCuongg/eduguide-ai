import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// These will be populated by your .env file
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper Types based on the Blueprint
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
    json_content: Roadmap // The AI generated curriculum
    created_at: string
}
