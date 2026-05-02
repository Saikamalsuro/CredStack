import { createPublicClient } from "./public-client"
import type { CreditCard, CardCategory, CardNetwork } from "@/lib/data/cards"
import type {
  CardExtended,
  RewardCategoryKey,
  RewardRule,
  CardMilestone,
  CardInsuranceCover,
} from "@/lib/types/extended"
import type { Tables } from "./types"

type CardRow = Tables<"cards"> & {
  card_benefits?: { title: string; display_order: number | null }[]
  card_reward_rules?: {
    category: string
    reward_rate_pct: number
    monthly_cap: number | null
    notes: string | null
  }[]
  card_exclusions?: { category: string }[]
  card_milestones?: {
    spend_threshold: number
    reward_value: number
    reward_description: string
  }[]
  card_insurance?: { cover_type: string; cover_amount: number }[]
}

const SELECT_EXTENDED = `*,
  card_benefits(title, display_order),
  card_reward_rules(category, reward_rate_pct, monthly_cap, notes),
  card_exclusions(category),
  card_milestones(spend_threshold, reward_value, reward_description),
  card_insurance(cover_type, cover_amount)`

function rowToExtended(row: CardRow): CardExtended {
  const benefits = (row.card_benefits ?? [])
    .slice()
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((b) => b.title)

  const dom = row.domestic_lounges_per_year
  const intl = row.intl_lounges_per_year
  const loungeAccess =
    dom === null && intl === null
      ? null
      : {
          domestic: dom === -1 ? ("unlimited" as const) : (dom ?? 0),
          international: intl === -1 ? ("unlimited" as const) : (intl ?? 0),
        }

  const base: CreditCard = {
    id: row.slug,
    name: row.name,
    issuer: row.issuer,
    network: row.network as CardNetwork,
    category: row.categories as CardCategory[],
    annualFee: row.annual_fee,
    joiningFee: row.joining_fee,
    interestRate: { min: Number(row.apr_min), max: Number(row.apr_max) },
    creditLimit: { min: row.credit_limit_min, max: row.credit_limit_max },
    rewards: {
      type: row.reward_type,
      rate: Number(row.base_reward_rate),
      description: row.reward_description,
    },
    benefits,
    loungeAccess,
    welcomeBonus: row.welcome_bonus_text,
    fuelSurchargeWaiver: row.fuel_surcharge_waiver,
    foreignTransactionFee: Number(row.forex_markup_pct),
    minIncome: row.min_income,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    imageUrl: row.image_url ?? "/placeholder.svg",
    cardColor: row.card_color_gradient,
    featured: row.featured,
    popular: row.popular,
  }

  const rewardRules: RewardRule[] = (row.card_reward_rules ?? []).map((r) => ({
    category: r.category as RewardCategoryKey,
    ratePct: Number(r.reward_rate_pct),
    monthlyCap: r.monthly_cap,
    notes: r.notes,
  }))

  const exclusions: RewardCategoryKey[] = (row.card_exclusions ?? []).map(
    (e) => e.category as RewardCategoryKey
  )

  const milestones: CardMilestone[] = (row.card_milestones ?? []).map((m) => ({
    spendThreshold: m.spend_threshold,
    rewardValue: m.reward_value,
    description: m.reward_description,
  }))

  const insurance: CardInsuranceCover[] = (row.card_insurance ?? []).map((i) => ({
    coverType: i.cover_type,
    coverAmount: i.cover_amount,
  }))

  return {
    ...base,
    rewardRules,
    exclusions,
    milestones,
    insurance,
    baseRewardRate: Number(row.base_reward_rate),
    pointValuePaise: row.point_value_paise,
    rewardExpiryMonths: row.reward_expiry_months,
    rewardCappingMonthly: row.reward_capping_monthly,
    annualFeeWaiverSpend: row.annual_fee_waiver_spend,
    dataLastVerifiedAt: row.data_last_verified_at,
    mitcUrl: row.mitc_url,
    applyUrl: row.apply_url,
    isLifetimeFree: row.is_lifetime_free,
  }
}

export async function getExtendedCardBySlug(slug: string): Promise<CardExtended | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("cards")
    .select(SELECT_EXTENDED)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (error) throw error
  return data ? rowToExtended(data as unknown as CardRow) : null
}

export async function getExtendedCardsBySlugs(slugs: string[]): Promise<CardExtended[]> {
  if (slugs.length === 0) return []
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("cards")
    .select(SELECT_EXTENDED)
    .in("slug", slugs)
    .eq("is_active", true)

  if (error) throw error
  return (data ?? []).map((r) => rowToExtended(r as unknown as CardRow))
}

export async function getAllExtendedCards(): Promise<CardExtended[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from("cards")
    .select(SELECT_EXTENDED)
    .eq("is_active", true)
    .order("rating", { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToExtended(r as unknown as CardRow))
}
