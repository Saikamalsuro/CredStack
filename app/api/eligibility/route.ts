import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCards } from '@/lib/db/cards'
import { createPublicClient } from '@/lib/db/public-client'

const RequestSchema = z.object({
  monthlyIncome: z.number().nonnegative(),
  age: z.number().int().min(18).max(80),
  creditScore: z.number().int().min(300).max(900).optional(),
  employmentType: z.enum(['salaried', 'self_employed', 'student', 'other']).optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { monthlyIncome, age, creditScore, employmentType } = parsed.data
  const annualIncome = monthlyIncome * 12

  const supabase = createPublicClient()
  const { data: rawCards, error } = await supabase
    .from('cards')
    .select('slug, name, issuer, min_income, min_age, max_age, min_credit_score, self_employed_eligible, annual_fee, card_color_gradient')
    .eq('is_active', true)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = (rawCards ?? []).map((c) => {
    const reasons: string[] = []
    let status: 'eligible' | 'borderline' | 'ineligible' = 'eligible'

    if (annualIncome < c.min_income) {
      const ratio = annualIncome / Math.max(c.min_income, 1)
      if (ratio >= 0.8) {
        status = 'borderline'
        reasons.push(`Income ₹${annualIncome.toLocaleString()} below min ₹${c.min_income.toLocaleString()} (within 20%)`)
      } else {
        status = 'ineligible'
        reasons.push(`Annual income ₹${annualIncome.toLocaleString()} below min ₹${c.min_income.toLocaleString()}`)
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

    return {
      slug: c.slug,
      name: c.name,
      issuer: c.issuer,
      annualFee: c.annual_fee,
      cardColor: c.card_color_gradient,
      status,
      reasons,
    }
  })

  results.sort((a, b) => {
    const order = { eligible: 0, borderline: 1, ineligible: 2 }
    return order[a.status] - order[b.status]
  })

  return NextResponse.json({ results })
}

export async function GET() {
  const cards = await getCards()
  return NextResponse.json({ totalCards: cards.length })
}
