import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Allow client-side usage if needed, though server-side is preferred
})
