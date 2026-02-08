// CRUD operations for flashcards
import { supabase } from '../supabase'
import { FlashcardRecord } from './types'
import { cache } from '../cache'

export async function saveFlashcards(
    userId: string,
    topic: string,
    flashcards: Array<{ front: string; back: string }>,
    context?: string
): Promise<FlashcardRecord[]> {
    // In a real implementation, this would insert into Supabase
    // For now, we'll just cache the result
    
    const records: FlashcardRecord[] = flashcards.map((card, index) => ({
        id: `${Date.now()}-${index}`,
        user_id: userId,
        topic,
        context,
        front: card.front,
        back: card.back,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }))

    // Cache key for retrieval
    const cacheKey = cache.generateKey(`flashcards:${topic}`, context)
    
    // Store in cache (in production, this would be Supabase)
    cache.getOrSet(cacheKey, async () => records, 24 * 60 * 60 * 1000)

    return records
}

export async function getFlashcardsByTopic(
    userId: string,
    topic: string,
    context?: string
): Promise<FlashcardRecord[] | null> {
    // In a real implementation, this would query Supabase
    // For now, check cache first
    const cacheKey = cache.generateKey(`flashcards:${topic}`, context)
    
    // This is a placeholder - in production, query Supabase
    return null
}

export async function deleteFlashcards(userId: string, flashcardIds: string[]): Promise<void> {
    // In a real implementation, this would delete from Supabase
    // Placeholder for now
}
