import { z } from 'zod'
import type { CardExtended, SpendingProfile } from '@/lib/types/extended'

export const AdvisorExplanationSchema = z.object({
  explanation: z.string().min(20).max(400),
  estimatedAnnualReward: z.number().nonnegative(),
})

export type AdvisorExplanation = z.infer<typeof AdvisorExplanationSchema>

export function buildAdvisorExplanationPrompt(
  card: CardExtended,
  profile: SpendingProfile,
  computedAnnualReward: number
) {
  const compactCard = {
    name: card.name,
    issuer: card.issuer,
    annualFee: card.annualFee,
    rewards: card.rewards,
    rewardRules: card.rewardRules,
    exclusions: card.exclusions,
    milestones: card.milestones,
    welcomeBonus: card.welcomeBonus,
    loungeAccess: card.loungeAccess,
  }

  const system = `You are a credit card analyst. Given a card's structured data and a user's spending profile, produce a 1-2 sentence explanation of why this card fits (or does not). Be specific with rupee values. Never invent benefits. Output JSON: {"explanation": string, "estimatedAnnualReward": number}.`

  const user = `Card: ${JSON.stringify(compactCard)}
User profile: ${JSON.stringify(profile)}
Computed annual reward (do not contradict): ₹${computedAnnualReward}`

  return { system, user }
}

export function fallbackExplanation(card: CardExtended, computedAnnualReward: number): AdvisorExplanation {
  return {
    explanation: `Net annual value: ₹${computedAnnualReward.toLocaleString()} based on your spending profile. ${card.name} from ${card.issuer} — view details for the full breakdown.`,
    estimatedAnnualReward: computedAnnualReward,
  }
}
