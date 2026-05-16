import { createServerClient } from './server'
import type { Database } from './types'

type RewardCategory = Database['public']['Enums']['reward_category']

export interface UserTransaction {
  id: string
  date: string
  merchant: string
  category: RewardCategory | null
  amount: number
  reward: number
  cardName: string
}

export interface MonthlyAgg {
  month: string
  spending: number
  rewards: number
}

export async function listUserTransactions(userId: string, limit = 100): Promise<UserTransaction[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id, txn_date, merchant, category, amount_paise, reward_earned_paise,
      user_cards!inner(cards!inner(name))
    `)
    .eq('user_id', userId)
    .order('txn_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = (row.user_cards as unknown as { cards: { name: string } }).cards
    return {
      id: row.id,
      date: row.txn_date,
      merchant: row.merchant,
      category: row.category,
      amount: Math.round(Number(row.amount_paise) / 100),
      reward: Math.round(Number(row.reward_earned_paise ?? 0) / 100),
      cardName: card.name,
    }
  })
}

export async function reclassifyTransaction(
  userId: string,
  txnId: string,
  category: RewardCategory
): Promise<void> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('transactions')
    .update({ category })
    .eq('id', txnId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function getYearOverYearSpend(userId: string): Promise<{
  thisYear: MonthlyAgg[]
  lastYear: MonthlyAgg[]
}> {
  const supabase = await createServerClient()
  const now = new Date()
  const startOfThisYear = `${now.getFullYear()}-01-01`
  const startOfLastYear = `${now.getFullYear() - 1}-01-01`
  const endOfLastYear = `${now.getFullYear() - 1}-12-31`

  const { data: thisYear } = await supabase
    .from('transactions')
    .select('txn_date, amount_paise, reward_earned_paise')
    .eq('user_id', userId)
    .gte('txn_date', startOfThisYear)

  const { data: lastYear } = await supabase
    .from('transactions')
    .select('txn_date, amount_paise, reward_earned_paise')
    .eq('user_id', userId)
    .gte('txn_date', startOfLastYear)
    .lte('txn_date', endOfLastYear)

  function aggregate(rows: { txn_date: string; amount_paise: number; reward_earned_paise: number | null }[] | null): MonthlyAgg[] {
    const map = new Map<string, { spending: number; rewards: number }>()
    for (const r of rows ?? []) {
      const month = r.txn_date.slice(0, 7)
      const agg = map.get(month) ?? { spending: 0, rewards: 0 }
      agg.spending += Math.round(Number(r.amount_paise) / 100)
      agg.rewards += Math.round(Number(r.reward_earned_paise ?? 0) / 100)
      map.set(month, agg)
    }
    return [...map.entries()].sort().map(([month, v]) => ({ month, ...v }))
  }

  return {
    thisYear: aggregate(thisYear),
    lastYear: aggregate(lastYear),
  }
}
