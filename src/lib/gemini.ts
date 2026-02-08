import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from './env'

// Get API key with fallback
const apiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY || ""

if (!apiKey) {
    console.warn("Missing GEMINI_API_KEY or GOOGLE_API_KEY in environment variables.")
}

export const genAI = new GoogleGenerativeAI(apiKey)
export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
