import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAllExtendedCards } from '@/lib/db/cards-extended'
import { computeNetAnnualValue } from '@/lib/ai/scoring'
import { complete } from '@/lib/ai/groq'
import {
  buildAdvisorExplanationPrompt,
  AdvisorExplanationSchema,
  fallbackExplanation,
} from '@/lib/ai/prompts/advisor-explanation'
import { cacheJson } from '@/lib/cache/redis'
import { rateLimit } from '@/lib/cache/ratelimit'
import { getCurrentUser } from '@/lib/auth/helpers'
import { saveAdvisorSession } from '@/lib/db/advisor-sessions'
import type { CreditCard } from '@/lib/data/cards'
import type { CardExtended } from '@/lib/types/extended'
import { createHash } from 'node:crypto'

const RequestSchema = z.object({
  shopping: z.number().min(0).max(100),
  travel: z.number().min(0).max(100),
  fuel: z.number().min(0).max(100),
  dining: z.number().min(0).max(100),
  monthlySpend: z.number().min(0),
  preferFreeCards: z.boolean(),
  needsLoungeAccess: z.boolean(),
  prioritizeForex: z.boolean().optional().default(false),
  prioritizeWelcomeBonus: z.boolean().optional().default(false),
})

function stripExtended(card: CardExtended): CreditCard {
  const {
    rewardRules: _a, exclusions: _b, milestones: _c, insurance: _d,
    pointValuePaise: _e, rewardExpiryMonths: _f, rewardCappingMonthly: _g,
    annualFeeWaiverSpend: _h, baseRewardRate: _i, dataLastVerifiedAt: _j,
    mitcUrl: _k, applyUrl: _l, isLifetimeFree: _m,
    ...base
  } = card
  return base
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  const identifier = user?.id ?? request.headers.get('x-forwarded-for') ?? 'anon'

  const limit = await rateLimit('advisor', identifier, 30, '1 d')
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Daily advisor limit reached. Try again tomorrow.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }
  const profile = parsed.data

  const cacheKey = `advisor:${createHash('sha256').update(JSON.stringify(profile)).digest('hex')}`

  const result = await cacheJson(cacheKey, 86400, async () => {
    const allExtended = await getAllExtendedCards()

    let candidates = allExtended
    if (profile.preferFreeCards) candidates = candidates.filter((c) => c.annualFee === 0)
    if (profile.needsLoungeAccess) candidates = candidates.filter((c) => c.loungeAccess !== null)
    candidates = candidates.filter((c) => profile.monthlySpend * 12 >= c.minIncome * 0.8)

    if (candidates.length === 0) candidates = allExtended

    const scored = candidates.map((card) => {
      const breakdown = computeNetAnnualValue(card, profile)
      let bonus = 0
      if (profile.prioritizeForex) {
        // Lower forex => bigger bonus. Cap at +5K to stay in net-value scale.
        bonus += Math.max(0, (5 - card.foreignTransactionFee) * 1000)
      }
      if (profile.prioritizeWelcomeBonus) {
        bonus += card.milestones.reduce((s, m) => s + m.rewardValue, 0)
      }
      return {
        card,
        breakdown: {
          ...breakdown,
          netAnnualValue: breakdown.netAnnualValue + bonus,
        },
      }
    })

    scored.sort((a, b) => b.breakdown.netAnnualValue - a.breakdown.netAnnualValue)

    const topCandidates = scored.slice(0, 8)

    const explanations: Record<string, string> = {}
    const scores: Record<string, { netAnnualValue: number; expectedAnnualReward: number; reasonsHighlight: string[] }> = {}

    await Promise.all(
      topCandidates.map(async ({ card, breakdown }) => {
        const prompt = buildAdvisorExplanationPrompt(card, profile, breakdown.expectedAnnualReward)
        const { data } = await complete({
          ...prompt,
          schema: AdvisorExplanationSchema,
          model: 'reasoning',
          fallback: fallbackExplanation(card, breakdown.expectedAnnualReward),
        })
        explanations[card.id] = data.explanation
        scores[card.id] = {
          netAnnualValue: breakdown.netAnnualValue,
          expectedAnnualReward: breakdown.expectedAnnualReward,
          reasonsHighlight: card.rewardRules.slice(0, 2).map((r) => `${r.ratePct}% on ${r.category}`),
        }
      })
    )

    const top4 = scored.slice(0, 4).map(({ card }) => stripExtended(card))

    return {
      recommendations: top4,
      explanations,
      scores,
    }
  })

  let sessionId: string | null = null
  try {
    const saved = await saveAdvisorSession({
      userId: user?.id ?? null,
      spendingProfile: profile,
      monthlySpend: profile.monthlySpend,
      recommendedCardIds: result.recommendations.map((c) => c.id),
      llmExplanations: result.explanations,
    })
    sessionId = saved.id
  } catch (err) {
    console.warn('[advisor] saveAdvisorSession failed', err)
  }

  return NextResponse.json({ sessionId, ...result })
}
