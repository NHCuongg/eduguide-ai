'use server'

import { child } from "@/lib/logger"
const log = child("action:gamification")
import { eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"

const MAX_XP = 999_999
const MAX_XP_PER_CALL = 1000

interface GamificationState {
    xp: number
    streak: number
    lastActiveDate: string | null
}

/**
 * Read current gamification state from DB so the client can hydrate.
 * Returns nulls if no profile yet (user hasn't onboarded).
 */
export async function getGamificationState(): Promise<GamificationState | null> {
    const session = await auth()
    if (!session?.user?.id) return null

    const [row] = await db
        .select({
            xp: profiles.xp,
            streak: profiles.streak,
            lastActiveDate: profiles.lastActiveDate,
        })
        .from(profiles)
        .where(eq(profiles.userId, session.user.id))
        .limit(1)

    if (!row) return null
    return {
        xp: row.xp ?? 0,
        streak: row.streak ?? 0,
        lastActiveDate: row.lastActiveDate?.toISOString() ?? null,
    }
}

/**
 * Add XP, optionally bump streak, and stamp lastActiveDate.
 * Returns the new state (or null if not authenticated / no profile).
 */
export async function bumpGamification(input: {
    xpDelta?: number
    touchActivity?: boolean
}): Promise<GamificationState | null> {
    try {
        const session = await auth()
        if (!session?.user?.id) return null

        const userId = session.user.id

        const [current] = await db
            .select({
                xp: profiles.xp,
                streak: profiles.streak,
                lastActiveDate: profiles.lastActiveDate,
            })
            .from(profiles)
            .where(eq(profiles.userId, userId))
            .limit(1)

        // No profile yet (user hasn't completed onboarding) → silently no-op.
        if (!current) return null

        const xpDelta = Math.max(0, Math.min(MAX_XP_PER_CALL, Number.isFinite(input.xpDelta) ? input.xpDelta! : 0))
        const newXp = Math.min(MAX_XP, (current.xp ?? 0) + xpDelta)

        let newStreak = current.streak ?? 0
        let newLastActive = current.lastActiveDate

        if (input.touchActivity) {
            const now = new Date()
            const today = startOfDay(now).getTime()
            const last = current.lastActiveDate ? startOfDay(current.lastActiveDate).getTime() : null
            if (last === null) {
                newStreak = 1
            } else if (last === today) {
                // already active today, no change
            } else if (last === today - 86_400_000) {
                newStreak = newStreak + 1
            } else {
                newStreak = 1
            }
            newLastActive = now
        }

        await db
            .update(profiles)
            .set({
                xp: newXp,
                streak: newStreak,
                lastActiveDate: newLastActive,
                updatedAt: new Date(),
            })
            .where(eq(profiles.userId, userId))

        return {
            xp: newXp,
            streak: newStreak,
            lastActiveDate: newLastActive?.toISOString() ?? null,
        }
    } catch (error) {
        log.error({ err: error }, "[gamification] bump failed")
        return null
    }
}

function startOfDay(input: Date | string | number): Date {
    const d = new Date(input)
    d.setHours(0, 0, 0, 0)
    return d
}
