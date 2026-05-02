import Groq from 'groq-sdk'
import { z, type ZodSchema } from 'zod'

let cached: Groq | null | undefined

function getGroq(): Groq | null {
  if (cached !== undefined) return cached
  const key = process.env.GROQ_API_KEY
  if (!key) {
    cached = null
    return null
  }
  cached = new Groq({ apiKey: key })
  return cached
}

export type GroqModel = 'reasoning' | 'fast'

function modelId(model: GroqModel): string {
  if (model === 'fast') {
    return process.env.GROQ_MODEL_FAST ?? 'llama-3.1-8b-instant'
  }
  return process.env.GROQ_MODEL_REASONING ?? 'llama-3.3-70b-versatile'
}

export interface CompleteOptions<T> {
  system: string
  user: string
  schema: ZodSchema<T>
  model?: GroqModel
  maxRetries?: number
  fallback: T
}

/**
 * Calls Groq with a Zod-validated structured-output prompt. If GROQ_API_KEY
 * is missing, the model fails to parse, or the network call errors, returns
 * the supplied fallback. Never throws — caller renders the fallback in the UI.
 */
export async function complete<T>({
  system,
  user,
  schema,
  model = 'reasoning',
  maxRetries = 2,
  fallback,
}: CompleteOptions<T>): Promise<{ data: T; source: 'groq' | 'fallback' }> {
  const groq = getGroq()
  if (!groq) return { data: fallback, source: 'fallback' }

  const sysWithJson =
    system + '\n\nReturn ONLY valid JSON matching the requested schema. No prose, no markdown, no code fences.'

  let lastErr: unknown = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await groq.chat.completions.create({
        model: modelId(model),
        messages: [
          { role: 'system', content: sysWithJson },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      })
      const content = res.choices[0]?.message?.content
      if (!content) throw new Error('empty response')
      const parsed = JSON.parse(content)
      const validated = schema.parse(parsed)
      return { data: validated, source: 'groq' }
    } catch (err) {
      lastErr = err
    }
  }
  console.warn('[groq] complete fell back after retries:', lastErr)
  return { data: fallback, source: 'fallback' }
}

export { z }
