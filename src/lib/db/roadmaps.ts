
import { supabase } from '../supabase'
import { RoadmapRecord } from './types'
import { Roadmap } from '../types'
import { cache } from '../cache'

export async function saveRoadmap(
    userId: string,
    targetSkill: string,
    currentLevel: string,
    learningStyle: string,
    deadline: string,
    roadmap: Roadmap
): Promise<RoadmapRecord> {
    
    const record: RoadmapRecord = {
        id: `roadmap-${Date.now()}`,
        user_id: userId,
        title: roadmap.title,
        target_skill: targetSkill,
        current_level: currentLevel,
        learning_style: learningStyle,
        deadline,
        roadmap_data: roadmap,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }

    const cacheKey = cache.generateKey(
        `roadmap:${targetSkill}`,
        `${currentLevel}:${learningStyle}:${deadline}`
    )

    cache.getOrSet(cacheKey, async () => record, 24 * 60 * 60 * 1000)

    return record
}

export async function getRoadmapBySkill(
    userId: string,
    targetSkill: string,
    currentLevel: string,
    learningStyle: string,
    deadline: string
): Promise<RoadmapRecord | null> {

    const cacheKey = cache.generateKey(
        `roadmap:${targetSkill}`,
        `${currentLevel}:${learningStyle}:${deadline}`
    )

    return null
}

export async function getUserRoadmaps(userId: string): Promise<RoadmapRecord[]> {

    return []
}
