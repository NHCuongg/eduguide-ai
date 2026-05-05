// Bundles the BullMQ worker into a single JS file. Externals listed below are
// kept as require() calls so the runtime container can pull them from a
// minimal node_modules (instead of bundling native bindings into the file).
import { build } from "esbuild"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

await build({
    entryPoints: [path.join(root, "worker/index.ts")],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "cjs",
    outfile: path.join(root, "dist/worker.cjs"),
    sourcemap: false,
    minify: false,
    legalComments: "none",
    logLevel: "info",
    tsconfig: path.join(root, "tsconfig.json"),
    // Keep native + heavy modules external. Everything else (zod, our own
    // src/* code, prompts) gets inlined into the bundle.
    external: [
        "bullmq",
        "ioredis",
        "openai",
        "dotenv",
        "pino",
    ],
    alias: {
        "@": path.join(root, "src"),
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    },
})

console.log("worker bundle written to dist/worker.cjs")
