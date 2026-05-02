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
  const monthlySpendByCategory: Record<string, number> = {
    shopping_online: profile.monthlySpend * (profile.shopping / 100),
    travel: profile.monthlySpend * (profile.travel / 100),
    fuel: profile.monthlySpend * (profile.fuel / 100),
    dining: profile.monthlySpend * (profile.dining / 100),
    other:
      profile.monthlySpend *
      ((100 - profile.shopping - profile.travel - profile.fuel - profile.dining) / 100),
  }

  let monthlyReward = 0
  for (const [cat, amount] of Object.entries(monthlySpendByCategory)) {
    const catKey = cat as RewardCategoryKey
    if (card.exclusions.includes(catKey)) continue
    const rule = card.rewardRules.find((r) => r.category === catKey)
    const ratePct = rule?.ratePct ?? card.baseRewardRate
    const cap = rule?.monthlyCap ?? Infinity
    const earned = Math.min(amount * (ratePct / 100), cap)
    monthlyReward += earned
  }

  if (card.rewardCappingMonthly) {
    monthlyReward = Math.min(monthlyReward, card.rewardCappingMonthly)
  }

  let annualReward = monthlyReward * 12

  const annualSpend = profile.monthlySpend * 12
  for (const ms of card.milestones) {
    if (annualSpend >= ms.spendThreshold) {
      annualReward += ms.rewardValue
    }
  }

  const baseFee = card.annualFee
  const fee =
    card.annualFeeWaiverSpend && annualSpend >= card.annualFeeWaiverSpend ? 0 : baseFee

  return {
    expectedAnnualReward: Math.round(annualReward),
    fee,
    netAnnualValue: Math.round(annualReward - fee),
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
