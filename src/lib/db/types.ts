

export interface FlashcardRecord {
    id: string
    user_id: string
    topic: string
    context?: string
    front: string
    back: string
    created_at: string
    updated_at: string
}

export interface QuizRecord {
    id: string
    user_id: string
    topic: string
    skill_level: string
    questions: Array<{
        id: number
        text: string
        options: string[]
        correctAnswer: string
    }>
    created_at: string
    updated_at: string
}

export interface RoadmapRecord {
    id: string
    user_id: string
    title: string
    target_skill: string
    current_level: string
    learning_style: string
    deadline: string
    roadmap_data: {
        title: string
        phases: Array<{
            name: string
            modules: Array<{
                title: string
                description: string
                resources: Array<{
                    title: string
                    url: string
                    type: string
                }>
            }>
        }>
    }
    created_at: string
    updated_at: string
}
