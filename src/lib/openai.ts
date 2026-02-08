import OpenAI from 'openai'
import { env } from './env'

export const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    // Removed dangerouslyAllowBrowser - API keys should only be used server-side
})
