import { createServerClient } from './server'

export interface RecentTransaction {
  id: string
  merchant: string
  category: string
  amount: number
  date: string
  cardName: string
}

export interface CategoryShare {
  name: string
  value: number
  color: string
}

export interface MonthlyAgg {
  month: string
  spending: number
  rewards: number
}

const CATEGORY_COLORS: Record<string, string> = {
  shopping_online: '#6366f1',
  shopping_offline: '#6366f1',
  shopping: '#6366f1',
  travel: '#22c55e',
  dining: '#f59e0b',
  fuel: '#ef4444',
  grocery: '#10b981',
  utilities: '#8b5cf6',
  other: '#94a3b8',
}

function paiseToRupees(p: number | null | undefined): number {
  return Math.round((p ?? 0) / 100)
}

export async function getRecentTransactions(userId: string, limit = 5): Promise<RecentTransaction[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id, merchant, category, amount_paise, txn_date,
      user_cards!inner(cards!inner(name, slug))
    `)
    .eq('user_id', userId)
    .order('txn_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = (row.user_cards as unknown as { cards: { name: string } }).cards
    return {
      id: row.id,
      merchant: row.merchant,
      category: row.category ?? 'other',
      amount: paiseToRupees(row.amount_paise),
      date: row.txn_date,
      cardName: card?.name ?? 'Card',
    }
  })
}

export async function getMonthlySpending(userId: string, months = 6): Promise<MonthlyAgg[]> {
  const supabase = await createServerClient()
  const since = new Date()
  since.setMonth(since.getMonth() - months + 1)
  since.setDate(1)
  const sinceStr = since.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('transactions')
    .select('txn_date, amount_paise, reward_earned_paise')
    .eq('user_id', userId)
    .gte('txn_date', sinceStr)
  if (error) throw error

  const buckets = new Map<string, { spend: number; rewards: number }>()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toLocaleString('en-US', { month: 'short' })
    buckets.set(key, { spend: 0, rewards: 0 })
  }

  for (const t of data ?? []) {
    const month = new Date(t.txn_date).toLocaleString('en-US', { month: 'short' })
    const bucket = buckets.get(month)
    if (!bucket) continue
    bucket.spend += paiseToRupees(t.amount_paise)
    bucket.rewards += paiseToRupees(t.reward_earned_paise)
  }

  return Array.from(buckets.entries()).map(([month, v]) => ({
    month,
    spending: v.spend,
    rewards: v.rewards,
  }))
}

export async function getCategoryShare(userId: string, days = 30): Promise<CategoryShare[]> {
  const supabase = await createServerClient()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('transactions')
    .select('category, amount_paise')
    .eq('user_id', userId)
    .gte('txn_date', since)
  if (error) throw error

  const tally = new Map<string, number>()
  let total = 0
  for (const t of data ?? []) {
    const cat = t.category ?? 'other'
    tally.set(cat, (tally.get(cat) ?? 0) + Number(t.amount_paise))
    total += Number(t.amount_paise)
  }
  if (total === 0) return []

  const labelMap: Record<string, string> = {
    shopping: 'Shopping',
    shopping_online: 'Shopping',
    shopping_offline: 'Shopping',
    travel: 'Travel',
    dining: 'Dining',
    fuel: 'Fuel',
    grocery: 'Grocery',
    utilities: 'Utilities',
    other: 'Other',
  }

  const grouped = new Map<string, number>()
  for (const [cat, amount] of tally.entries()) {
    const label = labelMap[cat] ?? 'Other'
    grouped.set(label, (grouped.get(label) ?? 0) + amount)
  }

  return Array.from(grouped.entries())
    .map(([name, amount]) => ({
      name,
      value: Math.round((amount / total) * 100),
      color: CATEGORY_COLORS[name.toLowerCase()] ?? '#94a3b8',
    }))
    .sort((a, b) => b.value - a.value)
}
