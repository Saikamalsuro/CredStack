import { createPublicClient } from './public-client'

export type NonCreditCardType = 'debit' | 'prepaid'

export interface NonCreditCard {
  id: string
  slug: string
  name: string
  issuer: string
  cardType: NonCreditCardType
  network: string
  annualFee: number
  joiningFee: number
  forexMarkupPct: number
  atmWithdrawalLimitDaily: number | null
  posLimitDaily: number | null
  keyFeatures: string[]
  linkedAccountRequired: boolean
  imageUrl: string | null
  cardColorGradient: string
  applyUrl: string | null
  dataPending: boolean
}

export async function getNonCreditCardsByIssuer(issuer: string): Promise<NonCreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('non_credit_cards')
    .select('*')
    .eq('issuer', issuer)
    .eq('is_active', true)
    .order('card_type')
    .order('annual_fee')
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function getAllNonCreditCards(): Promise<NonCreditCard[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('non_credit_cards')
    .select('*')
    .eq('is_active', true)
    .order('issuer')
    .order('card_type')
  if (error) throw error
  return (data ?? []).map(mapRow)
}

function mapRow(row: Record<string, unknown>): NonCreditCard {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    issuer: row.issuer as string,
    cardType: row.card_type as NonCreditCardType,
    network: row.network as string,
    annualFee: row.annual_fee as number,
    joiningFee: row.joining_fee as number,
    forexMarkupPct: Number(row.forex_markup_pct),
    atmWithdrawalLimitDaily: row.atm_withdrawal_limit_daily as number | null,
    posLimitDaily: row.pos_limit_daily as number | null,
    keyFeatures: (row.key_features as string[]) ?? [],
    linkedAccountRequired: row.linked_account_required as boolean,
    imageUrl: row.image_url as string | null,
    cardColorGradient: row.card_color_gradient as string,
    applyUrl: row.apply_url as string | null,
    dataPending: row.data_pending as boolean,
  }
}
