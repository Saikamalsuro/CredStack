import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCards } from '@/lib/db/cards'
import { createPublicClient } from '@/lib/db/public-client'
import { withPublicRateLimit } from '@/lib/cache/public-rate-limit'

const RequestSchema = z.object({
  monthlyIncome: z.number().nonnegative(),
  age: z.number().int().min(18).max(80),
  creditScore: z.number().int().min(300).max(900).optional(),
  employmentType: z.enum(['salaried', 'self_employed', 'student', 'other']).optional(),
  existingCards: z.number().int().min(0).max(50).optional(),
  cityTier: z.enum(['tier_1', 'tier_2', 'tier_3']).optional(),
})

type Band = 'high' | 'medium' | 'low'

interface ApprovalOdds {
  score: number
  band: Band
  helped: string[]
  hurt: string[]
}

interface ResultRow {
  slug: string
  name: string
  issuer: string
  annualFee: number
  cardColor: string
  status: 'eligible' | 'borderline' | 'ineligible'
  reasons: string[]
  approvalOdds: ApprovalOdds
}

function bandFromScore(score: number): Band {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export async function POST(request: Request) {
  const rl = await withPublicRateLimit(request, 'eligibility', 20, '1 m')
  if (rl) return rl
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { monthlyIncome, age, creditScore, employmentType, existingCards, cityTier } = parsed.data
  const annualIncome = monthlyIncome * 12

  const supabase = createPublicClient()
  const { data: rawCards, error } = await supabase
    .from('cards')
    .select(
      'slug, name, issuer, min_income, min_age, max_age, min_credit_score, self_employed_eligible, annual_fee, card_color_gradient'
    )
    .eq('is_active', true)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results: ResultRow[] = (rawCards ?? []).map((c) => {
    const reasons: string[] = []
    let status: ResultRow['status'] = 'eligible'

    if (annualIncome < c.min_income) {
      const ratio = annualIncome / Math.max(c.min_income, 1)
      if (ratio >= 0.8) {
        status = 'borderline'
        reasons.push(
          `Income ₹${annualIncome.toLocaleString()} below min ₹${c.min_income.toLocaleString()} (within 20%)`
        )
      } else {
        status = 'ineligible'
        reasons.push(
          `Annual income ₹${annualIncome.toLocaleString()} below min ₹${c.min_income.toLocaleString()}`
        )
      }
    }

    if (c.min_age != null && age < c.min_age) {
      status = 'ineligible'
      reasons.push(`Age ${age} below min ${c.min_age}`)
    }
    if (c.max_age != null && age > c.max_age) {
      status = 'ineligible'
      reasons.push(`Age ${age} above max ${c.max_age}`)
    }

    if (creditScore != null && c.min_credit_score != null && creditScore < c.min_credit_score) {
      const diff = c.min_credit_score - creditScore
      if (diff <= 30) {
        if (status === 'eligible') status = 'borderline'
        reasons.push(`Credit score ${creditScore} just under ${c.min_credit_score}`)
      } else {
        status = 'ineligible'
        reasons.push(`Credit score ${creditScore} below min ${c.min_credit_score}`)
      }
    }

    if (employmentType === 'self_employed' && c.self_employed_eligible === false) {
      status = 'ineligible'
      reasons.push('Card requires salaried employment')
    }

    if (status === 'eligible') reasons.push('All checks passed')

    // -----------------------------------------------------------------
    // Approval odds — rule-based composite score
    // -----------------------------------------------------------------
    const helped: string[] = []
    const hurt: string[] = []
    let score = 0

    // 1) Income vs min (40 weight)
    if (status === 'ineligible' && reasons.some((r) => r.toLowerCase().includes('income'))) {
      hurt.push('Annual income is below this card\'s minimum')
    } else if (c.min_income > 0) {
      const ratio = annualIncome / c.min_income
      if (ratio >= 2) {
        score += 40
        helped.push(`Income is 2× the minimum (strong signal)`)
      } else if (ratio >= 1.5) {
        score += 32
        helped.push('Income comfortably above minimum')
      } else if (ratio >= 1) {
        score += 22
        helped.push('Income meets the minimum')
      } else if (ratio >= 0.8) {
        score += 8
        hurt.push('Income within 20% of the minimum — borderline')
      }
    } else {
      score += 30
    }

    // 2) Existing cards (20 weight)
    if (existingCards == null) {
      score += 10 // unknown — neutral half-credit
    } else if (existingCards === 0) {
      score += 8
      hurt.push('No existing credit history makes premium approvals harder')
    } else if (existingCards <= 4) {
      score += 20
      helped.push(`${existingCards} existing card${existingCards === 1 ? '' : 's'} = active credit history`)
    } else {
      score += 6
      hurt.push(`${existingCards} existing cards — issuer may worry about over-extension`)
    }

    // 3) Employment type (15 weight)
    if (employmentType === 'salaried') {
      score += 15
      helped.push('Salaried employment is the strongest signal for most issuers')
    } else if (employmentType === 'self_employed') {
      score += 9
      if (c.self_employed_eligible === false) {
        hurt.push('Card prefers salaried applicants')
      }
    } else if (employmentType === 'student') {
      score += 4
      hurt.push('Most premium cards expect income proof')
    } else {
      score += 6
    }

    // 4) CIBIL band (15 weight)
    if (creditScore == null) {
      score += 8 // unknown — partial credit
    } else if (creditScore >= 780) {
      score += 15
      helped.push(`Excellent CIBIL score (${creditScore})`)
    } else if (creditScore >= 720) {
      score += 12
      helped.push(`Strong CIBIL score (${creditScore})`)
    } else if (creditScore >= 680) {
      score += 7
    } else {
      score += 2
      hurt.push(`CIBIL score ${creditScore} is below issuer comfort zone`)
    }

    // 5) City tier (10 weight)
    if (cityTier === 'tier_1') {
      score += 10
      helped.push('Tier 1 city historically has higher approval rates')
    } else if (cityTier === 'tier_2') {
      score += 6
    } else if (cityTier === 'tier_3') {
      score += 3
    } else {
      score += 5
    }

    // Cap and floor based on hard status
    if (status === 'ineligible') {
      score = Math.min(score, 15)
    }
    score = Math.max(0, Math.min(100, score))

    return {
      slug: c.slug,
      name: c.name,
      issuer: c.issuer,
      annualFee: c.annual_fee,
      cardColor: c.card_color_gradient,
      status,
      reasons,
      approvalOdds: {
        score,
        band: bandFromScore(score),
        helped: helped.slice(0, 4),
        hurt: hurt.slice(0, 4),
      },
    }
  })

  results.sort((a, b) => {
    const statusOrder = { eligible: 0, borderline: 1, ineligible: 2 }
    const ds = statusOrder[a.status] - statusOrder[b.status]
    if (ds !== 0) return ds
    return b.approvalOdds.score - a.approvalOdds.score
  })

  return NextResponse.json({ results })
}

export async function GET() {
  const cards = await getCards()
  return NextResponse.json({ totalCards: cards.length })
}
