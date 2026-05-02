import { createServerClient } from './server'
import type { CreditCard, CardCategory, CardNetwork } from '@/lib/data/cards'
import type { Tables } from './types'

type CardRow = Tables<'cards'>

type RangeJson = { min: number; max: number }
type RewardsJson = { type: 'points' | 'cashback' | 'miles'; rate: number; description: string }
type LoungeJson = { domestic: number | 'unlimited'; international: number | 'unlimited' }

function rowToCard(row: CardRow): CreditCard {
  return {
    id: row.id,
    name: row.name,
    issuer: row.issuer,
    network: row.network as CardNetwork,
    category: row.category as CardCategory[],
    annualFee: row.annual_fee,
    joiningFee: row.joining_fee,
    interestRate: row.interest_rate as unknown as RangeJson,
    creditLimit: row.credit_limit as unknown as RangeJson,
    rewards: row.rewards as unknown as RewardsJson,
    benefits: row.benefits,
    loungeAccess: row.lounge_access as unknown as LoungeJson | null,
    welcomeBonus: row.welcome_bonus,
    fuelSurchargeWaiver: row.fuel_surcharge_waiver,
    foreignTransactionFee: Number(row.foreign_transaction_fee),
    minIncome: row.min_income,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    imageUrl: row.image_url,
    cardColor: row.card_color,
    featured: row.featured,
    popular: row.popular,
  }
}

export async function getCards(): Promise<CreditCard[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('rating', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToCard)
}

export async function getCardById(id: string): Promise<CreditCard | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? rowToCard(data) : null
}

export async function getFeaturedCards(): Promise<CreditCard[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })

  if (error) throw error
  return (data ?? []).map(rowToCard)
}
