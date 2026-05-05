import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { cache } from "@/lib/cache"
import { child } from "@/lib/logger"
import { getLlmQueue } from "@/lib/queue/llm-queue"

const log = child("api:jobs")

interface JobStatusResponse {
    jobId: string
    status: "queued" | "active" | "completed" | "failed" | "unknown"
    progress?: number
    result?: unknown
    error?: string
}

// Cache keys carry colons; BullMQ jobIds replace them with `_`. Reverse the
// substitution to look up the cache entry from a jobId.
function jobIdToCacheKey(jobId: string): string {
    return jobId.replace(/_/g, ":")
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
        return NextResponse.json({ error: "Missing job id" }, { status: 400 })
    }

    // Cache hit shortcut: worker writes results into the shared cache, so an
    // already-finished job can return immediately even if the queue entry has
    // been pruned by the retention window.
    const cacheKey = jobIdToCacheKey(id)
    const cached = await cache.get<unknown>(cacheKey)
    if (cached !== null) {
        const response: JobStatusResponse = {
            jobId: id,
            status: "completed",
            result: cached,
        }
        return NextResponse.json(response)
    }

    let job
    try {
        const queue = getLlmQueue()
        job = await queue.getJob(id)
    } catch (error) {
        log.error({ err: error, jobId: id }, "queue lookup failed")
        return NextResponse.json(
            { error: "Job lookup failed" },
            { status: 503 }
        )
    }

    if (!job) {
        const response: JobStatusResponse = { jobId: id, status: "unknown" }
        return NextResponse.json(response, { status: 404 })
    }

    const state = await job.getState()
    const progress = typeof job.progress === "number" ? job.progress : undefined

    if (state === "completed") {
        const returnValue = job.returnvalue as { data?: unknown } | undefined
        return NextResponse.json({
            jobId: id,
            status: "completed",
            result: returnValue?.data,
        } satisfies JobStatusResponse)
    }

    if (state === "failed") {
        return NextResponse.json({
            jobId: id,
            status: "failed",
            error: job.failedReason || "Job failed",
        } satisfies JobStatusResponse)
    }

    return NextResponse.json({
        jobId: id,
        status: state === "active" ? "active" : "queued",
        progress,
    } satisfies JobStatusResponse)
}
