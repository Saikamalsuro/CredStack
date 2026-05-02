import { createPublicClient } from './public-client'

export interface Offer {
  id: string
  merchant: string
  title: string
  description: string | null
  applicableIssuers: string[]
  discountType: string
  discountValue: number | null
  minTxnAmount: number | null
  maxDiscount: number | null
  validFrom: string | null
  validUntil: string | null
  sourceUrl: string
}

export async function getActiveOffers(filter?: { issuers?: string[] }): Promise<Offer[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('valid_until', { ascending: true, nullsFirst: false })

  if (filter?.issuers?.length) {
    query = query.overlaps('applicable_issuers', filter.issuers)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id,
    merchant: row.merchant,
    title: row.title,
    description: row.description,
    applicableIssuers: row.applicable_issuers ?? [],
    discountType: row.discount_type,
    discountValue: row.discount_value,
    minTxnAmount: row.min_txn_amount,
    maxDiscount: row.max_discount,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    sourceUrl: row.source_url,
  }))
}
