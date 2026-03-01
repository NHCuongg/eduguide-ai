
import { supabase } from '../supabase'
import { QuizRecord } from './types'
import { cache } from '../cache'

export async function saveQuiz(
    userId: string,
    topic: string,
    skillLevel: string,
    questions: Array<{
        id: number
        text: string
        options: string[]
        correctAnswer: string
    }>
): Promise<QuizRecord> {
    
    const record: QuizRecord = {
        id: `quiz-${Date.now()}`,
        user_id: userId,
        topic,
        skill_level: skillLevel,
        questions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const cacheKey = cache.generateKey(`quiz:${topic}`, skillLevel)

    cache.getOrSet(cacheKey, async () => record, 24 * 60 * 60 * 1000)

    return record
}

export async function getQuizByTopic(
    userId: string,
    topic: string,
    skillLevel: string
): Promise<QuizRecord | null> {

    const cacheKey = cache.generateKey(`quiz:${topic}`, skillLevel)

    return null
}

export async function getUserQuizzes(userId: string): Promise<QuizRecord[]> {

    return []
}
