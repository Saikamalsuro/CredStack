import { createServerClient } from './server'
import type { CreditCard, CardCategory, CardNetwork } from '@/lib/data/cards'
import type { Tables } from './types'

type CardRow = Tables<'cards'> & {
  card_benefits?: { title: string; display_order: number | null }[]
}

function rowToCard(row: CardRow): CreditCard {
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
          domestic: dom === -1 ? ('unlimited' as const) : (dom ?? 0),
          international: intl === -1 ? ('unlimited' as const) : (intl ?? 0),
        }

  return {
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
    imageUrl: row.image_url ?? '/placeholder.svg',
    cardColor: row.card_color_gradient,
    featured: row.featured,
    popular: row.popular,
  }
}

const CARD_SELECT = '*, card_benefits(title, display_order)'

export async function getCards(): Promise<CreditCard[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}

export async function getCardById(slug: string): Promise<CreditCard | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data ? rowToCard(data as unknown as CardRow) : null
}

export async function getFeaturedCards(): Promise<CreditCard[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select(CARD_SELECT)
    .eq('is_active', true)
    .eq('featured', true)
    .order('rating', { ascending: false, nullsFirst: false })

  if (error) throw error
  return (data ?? []).map((r) => rowToCard(r as unknown as CardRow))
}
