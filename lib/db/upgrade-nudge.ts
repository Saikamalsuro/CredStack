import { createServerClient } from './server'
import type { Database } from './types'

type CardTier = Database['public']['Enums']['card_tier']

export interface UpgradeNudge {
  fromSlug: string
  fromName: string
  fromColor: string
  toSlug: string
  toName: string
  toColor: string
  fromBaseRate: number
  toBaseRate: number
  estimatedAnnualGain: number
}

export async function getUpgradeNudges(userId: string, monthlySpend = 30000): Promise<UpgradeNudge[]> {
  const supabase = await createServerClient()

  const { data: userCards, error: uErr } = await supabase
    .from('user_cards')
    .select(`
      card_id,
      cards!inner(slug, name, card_color_gradient, base_reward_rate, tier, issuer, annual_fee)
    `)
    .eq('user_id', userId)
    .is('removed_at', null)
  if (uErr) throw uErr

  if (!userCards || userCards.length === 0) return []

  // For each user card, find better-rate card in same tier from any issuer
  const nudges: UpgradeNudge[] = []
  for (const uc of userCards) {
    const card = uc.cards as unknown as {
      slug: string
      name: string
      card_color_gradient: string
      base_reward_rate: number
      tier: string | null
      issuer: string
      annual_fee: number
    }
    if (!card.tier) continue

    const { data: better } = await supabase
      .from('cards')
      .select('slug, name, card_color_gradient, base_reward_rate, annual_fee')
      .eq('is_active', true)
      .eq('tier', card.tier as CardTier)
      .gt('base_reward_rate', card.base_reward_rate)
      .neq('slug', card.slug)
      .order('base_reward_rate', { ascending: false })
      .limit(1)

    const target = better?.[0]
    if (!target) continue

    const fromRate = Number(card.base_reward_rate)
    const toRate = Number(target.base_reward_rate)
    const rateLiftBasisPoints = Math.round((toRate - fromRate) * 100)
    // (rateLiftBP * monthlySpend rupees * 12 months) / 10_000 = annual gain in rupees
    const grossGain = Math.round((rateLiftBasisPoints * monthlySpend * 12) / 10_000)
    const annualGain = grossGain - (target.annual_fee - card.annual_fee)
    if (annualGain < 500) continue

    nudges.push({
      fromSlug: card.slug,
      fromName: card.name,
      fromColor: card.card_color_gradient,
      toSlug: target.slug,
      toName: target.name,
      toColor: target.card_color_gradient,
      fromBaseRate: fromRate,
      toBaseRate: toRate,
      estimatedAnnualGain: annualGain,
    })
  }
  return nudges.slice(0, 3)
}
