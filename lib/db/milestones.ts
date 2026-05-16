import { createServerClient } from './server'

export interface MilestoneProgress {
  cardSlug: string
  cardName: string
  cardColor: string
  spendThreshold: number
  rewardValue: number
  rewardDescription: string
  period: string
  currentSpend: number
  pct: number
  remaining: number
}

function periodStart(period: string): string {
  const now = new Date()
  switch (period) {
    case 'annual': {
      // Indian FY April-March
      const fyStartYear = now.getMonth() + 1 < 4 ? now.getFullYear() - 1 : now.getFullYear()
      return `${fyStartYear}-04-01`
    }
    case 'quarterly': {
      const q = Math.floor(now.getMonth() / 3) * 3
      return new Date(now.getFullYear(), q, 1).toISOString().slice(0, 10)
    }
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    default:
      return `${now.getFullYear()}-01-01`
  }
}

export async function getMilestoneProgress(userId: string): Promise<MilestoneProgress[]> {
  const supabase = await createServerClient()

  // Get user's cards
  const { data: userCards, error: uErr } = await supabase
    .from('user_cards')
    .select(`
      id, card_id,
      cards!inner(slug, name, card_color_gradient)
    `)
    .eq('user_id', userId)
    .is('removed_at', null)
  if (uErr) throw uErr

  if (!userCards || userCards.length === 0) return []

  const cardIds = userCards.map((u) => u.card_id)
  const userCardIds = userCards.map((u) => u.id)

  // Get milestones for those cards
  const { data: milestones, error: mErr } = await supabase
    .from('card_milestones')
    .select('*')
    .in('card_id', cardIds)
  if (mErr) throw mErr

  if (!milestones || milestones.length === 0) return []

  // Get this period's spend per user_card
  const periodStartByPeriod = new Map<string, string>()
  for (const m of milestones) {
    if (!periodStartByPeriod.has(m.period)) {
      periodStartByPeriod.set(m.period, periodStart(m.period))
    }
  }

  const earliestStart = [...periodStartByPeriod.values()].sort()[0]
  const { data: txns, error: tErr } = await supabase
    .from('transactions')
    .select('user_card_id, amount_paise, txn_date')
    .eq('user_id', userId)
    .in('user_card_id', userCardIds)
    .gte('txn_date', earliestStart)
  if (tErr) throw tErr

  const spendByCard = new Map<string, { date: string; amount: number }[]>()
  for (const t of txns ?? []) {
    const arr = spendByCard.get(t.user_card_id) ?? []
    arr.push({ date: t.txn_date, amount: Number(t.amount_paise) / 100 })
    spendByCard.set(t.user_card_id, arr)
  }

  const cardIdToInfo = new Map<string, { slug: string; name: string; color: string; userCardId: string }>()
  for (const uc of userCards) {
    const card = uc.cards as unknown as { slug: string; name: string; card_color_gradient: string }
    cardIdToInfo.set(uc.card_id, {
      slug: card.slug,
      name: card.name,
      color: card.card_color_gradient,
      userCardId: uc.id,
    })
  }

  const out: MilestoneProgress[] = []
  for (const m of milestones) {
    const info = cardIdToInfo.get(m.card_id)
    if (!info) continue
    const ps = periodStartByPeriod.get(m.period) ?? earliestStart
    const arr = spendByCard.get(info.userCardId) ?? []
    const currentSpend = arr.filter((s) => s.date >= ps).reduce((s, t) => s + t.amount, 0)
    const pct = m.spend_threshold > 0 ? Math.min(100, (currentSpend / m.spend_threshold) * 100) : 0
    out.push({
      cardSlug: info.slug,
      cardName: info.name,
      cardColor: info.color,
      spendThreshold: m.spend_threshold,
      rewardValue: m.reward_value,
      rewardDescription: m.reward_description,
      period: m.period,
      currentSpend: Math.round(currentSpend),
      pct,
      remaining: Math.max(0, m.spend_threshold - Math.round(currentSpend)),
    })
  }
  return out.sort((a, b) => b.pct - a.pct)
}
