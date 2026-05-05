#!/usr/bin/env node
// Pragmatic migration runner. The initial schema lives in `init.sql` (loaded
// once when the postgres volume is empty). Subsequent SQL files in `drizzle/`
// are deltas — applied here in order, idempotently. We track applied filenames
// in a dedicated `_pet_migrations` table so reruns are no-ops.
//
// Why not drizzle-kit's migrate()? It assumes it owns the DB from migration
// 0000 onward; with init.sql bootstrapping the schema, 0000 conflicts. Rolling
// our own keeps both paths sane.
import postgres from "postgres"
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// In the migrator container the script sits at /app/migrate.mjs alongside
// /app/drizzle. In dev it sits at scripts/migrate.mjs, one level above.
const candidates = [
    path.resolve(__dirname, "drizzle"),
    path.resolve(__dirname, "..", "drizzle"),
]
const migrationsFolder = candidates.find((p) => fs.existsSync(p)) ?? candidates[0]

// init.sql already bootstraps everything in 0000; treat the matching drizzle
// file as a no-op so an existing DB doesn't try to re-CREATE the same tables.
const SKIP_FILES = new Set(["0000_flimsy_captain_flint.sql"])

const url = process.env.DATABASE_URL
if (!url) {
    console.error("[migrate] DATABASE_URL not set; skipping")
    process.exit(0)
}

const sql = postgres(url, { max: 1, onnotice: () => {} })

async function ensureTrackingTable() {
    await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS "_pet_migrations" (
            "filename" text PRIMARY KEY,
            "applied_at" timestamp NOT NULL DEFAULT now()
        );
    `)
}

async function listApplied() {
    const rows = await sql`SELECT "filename" FROM "_pet_migrations"`
    return new Set(rows.map((r) => r.filename))
}

async function applyFile(filename, body) {
    await sql.begin(async (tx) => {
        // Strip drizzle-kit's statement-breakpoint markers and run as raw SQL.
        const cleaned = body.replace(/-->\s*statement-breakpoint/g, ";")
        await tx.unsafe(cleaned)
        await tx`INSERT INTO "_pet_migrations" ("filename") VALUES (${filename})`
    })
}

async function run() {
    if (!fs.existsSync(migrationsFolder)) {
        console.warn(`[migrate] no migrations folder at ${migrationsFolder}`)
        return
    }

    await ensureTrackingTable()
    const applied = await listApplied()

    const files = fs
        .readdirSync(migrationsFolder)
        .filter((f) => f.endsWith(".sql"))
        .sort()

    let count = 0
    for (const file of files) {
        if (SKIP_FILES.has(file)) {
            if (!applied.has(file)) {
                await sql`INSERT INTO "_pet_migrations" ("filename") VALUES (${file}) ON CONFLICT DO NOTHING`
            }
            continue
        }
        if (applied.has(file)) continue

        const body = fs.readFileSync(path.join(migrationsFolder, file), "utf8")
        try {
            await applyFile(file, body)
            console.info(`[migrate] applied ${file}`)
            count += 1
        } catch (err) {
            console.error(`[migrate] failed on ${file}:`, err)
            throw err
        }
    }

    console.info(`[migrate] ${count} migration(s) applied`)
}

const t0 = Date.now()
try {
    await run()
    console.info(`[migrate] done in ${Date.now() - t0}ms`)
} catch (err) {
    console.error("[migrate] aborted:", err)
    process.exit(1)
} finally {
    await sql.end()
}
