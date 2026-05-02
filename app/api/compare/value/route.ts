import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getExtendedCardsBySlugs } from '@/lib/db/cards-extended'
import { computeNetAnnualValue, DEFAULT_PROFILE } from '@/lib/ai/scoring'

const RequestSchema = z.object({
  cardSlugs: z.array(z.string()).min(1).max(8),
  spendingProfile: z
    .object({
      shopping: z.number().min(0).max(100),
      travel: z.number().min(0).max(100),
      fuel: z.number().min(0).max(100),
      dining: z.number().min(0).max(100),
      monthlySpend: z.number().min(0),
    })
    .optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const profile = parsed.data.spendingProfile ?? DEFAULT_PROFILE
  const cards = await getExtendedCardsBySlugs(parsed.data.cardSlugs)
  const values: Record<string, { netValue: number; rewardValue: number; fee: number }> = {}
  for (const c of cards) {
    const b = computeNetAnnualValue(c, profile)
    values[c.id] = {
      netValue: b.netAnnualValue,
      rewardValue: b.expectedAnnualReward,
      fee: b.fee,
    }
  }
  return NextResponse.json({ values })
}
