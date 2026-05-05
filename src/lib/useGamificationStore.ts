import { create } from "zustand"
import { persist } from "zustand/middleware"
import { isToday, isYesterday } from "date-fns"
import { bumpGamification } from "@/app/actions/gamification"
import { showToast } from "@/lib/toast"

function celebrate({ prevStreak, prevLevel, nextStreak, nextLevel }: { prevStreak: number; prevLevel: number; nextStreak: number; nextLevel: number }) {
    if (typeof window === "undefined") return
    if (nextLevel > prevLevel) {
        showToast.success(`Level up! → Lv. ${nextLevel}`, "Keep going. Each session compounds.")
    }
    if (nextStreak > prevStreak && nextStreak >= 2) {
        const milestone = nextStreak === 7 || nextStreak === 30 || nextStreak === 100
        if (milestone) {
            showToast.success(`${nextStreak}-day streak!`, "Big milestone — that consistency is the whole game.")
        } else {
            showToast.info(`Streak: ${nextStreak} days`, "Studied today — see you tomorrow.")
        }
    }
}

interface GamificationState {
    xp: number
    level: number
    streak: number
    lastActiveDate: number | null
    addXP: (amount: number) => void
    checkStreak: () => void
    hydrateFromServer: (state: { xp: number; streak: number; lastActiveDate: string | null }) => void
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10000]
const MAX_XP = 999_999
const MAX_XP_PER_CALL = 1000

function levelForXp(xp: number): number {
    let level = 1
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (xp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1
        } else {
            break
        }
    }
    return level
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,

            // Optimistic local update + best-effort server sync.
            // Server is the source of truth; if it returns a different value
            // (rate-cap, race), we reconcile.
            addXP: (amount) => {
                if (!Number.isFinite(amount) || amount <= 0) return
                const safeAmount = Math.min(amount, MAX_XP_PER_CALL)

                set((state) => {
                    const newXp = Math.min(state.xp + safeAmount, MAX_XP)
                    return { xp: newXp, level: levelForXp(newXp) }
                })

                // Fire-and-forget DB sync; reconcile on response.
                const before = get()
                bumpGamification({ xpDelta: safeAmount, touchActivity: true })
                    .then((server) => {
                        if (!server) return
                        const nextLevel = levelForXp(server.xp)
                        celebrate({
                            prevStreak: before.streak,
                            prevLevel: before.level,
                            nextStreak: server.streak,
                            nextLevel,
                        })
                        set({
                            xp: server.xp,
                            level: nextLevel,
                            streak: server.streak,
                            lastActiveDate: server.lastActiveDate ? new Date(server.lastActiveDate).getTime() : null,
                        })
                    })
                    .catch(() => undefined)
            },

            checkStreak: () => {
                set((state) => {
                    const now = Date.now()
                    const lastActive = state.lastActiveDate
                    if (!lastActive) return { streak: 1, lastActiveDate: now }
                    if (isToday(lastActive)) return {}
                    if (isYesterday(lastActive)) return { streak: state.streak + 1, lastActiveDate: now }
                    return { streak: 1, lastActiveDate: now }
                })

                const before = get()
                // Sync streak/lastActiveDate to DB without adding XP.
                bumpGamification({ touchActivity: true })
                    .then((server) => {
                        if (!server) return
                        const nextLevel = levelForXp(server.xp)
                        celebrate({
                            prevStreak: before.streak,
                            prevLevel: before.level,
                            nextStreak: server.streak,
                            nextLevel,
                        })
                        set({
                            xp: server.xp,
                            level: nextLevel,
                            streak: server.streak,
                            lastActiveDate: server.lastActiveDate ? new Date(server.lastActiveDate).getTime() : null,
                        })
                    })
                    .catch(() => undefined)
            },

            hydrateFromServer: ({ xp, streak, lastActiveDate }) => {
                set({
                    xp,
                    level: levelForXp(xp),
                    streak,
                    lastActiveDate: lastActiveDate ? new Date(lastActiveDate).getTime() : null,
                })
            },
        }),
        {
            name: "gamification-storage",
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
