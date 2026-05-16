import { createPublicClient } from './public-client'

export type ChangeType = 'fee' | 'reward' | 'benefit' | 'eligibility' | 'discontinuation' | 'other'

export interface CardChange {
  date: string
  effective_date: string
  change_type: ChangeType
  summary: string
  detail: string
  source_url?: string
}

export interface CardChangeRow extends CardChange {
  cardSlug: string
  cardName: string
}

function isCardChange(v: unknown): v is CardChange {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return typeof o.date === 'string' && typeof o.summary === 'string'
}

function coerceChangelog(raw: unknown): CardChange[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(isCardChange)
}

export async function getCardChanges(slug: string): Promise<CardChange[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select('changelog')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return coerceChangelog(data?.changelog).slice().sort((a, b) => b.date.localeCompare(a.date))
}

export async function getRecentChangesForCards(slugs: string[], limit = 5): Promise<CardChangeRow[]> {
  if (slugs.length === 0) return []
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('cards')
    .select('slug, name, changelog')
    .in('slug', slugs)
  if (error) throw error

  const rows: CardChangeRow[] = []
  for (const r of data ?? []) {
    for (const c of coerceChangelog(r.changelog)) {
      rows.push({ ...c, cardSlug: r.slug, cardName: r.name })
    }
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
}
