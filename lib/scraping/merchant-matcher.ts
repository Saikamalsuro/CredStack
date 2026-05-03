import { createAdminClient } from '@/lib/db/admin'
import { inferCategory } from './category-matcher'
import type { OfferCategory } from '@/lib/types/offers'

interface MerchantRow {
  id: string
  slug: string
  name: string
  category: OfferCategory
  primary_domain: string | null
  aliases: string[] | null
}

let cached: MerchantRow[] | null = null
let cachedAt = 0
const CACHE_TTL_MS = 5 * 60 * 1000

async function loadMerchants(): Promise<MerchantRow[]> {
  if (cached && Date.now() - cachedAt < CACHE_TTL_MS) return cached
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('merchants')
    .select('id, slug, name, category, primary_domain, aliases')
  cached = (data ?? []) as MerchantRow[]
  cachedAt = Date.now()
  return cached
}

export interface MerchantMatch {
  merchantId: string | null
  merchantName: string | null
  category: OfferCategory
}

export async function matchMerchant(
  hint: string | null | undefined,
  fallbackCategory: OfferCategory = 'other'
): Promise<MerchantMatch> {
  const merchants = await loadMerchants()
  if (!hint) {
    return { merchantId: null, merchantName: null, category: fallbackCategory }
  }
  const lower = hint.toLowerCase().trim()

  for (const m of merchants) {
    if (lower === m.slug || lower === m.name.toLowerCase()) {
      return { merchantId: m.id, merchantName: m.name, category: m.category }
    }
    const aliases = (m.aliases ?? []).map((a) => a.toLowerCase())
    if (aliases.includes(lower)) {
      return { merchantId: m.id, merchantName: m.name, category: m.category }
    }
  }

  // partial / contains
  for (const m of merchants) {
    const mn = m.name.toLowerCase()
    if (lower.includes(mn) || mn.includes(lower)) {
      return { merchantId: m.id, merchantName: m.name, category: m.category }
    }
    if ((m.aliases ?? []).some((a) => lower.includes(a.toLowerCase()))) {
      return { merchantId: m.id, merchantName: m.name, category: m.category }
    }
  }

  // unknown merchant — keep the hint as denormalized name and infer category
  return { merchantId: null, merchantName: hint, category: inferCategory(hint) }
}

export async function refreshMerchantCache() {
  cached = null
}
