import { createServerClient } from './server'

export interface HealthSubscore {
  key: string
  label: string
  score: number
  weight: number
  helped: string[]
  hurt: string[]
  hasData: boolean
}

export interface FinancialHealthScore {
  total: number
  subscores: HealthSubscore[]
  cardCount: number
  totalLimit: number
  totalOutstanding: number
  loungeUsage: { used: number; quota: number | 'unlimited' | null }[]
}

interface UserCardSummary {
  id: string
  cardSlug: string
  cardName: string
  creditLimit: number | null
  forexMarkup: number
  domesticQuota: number | null
  intlQuota: number | null
}

async function getUserCardSummaries(userId: string): Promise<UserCardSummary[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_cards')
    .select(`
      id, credit_limit,
      cards!inner(slug, name, forex_markup_pct, domestic_lounges_per_year, intl_lounges_per_year)
    `)
    .eq('user_id', userId)
    .is('removed_at', null)
  if (error) throw error
  return (data ?? []).map((row) => {
    const card = row.cards as unknown as {
      slug: string
      name: string
      forex_markup_pct: number
      domestic_lounges_per_year: number | null
      intl_lounges_per_year: number | null
    }
    return {
      id: row.id,
      cardSlug: card.slug,
      cardName: card.name,
      creditLimit: row.credit_limit,
      forexMarkup: Number(card.forex_markup_pct ?? 0),
      domesticQuota: card.domestic_lounges_per_year,
      intlQuota: card.intl_lounges_per_year,
    }
  })
}

async function getLatestPayments(userId: string, months = 12) {
  const supabase = await createServerClient()
  // Subtract whole calendar months to avoid the 30*day approximation losing
  // ~5 days/year — the resulting date is what the user actually expects when
  // we say "last 12 months".
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  const since = d.toISOString()
  const { data, error } = await supabase
    .from('card_payments')
    .select('id, due_date, paid_at, total_due')
    .eq('user_id', userId)
    .gte('due_date', since)
  if (error) throw error
  return data ?? []
}

async function getLoungeVisitsThisYear(userId: string) {
  const supabase = await createServerClient()
  const yearStart = `${new Date().getFullYear()}-01-01`
  const { data, error } = await supabase
    .from('user_lounge_visits')
    .select('user_card_id, visit_type')
    .eq('user_id', userId)
    .gte('visit_date', yearStart)
  if (error) throw error
  return data ?? []
}

