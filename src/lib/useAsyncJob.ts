"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface JobStatusResponse<T> {
    jobId: string
    status: "queued" | "active" | "completed" | "failed" | "unknown"
    progress?: number
    result?: T
    error?: string
}

export interface AsyncJobState<T> {
    status: "idle" | "queued" | "active" | "completed" | "failed"
    result: T | null
    error: string | null
    progress: number | null
    jobId: string | null
}

const INITIAL_DELAY_MS = 800
const MAX_DELAY_MS = 4_000
const BACKOFF_FACTOR = 1.4

export interface UseAsyncJobOptions<TInput, TOutput> {
    endpoint: string
    buildBody: (input: TInput) => unknown
}

export interface UseAsyncJobResult<TInput, TOutput> {
    state: AsyncJobState<TOutput>
    submit: (input: TInput) => Promise<TOutput>
    reset: () => void
}

/**
 * Submit an LLM generation request to a `?async=1` endpoint, then poll
 * `/api/jobs/[id]` until the job finishes. Resolves with the final result or
 * throws on failure. Cancels in-flight polling on unmount.
 */
export function useAsyncJob<TInput, TOutput>(
    options: UseAsyncJobOptions<TInput, TOutput>
): UseAsyncJobResult<TInput, TOutput> {
    const [state, setState] = useState<AsyncJobState<TOutput>>({
        status: "idle",
        result: null,
        error: null,
        progress: null,
        jobId: null,
    })

    const cancelledRef = useRef(false)

    useEffect(() => {
        cancelledRef.current = false
        return () => {
            cancelledRef.current = true
        }
    }, [])

    const reset = useCallback(() => {
        setState({ status: "idle", result: null, error: null, progress: null, jobId: null })
    }, [])

    const submit = useCallback(
        async (input: TInput): Promise<TOutput> => {
            cancelledRef.current = false
            setState({
                status: "queued",
                result: null,
                error: null,
                progress: null,
                jobId: null,
            })

            const submitUrl = options.endpoint.includes("?")
                ? `${options.endpoint}&async=1`
                : `${options.endpoint}?async=1`

            const submitRes = await fetch(submitUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(options.buildBody(input)),
            })

            if (!submitRes.ok && submitRes.status !== 202) {
                const errBody = await safeJson(submitRes)
                const message =
                    (typeof errBody === "object" && errBody && "error" in errBody
                        ? String((errBody as { error: unknown }).error)
                        : null) || `Request failed: ${submitRes.status}`
                if (!cancelledRef.current) {
                    setState({
                        status: "failed",
                        result: null,
                        error: message,
                        progress: null,
                        jobId: null,
                    })
                }
                throw new Error(message)
            }

            const submitJson = (await submitRes.json()) as {
                jobId: string
                status: "queued" | "completed"
                result?: TOutput
            }

            if (submitJson.status === "completed" && submitJson.result !== undefined) {
                if (!cancelledRef.current) {
                    setState({
                        status: "completed",
                        result: submitJson.result,
                        error: null,
                        progress: 100,
                        jobId: submitJson.jobId,
                    })
                }
                return submitJson.result
            }

            const jobId = submitJson.jobId
            if (!cancelledRef.current) {
                setState((prev) => ({ ...prev, status: "queued", jobId }))
            }

            let delay = INITIAL_DELAY_MS
            while (!cancelledRef.current) {
                await sleep(delay)
                if (cancelledRef.current) break

                const pollRes = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
                    cache: "no-store",
                })
                if (!pollRes.ok && pollRes.status !== 404) {
                    delay = Math.min(MAX_DELAY_MS, delay * BACKOFF_FACTOR)
                    continue
                }
                const status = (await pollRes.json()) as JobStatusResponse<TOutput>

                if (status.status === "completed") {
                    if (!cancelledRef.current) {
                        setState({
                            status: "completed",
                            result: status.result ?? null,
                            error: null,
                            progress: 100,
                            jobId,
                        })
                    }
                    if (status.result === undefined || status.result === null) {
                        throw new Error("Job completed without a result")
                    }
                    return status.result
                }

                if (status.status === "failed") {
                    const errorMessage = status.error || "Job failed"
                    if (!cancelledRef.current) {
                        setState({
                            status: "failed",
                            result: null,
                            error: errorMessage,
                            progress: null,
                            jobId,
                        })
                    }
                    throw new Error(errorMessage)
                }

                if (!cancelledRef.current) {
                    setState((prev) => ({
                        ...prev,
                        status: status.status === "active" ? "active" : "queued",
                        progress: status.progress ?? null,
                    }))
                }

                delay = Math.min(MAX_DELAY_MS, delay * BACKOFF_FACTOR)
            }

            throw new Error("Polling cancelled")
        },
        [options]
    )

    return { state, submit, reset }
}

async function safeJson(res: Response): Promise<unknown> {
    try {
        return await res.json()
    } catch {
        return null
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * One-shot helper for components with a dynamic endpoint where instantiating
 * useAsyncJob with a fixed endpoint isn't practical. Submits to the endpoint
 * with `?async=1`, polls /api/jobs/:id until the job finishes, returns result.
 */
export async function submitAsyncJob<TOutput>(
    endpoint: string,
    body: unknown,
    options?: { signal?: AbortSignal }
): Promise<TOutput> {
    const submitUrl = endpoint.includes("?") ? `${endpoint}&async=1` : `${endpoint}?async=1`
    const submitRes = await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: options?.signal,
    })
    if (!submitRes.ok && submitRes.status !== 202) {
        const errBody = await safeJson(submitRes)
        const message =
            (typeof errBody === "object" && errBody && "error" in errBody
                ? String((errBody as { error: unknown }).error)
                : null) || `Request failed: ${submitRes.status}`
        throw new Error(message)
    }
    const submitJson = (await submitRes.json()) as {
        jobId: string
        status: "queued" | "completed"
        result?: TOutput
    }
    if (submitJson.status === "completed" && submitJson.result !== undefined) {
        return submitJson.result
    }

    let delay = INITIAL_DELAY_MS
    while (true) {
        if (options?.signal?.aborted) {
            throw new DOMException("Aborted", "AbortError")
        }
        await sleep(delay)
        const pollRes = await fetch(`/api/jobs/${encodeURIComponent(submitJson.jobId)}`, {
            cache: "no-store",
            signal: options?.signal,
        })
        if (!pollRes.ok && pollRes.status !== 404) {
            delay = Math.min(MAX_DELAY_MS, delay * BACKOFF_FACTOR)
            continue
        }
        const status = (await pollRes.json()) as JobStatusResponse<TOutput>
        if (status.status === "completed") {
            if (status.result === undefined || status.result === null) {
                throw new Error("Job completed without a result")
            }
            return status.result
        }
        if (status.status === "failed") {
            throw new Error(status.error || "Job failed")
        }
        delay = Math.min(MAX_DELAY_MS, delay * BACKOFF_FACTOR)
    }
}
