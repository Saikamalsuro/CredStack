import type { CreditCard } from "@/lib/data/cards"

export type RewardCategoryKey =
  | "dining"
  | "fuel"
  | "travel"
  | "shopping_online"
  | "shopping_offline"
  | "grocery"
  | "utilities"
  | "rent"
  | "wallet"
  | "government"
  | "education"
  | "insurance"
  | "smartbuy"
  | "flipkart"
  | "amazon"
  | "myntra"
  | "swiggy"
  | "zomato"
  | "uber"
  | "makemytrip"
  | "shopping"
  | "other"

export interface RewardRule {
  category: RewardCategoryKey
  ratePct: number
  monthlyCap: number | null
  notes?: string | null
}

export interface CardMilestone {
  spendThreshold: number
  rewardValue: number
  description: string
}

export interface CardInsuranceCover {
  coverType: string
  coverAmount: number
}

export interface CardExtended extends CreditCard {
  rewardRules: RewardRule[]
  exclusions: RewardCategoryKey[]
  milestones: CardMilestone[]
  insurance: CardInsuranceCover[]
  pointValuePaise: number | null
  rewardExpiryMonths: number | null
  rewardCappingMonthly: number | null
  annualFeeWaiverSpend: number | null
  baseRewardRate: number
  dataLastVerifiedAt: string | null
  mitcUrl: string | null
  applyUrl: string | null
  isLifetimeFree: boolean
}

export interface SpendingProfile {
  shopping: number
  travel: number
  fuel: number
  dining: number
  monthlySpend: number
}
