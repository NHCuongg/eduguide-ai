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
const MAX_XP = 999_999
const MAX_XP_PER_CALL = 1000

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set) => ({
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,

            addXP: (amount) => {
                set((state) => {
                    if (!Number.isFinite(amount) || amount <= 0) return {}
                    const safeAmount = Math.min(amount, MAX_XP_PER_CALL)
                    const newXP = Math.min(state.xp + safeAmount, MAX_XP)

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
                        
                        return {}
                    } else if (isYesterday(lastActive)) {
                        
                        return { streak: state.streak + 1, lastActiveDate: now }
                    } else {
                        
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
    const safeLevel = Math.max(1, Math.floor(level))
    if (safeLevel >= LEVEL_THRESHOLDS.length) return MAX_XP
    return LEVEL_THRESHOLDS[safeLevel]
}
