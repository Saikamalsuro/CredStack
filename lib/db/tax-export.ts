import { createServerClient } from './server'

export interface TaxYearTransaction {
  date: string
  merchant: string
  category: string
  amount: number
  cardName: string
}

export interface TaxYearCategoryAgg {
  category: string
  count: number
  total: number
}

export interface TaxYearReport {
  fyStart: string
  fyEnd: string
  totalSpend: number
  totalRewards: number
  forexSpend: number
  byCategory: TaxYearCategoryAgg[]
  transactions: TaxYearTransaction[]
}

function paiseToRupees(p: number | null | undefined): number {
  return Math.round((p ?? 0) / 100)
}

/**
 * Indian financial year runs Apr 1 → Mar 31. Pass any year that the FY starts in.
 * e.g. fyStartYear=2025 → 2025-04-01 to 2026-03-31.
 */
export async function getTaxYearReport(userId: string, fyStartYear: number): Promise<TaxYearReport> {
  const supabase = await createServerClient()
  const fyStart = `${fyStartYear}-04-01`
  const fyEnd = `${fyStartYear + 1}-03-31`

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      txn_date, merchant, category, amount_paise, reward_earned_paise,
      user_cards!inner(cards!inner(name))
    `)
    .eq('user_id', userId)
    .gte('txn_date', fyStart)
    .lte('txn_date', fyEnd)
    .order('txn_date', { ascending: true })
  if (error) throw error

  const txns: TaxYearTransaction[] = []
  let totalSpend = 0
  let totalRewards = 0
  const categoryMap = new Map<string, { count: number; total: number }>()

  for (const r of data ?? []) {
    const card = (r.user_cards as unknown as { cards: { name: string } }).cards
    const amount = paiseToRupees(r.amount_paise)
    const category = r.category ?? 'other'
    totalSpend += amount
    totalRewards += paiseToRupees(r.reward_earned_paise)
    const agg = categoryMap.get(category) ?? { count: 0, total: 0 }
    agg.count += 1
    agg.total += amount
    categoryMap.set(category, agg)
    txns.push({
      date: r.txn_date,
      merchant: r.merchant,
      category,
      amount,
      cardName: card?.name ?? 'Card',
    })
  }

  const byCategory: TaxYearCategoryAgg[] = [...categoryMap.entries()]
    .map(([category, v]) => ({ category, count: v.count, total: v.total }))
    .sort((a, b) => b.total - a.total)

  return {
    fyStart,
    fyEnd,
    totalSpend,
    totalRewards,
    forexSpend: 0,
    byCategory,
    transactions: txns,
  }
}

export function toCsv(report: TaxYearReport): string {
  const lines: string[] = []
  lines.push(`Financial Year,${report.fyStart} to ${report.fyEnd}`)
  lines.push('')
  lines.push(`Total spend (₹),${report.totalSpend}`)
  lines.push(`Total rewards (₹),${report.totalRewards}`)
  lines.push(`Forex spend (₹),${report.forexSpend}`)
  lines.push('')
  lines.push('Category,Transactions,Total (₹)')
  for (const c of report.byCategory) {
    lines.push(`${c.category},${c.count},${c.total}`)
  }
  lines.push('')
  lines.push('Date,Card,Merchant,Category,Amount (₹)')
  for (const t of report.transactions) {
    const m = t.merchant.replace(/[,"\n]/g, ' ').trim()
    const c = t.cardName.replace(/[,"\n]/g, ' ').trim()
    lines.push(`${t.date},${c},${m},${t.category},${t.amount}`)
  }
  return lines.join('\n')
}
