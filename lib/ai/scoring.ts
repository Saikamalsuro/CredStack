import type {
  CardExtended,
  RewardCategoryKey,
  SpendingProfile,
} from "@/lib/types/extended"

export interface NetValueBreakdown {
  expectedAnnualReward: number
  fee: number
  netAnnualValue: number
  monthlyByCategory: Record<string, number>
}

const PROFILE_TO_CATEGORY: Record<string, RewardCategoryKey> = {
  shopping: "shopping_online",
  travel: "travel",
  fuel: "fuel",
  dining: "dining",
  other: "other",
}

export function computeNetAnnualValue(
  card: CardExtended,
  profile: SpendingProfile
): NetValueBreakdown {
  // Clamp the category split — if the four user-set pcts already exceed 100,
  // 'other' should be 0, not a negative spend.
  const allocated = profile.shopping + profile.travel + profile.fuel + profile.dining
  const otherPct = Math.max(0, 100 - allocated)

  const monthlySpendByCategory: Record<string, number> = {
    shopping_online: profile.monthlySpend * (profile.shopping / 100),
    travel: profile.monthlySpend * (profile.travel / 100),
    fuel: profile.monthlySpend * (profile.fuel / 100),
    dining: profile.monthlySpend * (profile.dining / 100),
    other: profile.monthlySpend * (otherPct / 100),
  }

  // Accumulate rewards in paise (integer) to avoid float drift across many cards.
  let monthlyRewardPaise = 0
  for (const [cat, amount] of Object.entries(monthlySpendByCategory)) {
    const catKey = cat as RewardCategoryKey
    if (card.exclusions.includes(catKey)) continue
    const rule = card.rewardRules.find((r) => r.category === catKey)
    const ratePct = rule?.ratePct ?? card.baseRewardRate
    const cap = rule?.monthlyCap ?? Infinity
    // (rupees * 100 paise) * (rate * 100 basis) / 10_000 = paise of reward
    const earnedPaise = Math.round(amount * 100 * (ratePct * 100) / 10_000)
    const cappedPaise = Math.min(earnedPaise, Math.round(cap * 100))
    monthlyRewardPaise += cappedPaise
  }

  if (card.rewardCappingMonthly) {
    monthlyRewardPaise = Math.min(monthlyRewardPaise, Math.round(card.rewardCappingMonthly * 100))
  }

  let annualRewardPaise = monthlyRewardPaise * 12

  const annualSpend = profile.monthlySpend * 12
  for (const ms of card.milestones) {
    if (annualSpend >= ms.spendThreshold) {
      annualRewardPaise += Math.round(ms.rewardValue * 100)
    }
  }

  const baseFee = card.annualFee
  const fee =
    card.annualFeeWaiverSpend && annualSpend >= card.annualFeeWaiverSpend ? 0 : baseFee

  const annualRewardRupees = Math.round(annualRewardPaise / 100)
  return {
    expectedAnnualReward: annualRewardRupees,
    fee,
    netAnnualValue: annualRewardRupees - fee,
    monthlyByCategory: monthlySpendByCategory,
  }
}

export const DEFAULT_PROFILE: SpendingProfile = {
  shopping: 25,
  travel: 25,
  fuel: 25,
  dining: 25,
  monthlySpend: 50000,
}

export { PROFILE_TO_CATEGORY }