async function getRecentSpendByForex(userId: string) {
  const supabase = await createServerClient()
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      amount_paise,
      user_cards!inner(cards!inner(forex_markup_pct))
    `)
    .eq('user_id', userId)
    .gte('txn_date', since)
  if (error) throw error
  let totalPaise = 0
  let highForexPaise = 0
  for (const row of data ?? []) {
    const markup = Number(
      (row.user_cards as unknown as { cards: { forex_markup_pct: number } }).cards.forex_markup_pct ?? 0
    )
    const amt = row.amount_paise as unknown as number
    totalPaise += amt
    if (markup >= 3) highForexPaise += amt
  }
  return { totalPaise, highForexPaise }
}

export async function computeHealthScore(userId: string): Promise<FinancialHealthScore> {
  const [cards, payments, visits, forex] = await Promise.all([
    getUserCardSummaries(userId),
    getLatestPayments(userId, 12),
    getLoungeVisitsThisYear(userId),
    getRecentSpendByForex(userId),
  ])

  const totalLimit = cards.reduce((s, c) => s + (c.creditLimit ?? 0), 0)
  // Outstanding from unpaid payments
  const totalOutstanding = payments
    .filter((p) => !p.paid_at)
    .reduce((s, p) => s + (p.total_due ?? 0), 0)

  // 1) Utilization (30 weight)
  const utilizationPct = totalLimit > 0 ? (totalOutstanding / totalLimit) * 100 : 0
  let utilScore = 0
  const utilHelped: string[] = []
  const utilHurt: string[] = []
  if (totalLimit === 0) {
    utilScore = 0
    utilHurt.push('Add a credit limit on each card to compute utilisation')
  } else if (utilizationPct < 10) {
    utilScore = 30
    utilHelped.push(`Utilisation ${utilizationPct.toFixed(1)}% — excellent`)
  } else if (utilizationPct < 30) {
    utilScore = 26
    utilHelped.push(`Utilisation ${utilizationPct.toFixed(1)}% — healthy`)
  } else if (utilizationPct < 50) {
    utilScore = 15
    utilHurt.push(`Utilisation ${utilizationPct.toFixed(1)}% — start affecting CIBIL`)
  } else if (utilizationPct < 80) {
    utilScore = 6
    utilHurt.push(`Utilisation ${utilizationPct.toFixed(1)}% — high, may hurt approvals`)
  } else {
    utilScore = 0
    utilHurt.push(`Utilisation ${utilizationPct.toFixed(1)}% — critical, CIBIL damage likely`)
  }

  // 2) Payment history (30 weight)
  let payScore = 30
  const payHelped: string[] = []
  const payHurt: string[] = []
  const dueAndPast = payments.filter((p) => new Date(p.due_date) <= new Date())
  if (dueAndPast.length === 0) {
    payScore = 15
    payHurt.push('Not enough payment history yet to score')
  } else {
    const late = dueAndPast.filter(
      (p) => !p.paid_at || new Date(p.paid_at) > new Date(p.due_date)
    )
    const onTimePct = ((dueAndPast.length - late.length) / dueAndPast.length) * 100
    if (onTimePct === 100) {
      payScore = 30
      payHelped.push(`100% on-time across ${dueAndPast.length} payments`)
    } else if (onTimePct >= 95) {
      payScore = 24
      payHelped.push(`${onTimePct.toFixed(0)}% on-time — strong`)
    } else if (onTimePct >= 80) {
      payScore = 14
      payHurt.push(`${late.length} late payment${late.length === 1 ? '' : 's'} hurt the score`)
    } else {
      payScore = 4
      payHurt.push(`${late.length} late payments — fix this first`)
    }
  }

  // 3) Credit mix (15 weight)
  const mixHelped: string[] = []
  const mixHurt: string[] = []
  let mixScore = 0
  if (cards.length === 0) {
    mixScore = 0
    mixHurt.push('No cards added yet')
  } else if (cards.length === 1) {
    mixScore = 6
    mixHurt.push('Single-card portfolio limits negotiating power')
  } else if (cards.length <= 3) {
    mixScore = 12
    mixHelped.push(`${cards.length} cards — focused mix`)
  } else if (cards.length <= 6) {
    mixScore = 15
    mixHelped.push(`${cards.length} cards — diverse portfolio`)
  } else {
    mixScore = 10
    mixHurt.push(`${cards.length} cards — manageability becomes the bottleneck`)
  }

  // 4) Reward optimization via lounge usage proxy (15 weight)
  const optHelped: string[] = []
  const optHurt: string[] = []
  let optScore = 0
  let totalLoungeQuota = 0
  let totalLoungeUsed = 0
  let unlimitedCardCount = 0
  for (const card of cards) {
    if (card.domesticQuota === -1) unlimitedCardCount++
    else if (card.domesticQuota) totalLoungeQuota += card.domesticQuota
    if (card.intlQuota === -1) unlimitedCardCount++
    else if (card.intlQuota) totalLoungeQuota += card.intlQuota
  }
  totalLoungeUsed = visits.length
  const optHasData = totalLoungeQuota > 0 || unlimitedCardCount > 0
  if (!optHasData) {
    optScore = 7
    optHurt.push('No lounge entitlements to optimise')
  } else if (totalLoungeQuota === 0) {
    optScore = 12
    optHelped.push('Unlimited-lounge cards in portfolio')
  } else {
    const usagePct = (totalLoungeUsed / totalLoungeQuota) * 100
    if (usagePct >= 70) {
      optScore = 15
      optHelped.push(`${totalLoungeUsed}/${totalLoungeQuota} lounge visits — capturing benefit`)
    } else if (usagePct >= 30) {
      optScore = 10
      optHelped.push(`${totalLoungeUsed}/${totalLoungeQuota} lounge visits used`)
    } else {
      optScore = 4
      optHurt.push(`Only ${totalLoungeUsed}/${totalLoungeQuota} lounge visits — leaving value on the table`)
    }
  }

  // 5) Forex exposure (10 weight)
  const fxHelped: string[] = []
  const fxHurt: string[] = []
  let fxScore = 5
  const fxHasData = forex.totalPaise > 0
  if (fxHasData) {
    const highPct = (forex.highForexPaise / forex.totalPaise) * 100
    if (highPct < 10) {
      fxScore = 10
      fxHelped.push('Forex spend mostly on low-markup cards')
    } else if (highPct < 40) {
      fxScore = 6
    } else {
      fxScore = 2
      fxHurt.push(`${highPct.toFixed(0)}% of recent spend used 3%+ forex cards`)
    }
  } else {
    fxScore = 5
  }

  const subscores: HealthSubscore[] = [
    { key: 'utilization', label: 'Credit utilisation', score: utilScore, weight: 30, helped: utilHelped, hurt: utilHurt, hasData: totalLimit > 0 },
    { key: 'payments', label: 'Payment history', score: payScore, weight: 30, helped: payHelped, hurt: payHurt, hasData: dueAndPast.length > 0 },
    { key: 'mix', label: 'Card mix', score: mixScore, weight: 15, helped: mixHelped, hurt: mixHurt, hasData: cards.length > 0 },
    { key: 'optimization', label: 'Reward optimisation', score: optScore, weight: 15, helped: optHelped, hurt: optHurt, hasData: optHasData },
    { key: 'forex', label: 'Forex exposure', score: fxScore, weight: 10, helped: fxHelped, hurt: fxHurt, hasData: fxHasData },
  ]

  const total = subscores.reduce((s, x) => s + x.score, 0)

  return {
    total,
    subscores,
    cardCount: cards.length,
    totalLimit,
    totalOutstanding,
    loungeUsage: [],
  }
}
