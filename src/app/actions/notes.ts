'use server'

import { child } from "@/lib/logger"
const log = child("action:notes")
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"

export interface NoteRow {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

const MAX_TITLE = 200
const MAX_CONTENT = 20_000

function clean(value: string, max: number): string {
    return value.trim().slice(0, max)
}

export async function listNotes(): Promise<NoteRow[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    const rows = await db
        .select()
        .from(notes)
        .where(eq(notes.userId, session.user.id))
        .orderBy(desc(notes.updatedAt))

    return rows.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
    }))
}

export async function createNote(input: { title: string; content?: string }): Promise<{ success: boolean; note?: NoteRow; error?: string }> {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const title = clean(input.title, MAX_TITLE)
        if (!title) return { success: false, error: "Title is required" }

        const content = clean(input.content ?? "", MAX_CONTENT)

        const [row] = await db
            .insert(notes)
            .values({ userId: session.user.id, title, content })
            .returning()

        revalidatePath("/dashboard")
        return {
            success: true,
            note: {
                id: row.id,
                title: row.title,
                content: row.content,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            },
        }
    } catch (error) {
        log.error({ err: error }, "[notes] create failed")
        return { success: false, error: "Internal Server Error" }
    }
}

export async function updateNote(input: { id: string; title: string; content: string }): Promise<{ success: boolean; note?: NoteRow; error?: string }> {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const title = clean(input.title, MAX_TITLE)
        if (!title) return { success: false, error: "Title is required" }
        const content = clean(input.content, MAX_CONTENT)

        const [row] = await db
            .update(notes)
            .set({ title, content, updatedAt: new Date() })
            .where(and(eq(notes.id, input.id), eq(notes.userId, session.user.id)))
            .returning()

        if (!row) return { success: false, error: "Not found" }

        revalidatePath("/dashboard")
        return {
            success: true,
            note: {
                id: row.id,
                title: row.title,
                content: row.content,
                createdAt: row.createdAt.toISOString(),
                updatedAt: row.updatedAt.toISOString(),
            },
        }
    } catch (error) {
        log.error({ err: error }, "[notes] update failed")
        return { success: false, error: "Internal Server Error" }
    }
}

export async function deleteNote(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await auth()
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const result = await db
            .delete(notes)
            .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
            .returning({ id: notes.id })

        if (result.length === 0) return { success: false, error: "Not found" }

        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        log.error({ err: error }, "[notes] delete failed")
        return { success: false, error: "Internal Server Error" }
    }
}
