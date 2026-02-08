import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isToday, isYesterday } from 'date-fns'

interface GamificationState {
    xp: number
    level: number
    streak: number
    lastActiveDate: number | null
    addXP: (amount: number) => void
    checkStreak: () => void
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10000]

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,

            addXP: (amount) => {
                set((state) => {
                    const newXP = state.xp + amount
                    // Calculate level based on thresholds
                    let newLevel = 1
                    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                        if (newXP >= LEVEL_THRESHOLDS[i]) {
                            newLevel = i + 1
                        } else {
                            break
                        }
                    }
                    return { xp: newXP, level: newLevel }
                })
            },

            checkStreak: () => {
                set((state) => {
                    const now = Date.now()
                    const lastActive = state.lastActiveDate

                    if (!lastActive) {
                        return { streak: 1, lastActiveDate: now }
                    }

                    if (isToday(lastActive)) {
                        // Already logged in today, keep streak
                        return {}
                    } else if (isYesterday(lastActive)) {
                        // Logged in yesterday, increment streak
                        return { streak: state.streak + 1, lastActiveDate: now }
                    } else {
                        // Missed a day, reset streak
                        return { streak: 1, lastActiveDate: now }
                    }
                })
            },
        }),
        {
            name: 'gamification-storage',
        }
    )
)

export const getLevelTitle = (level: number) => {
    if (level < 5) return "Novice"
    if (level < 10) return "Apprentice"
    if (level < 20) return "Adept"
    if (level < 40) return "Expert"
    return "Master"
}

export const getNextLevelXP = (level: number) => {
    if (level >= LEVEL_THRESHOLDS.length) return 1000000
    return LEVEL_THRESHOLDS[level] // because level is 1-indexed, but array is 0-indexed so level 1 looks at index 1 for next threshold
}
