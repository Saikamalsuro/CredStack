import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/helpers'
import { getAnalyzerRun } from '@/lib/db/analyzer-runs'

export async function GET(request: Request) {
  const user = await requireAuth('/auth/sign-in')
  const url = new URL(request.url)
  const runId = url.searchParams.get('runId')
  if (!runId) return NextResponse.json({ error: 'runId required' }, { status: 400 })

  const run = await getAnalyzerRun(user.id, runId)
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (run.status !== 'ready') {
    return NextResponse.json({ status: run.status, runId })
  }

  // Phase 1 demo-shape compatible payload
  return NextResponse.json({
    status: 'ready',
    runId,
    overallScore: run.overall_score,
    spendingEfficiency: run.spending_efficiency,
    rewardsOptimization: run.rewards_optimization,
    riskScore: run.risk_score,
    monthlySpend: Math.round((run.total_spend_paise ?? 0) / 100),
    monthlyRewards: Math.round((run.total_rewards_paise ?? 0) / 100),
    potentialSavings: 0,
    insights: run.insights ?? [],
    categoryBreakdown: run.category_breakdown ?? [],
    riskFactors: run.risk_factors ?? [],
  })
}
