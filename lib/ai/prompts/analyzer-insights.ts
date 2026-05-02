import { z } from 'zod'

export const AnalyzerInsightsSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['optimization', 'warning']),
    title: z.string(),
    description: z.string(),
    impact: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
  })),
})

export type AnalyzerInsights = z.infer<typeof AnalyzerInsightsSchema>

export interface AnalyzerInsightsInput {
  totalSpend: number
  totalRewards: number
  categoryBreakdown: Array<{
    category: string
    spend: number
    rewards: number
    card: string
    efficiency: number
  }>
}

export function buildInsightsPrompt(input: AnalyzerInsightsInput) {
  const system = `You are a credit card optimization analyst. Given a user's monthly spend breakdown by category and current card-per-category usage with efficiency scores, produce 3 to 5 actionable optimizations. Each insight: type (optimization | warning), short title, 1-sentence description, impact in rupees per month (e.g. "+₹450/month") or a value description, priority (high|medium|low). Be concrete; reference specific cards and categories from the input. Output JSON: {insights: [...]}.`
  const user = JSON.stringify(input)
  return { system, user }
}

export const fallbackInsights: AnalyzerInsights = {
  insights: [
    {
      type: 'optimization',
      title: 'Connect a card to start optimizing',
      description: 'Add a card and upload a statement to receive personalized insights based on your real spending.',
      impact: 'Up to 15% of monthly spend',
      priority: 'high',
    },
  ],
}
