import type { CardExtended } from '@/lib/types/extended'

/**
 * Build a single feature string per card that captures the structured
 * signals a content-based recommender should cluster on:
 *  - issuer + name (so co-brand cards group)
 *  - categories + reward type
 *  - fee tier
 *  - lounge / forex / fuel waiver flags
 *  - reward rules (top accelerated categories with rates)
 *  - top benefits as free text
 *
 * Deterministic — same input always produces same string, so embeddings
 * are stable across re-runs.
 */
export function buildCardFeatureString(card: CardExtended): string {
  const lines: string[] = []

  lines.push(`Issuer: ${card.issuer}`)
  lines.push(`Name: ${card.name}`)
  lines.push(`Categories: ${card.category.join(', ')}`)
  lines.push(`Network: ${card.network}`)
  lines.push(`Reward type: ${card.rewards.type}`)
  lines.push(`Reward rate: ${card.rewards.rate}%`)
  lines.push(`Reward description: ${card.rewards.description}`)

  if (card.annualFee === 0) {
    lines.push('Fee: lifetime free')
  } else {
    lines.push(`Annual fee: ${card.annualFee} INR`)
    lines.push(`Joining fee: ${card.joiningFee} INR`)
  }

  lines.push(`Forex markup: ${card.foreignTransactionFee}%`)
  lines.push(`Fuel surcharge waiver: ${card.fuelSurchargeWaiver ? 'yes' : 'no'}`)

  if (card.loungeAccess) {
    const dom = card.loungeAccess.domestic === 'unlimited' ? 'unlimited' : `${card.loungeAccess.domestic}/year`
    const intl = card.loungeAccess.international === 'unlimited' ? 'unlimited' : `${card.loungeAccess.international}/year`
    lines.push(`Lounge access: domestic ${dom}, international ${intl}`)
  } else {
    lines.push('Lounge access: none')
  }

  lines.push(`Min income: ${card.minIncome} INR`)
  lines.push(`Lifetime free: ${card.isLifetimeFree ? 'yes' : 'no'}`)

  if (card.rewardRules.length > 0) {
    const rules = card.rewardRules
      .slice(0, 6)
      .map((r) => `${r.category} ${r.ratePct}%${r.monthlyCap ? ` cap ${r.monthlyCap}` : ''}`)
      .join('; ')
    lines.push(`Accelerated rewards: ${rules}`)
  }

  if (card.exclusions.length > 0) {
    lines.push(`Excluded categories: ${card.exclusions.join(', ')}`)
  }

  if (card.benefits.length > 0) {
    lines.push(`Top benefits: ${card.benefits.slice(0, 5).join(' | ')}`)
  }

  if (card.welcomeBonus) {
    lines.push(`Welcome bonus: ${card.welcomeBonus}`)
  }

  return lines.join('\n')
}
