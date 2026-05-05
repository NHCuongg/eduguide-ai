// Register all LLM job specs in the worker process. We import the spec data
// directly (not the API route files) so the worker bundle stays free of
// Next.js / next-auth / React server dependencies.
import { ALL_LLM_JOB_SPECS } from "@/lib/jobs/specs"
import { registerJobSpec } from "@/lib/queue/registry"

for (const spec of ALL_LLM_JOB_SPECS) {
    registerJobSpec(spec)
}
