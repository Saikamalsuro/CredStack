import { createAdminClient } from '@/lib/db/admin'
import type { CardMatch } from '@/lib/types/offers'

interface CardRow {
  id: string
  slug: string
  name: string
  issuer: string
  network: string
}

let cachedCards: CardRow[] | null = null
let cachedAt = 0
const CACHE_TTL_MS = 5 * 60 * 1000

async function loadCards(): Promise<CardRow[]> {
  if (cachedCards && Date.now() - cachedAt < CACHE_TTL_MS) return cachedCards
  const supabase = createAdminClient()
  const { data } = await supabase.from('cards').select('id, slug, name, issuer, network')
  cachedCards = (data ?? []) as CardRow[]
  cachedAt = Date.now()
  return cachedCards
}

function normIssuer(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bbank\b/g, '')
    .replace(/\bcards?\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function normNetwork(s: string): string {
  const n = s.toLowerCase().trim()
  if (n.startsWith('amex') || n.startsWith('american')) return 'amex'
  if (n.includes('master')) return 'mastercard'
  if (n.includes('rupay')) return 'rupay'
  if (n.includes('diners')) return 'diners'
  if (n.includes('visa')) return 'visa'
  return n
}

interface MatchInput {
  cardMention?: string | null
  eligibleIssuers?: string[]
  eligibleNetworks?: string[]
  defaultIssuer?: string | null
}

export async function matchOfferToCards(input: MatchInput): Promise<CardMatch[]> {
  const cards = await loadCards()
  const seen = new Map<string, CardMatch>()

  const add = (m: CardMatch) => {
    const prev = seen.get(m.cardId)
    if (!prev || prev.confidence < m.confidence) seen.set(m.cardId, m)
  }

  // Tier 1: explicit card name mention (substring or token overlap)
  if (input.cardMention) {
    const mention = input.cardMention.toLowerCase()
    for (const c of cards) {
      const cn = c.name.toLowerCase()
      if (mention.includes(cn) || cn.includes(mention)) {
        add({ cardId: c.id, reason: 'explicit_card_name', confidence: 0.92 })
      }
    }
  }

  // Tier 2: issuer-only match (incl. defaultIssuer hint from source)
  const issuerCandidates = new Set<string>()
  for (const i of input.eligibleIssuers ?? []) issuerCandidates.add(normIssuer(i))
  if (input.defaultIssuer && (!input.eligibleIssuers || input.eligibleIssuers.length === 0)) {
    issuerCandidates.add(normIssuer(input.defaultIssuer))
  }
  if (issuerCandidates.size > 0) {
    for (const c of cards) {
      const ci = normIssuer(c.issuer)
      for (const cand of issuerCandidates) {
        if (cand && (ci === cand || ci.includes(cand) || cand.includes(ci))) {
          add({ cardId: c.id, reason: 'issuer_match', confidence: 0.7 })
          break
        }
      }
    }
  }

  // Tier 3: network-only match
  if (input.eligibleNetworks?.length) {
    const wanted = new Set(input.eligibleNetworks.map(normNetwork))
    for (const c of cards) {
      if (wanted.has(normNetwork(c.network))) {
        add({ cardId: c.id, reason: 'network_match', confidence: 0.5 })
      }
    }
  }

  return [...seen.values()]
}

export function bandFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.85) return 'high'
  if (score >= 0.65) return 'medium'
  return 'low'
}
