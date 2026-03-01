
import { supabase } from '../supabase'
import { FlashcardRecord } from './types'
import { cache } from '../cache'

export async function saveFlashcards(
    userId: string,
    topic: string,
    flashcards: Array<{ front: string; back: string }>,
    context?: string
): Promise<FlashcardRecord[]> {

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

    const cacheKey = cache.generateKey(`flashcards:${topic}`, context)

    cache.getOrSet(cacheKey, async () => records, 24 * 60 * 60 * 1000)

    return records
}

export async function getFlashcardsByTopic(
    userId: string,
    topic: string,
    context?: string
): Promise<FlashcardRecord[] | null> {

    const cacheKey = cache.generateKey(`flashcards:${topic}`, context)

    return null
}

export async function deleteFlashcards(userId: string, flashcardIds: string[]): Promise<void> {

}
