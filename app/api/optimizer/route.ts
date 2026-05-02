import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getExtendedCardsBySlugs, getAllExtendedCards } from '@/lib/db/cards-extended'
import type { CardExtended, RewardCategoryKey } from '@/lib/types/extended'

const RequestSchema = z.object({
  merchant: z.string().min(1),
  amount: z.number().positive(),
  cardSlugs: z.array(z.string()).optional(),
  category: z.enum([
    'dining', 'fuel', 'travel', 'shopping_online', 'shopping_offline',
    'grocery', 'utilities', 'rent', 'wallet', 'government',
    'education', 'insurance', 'smartbuy', 'flipkart', 'amazon',
    'myntra', 'swiggy', 'zomato', 'uber', 'makemytrip',
    'shopping', 'other',
  ]).optional(),
})

const MERCHANT_TO_CATEGORY: Record<string, RewardCategoryKey> = {
  amazon: 'amazon',
  flipkart: 'flipkart',
  myntra: 'myntra',
  swiggy: 'swiggy',
  zomato: 'zomato',
  uber: 'uber',
  makemytrip: 'makemytrip',
  smartbuy: 'smartbuy',
}

function inferCategory(merchant: string): RewardCategoryKey {
  const m = merchant.toLowerCase()
  for (const [k, v] of Object.entries(MERCHANT_TO_CATEGORY)) {
    if (m.includes(k)) return v
  }
  if (/(restaurant|cafe|dine|food)/i.test(m)) return 'dining'
  if (/(petrol|fuel|hpcl|iocl|bpcl|indianoil)/i.test(m)) return 'fuel'
  if (/(grocery|bigbasket|jiomart|blinkit|zepto)/i.test(m)) return 'grocery'
  if (/(hotel|flight|airline|train|irctc)/i.test(m)) return 'travel'
  return 'shopping_online'
}

function rewardForCard(card: CardExtended, category: RewardCategoryKey, amount: number): { rate: number; reward: number; reason: string } {
  if (card.exclusions.includes(category)) {
    return { rate: 0, reward: 0, reason: `${card.name}: ${category} is excluded` }
  }
  const rule = card.rewardRules.find((r) => r.category === category)
  const rate = rule?.ratePct ?? card.baseRewardRate
  const reward = Math.min(amount * (rate / 100), rule?.monthlyCap ?? Infinity)
  return {
    rate,
    reward,
    reason: rule
      ? `${rate}% on ${category}${rule.monthlyCap ? ` (cap ₹${rule.monthlyCap}/mo)` : ''}`
      : `${rate}% base rate`,
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const { merchant, amount, cardSlugs, category } = parsed.data
  const inferredCategory = category ?? inferCategory(merchant)

  const cards = cardSlugs && cardSlugs.length > 0
    ? await getExtendedCardsBySlugs(cardSlugs)
    : await getAllExtendedCards()

  const ranked = cards
    .map((card) => {
      const r = rewardForCard(card, inferredCategory, amount)
      return {
        cardSlug: card.id,
        cardName: card.name,
        issuer: card.issuer,
        rate: r.rate,
        reward: Math.round(r.reward),
        reason: r.reason,
        cardColor: card.cardColor,
      }
    })
    .sort((a, b) => b.reward - a.reward)

  return NextResponse.json({
    category: inferredCategory,
    merchant,
    amount,
    ranked,
  })
}
