
export interface RoadmapResource {
    title: string
    url: string
    type: string
}

export interface RoadmapModule {
    title: string
    description: string
    estimatedTime: string
    resources: RoadmapResource[]
}

export interface RoadmapPhase {
    name: string
    goal?: string
    modules: RoadmapModule[]
}

export interface Roadmap {
    title: string
    phases: RoadmapPhase[]
}
