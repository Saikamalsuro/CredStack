import { inngest } from './client'
import { createAdminClient } from '@/lib/db/admin'
import { complete } from '@/lib/ai/groq'
import {
  buildStatementExtractPrompt,
  StatementExtractSchema,
  fallbackStatementExtract,
} from '@/lib/ai/prompts/statement-extract'
import {
  buildClassifyPrompt,
  ClassifyBatchSchema,
  fallbackClassifyBatch,
} from '@/lib/ai/prompts/transaction-classify'
import {
  buildInsightsPrompt,
  AnalyzerInsightsSchema,
  fallbackInsights,
} from '@/lib/ai/prompts/analyzer-insights'

async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  try {
    const { extractText, getDocumentProxy } = await import('unpdf')
    const doc = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(doc, { mergePages: true })
    return Array.isArray(text) ? text.join('\n') : text
  } catch (err) {
    console.warn('[parse-statement] unpdf failed, trying pdf-parse', err)
    try {
      const mod = await import('pdf-parse')
      const pdfParse = ((mod as unknown) as { default?: (b: Buffer) => Promise<{ text: string }> }).default ?? (mod as unknown as (b: Buffer) => Promise<{ text: string }>)
      const { text } = await pdfParse(Buffer.from(buffer))
      return text
    } catch (err2) {
      console.error('[parse-statement] both pdf parsers failed', err2)
      return ''
    }
  }
}

export const parseStatement = inngest.createFunction(
  {
    id: 'parse-statement',
    retries: 2,
    triggers: [{ event: 'analyzer.statement.uploaded' }],
  },
  async ({ event, step }) => {
    const { runId, filePath } = event.data

    const supabase = createAdminClient()

    await step.run('mark-parsing', async () => {
      await supabase
        .from('analyzer_runs')
        .update({ status: 'parsing' })
        .eq('id', runId)
    })

    const text = await step.run('download-and-extract', async () => {
      const { data, error } = await supabase.storage
        .from('statements')
        .download(filePath)
      if (error || !data) throw new Error(`storage download failed: ${error?.message}`)
      const buf = await data.arrayBuffer()
      return extractPdfText(buf)
    })

    if (!text) {
      await supabase
        .from('analyzer_runs')
        .update({ status: 'failed', error_message: 'PDF text extraction failed' })
        .eq('id', runId)
      return { success: false, reason: 'pdf-empty' }
    }

    const { data: extracted } = await complete({
      ...buildStatementExtractPrompt(text),
      schema: StatementExtractSchema,
      model: 'reasoning',
      fallback: fallbackStatementExtract,
    })

    await step.run('mark-classifying', async () => {
      await supabase
        .from('analyzer_runs')
        .update({
          status: 'classifying',
          statement_period_start: extracted.statementPeriodStart,
          statement_period_end: extracted.statementPeriodEnd,
        })
        .eq('id', runId)
    })

    const merchants = Array.from(new Set(extracted.transactions.map((t) => t.merchant)))
    const { data: classified } = await complete({
      ...buildClassifyPrompt(merchants),
      schema: ClassifyBatchSchema,
      model: 'fast',
      fallback: fallbackClassifyBatch,
    })

    const merchantMap = new Map(
      classified.classifications.map((c) => [c.merchant, c])
    )

    // Treat positive amounts as debits (spend) and negative amounts as
    // refunds/credits. Net category spend = debits - refunds so a fully refunded
    // category nets to zero. Both refunds and zero-value rows skip the spend
    // total but refunds still reduce category buckets so analytics stay honest.
    let totalSpend = 0
    const categorySpend: Record<string, number> = {}
    for (const t of extracted.transactions) {
      if (t.amount === 0) continue
      const cls = merchantMap.get(t.merchant)
      const cat = cls?.category ?? 'other'
      if (t.amount > 0) totalSpend += t.amount
      categorySpend[cat] = (categorySpend[cat] ?? 0) + t.amount
    }
    // Drop categories that net to ≤ 0 after refunds.
    for (const k of Object.keys(categorySpend)) {
      if (categorySpend[k] <= 0) delete categorySpend[k]
    }

    const totalSpendPaise = Math.round(totalSpend * 100)
    const totalRewardsPaise = 0 // Phase 2 follow-up: compute against user's card rules

    const categoryBreakdown = Object.entries(categorySpend).map(([category, spend]) => ({
      category,
      spend,
      rewards: 0,
      card: 'connected card',
      efficiency: 70,
    }))

    const { data: insights } = await complete({
      ...buildInsightsPrompt({
        totalSpend,
        totalRewards: 0,
        categoryBreakdown,
      }),
      schema: AnalyzerInsightsSchema,
      model: 'reasoning',
      fallback: fallbackInsights,
    })

    await supabase
      .from('analyzer_runs')
      .update({
        status: 'ready',
        completed_at: new Date().toISOString(),
        total_spend_paise: totalSpendPaise,
        total_rewards_paise: totalRewardsPaise,
        overall_score: 70,
        spending_efficiency: 70,
        rewards_optimization: 50,
        risk_score: 20,
        category_breakdown: categoryBreakdown,
        insights: insights.insights,
        risk_factors: [],
      })
      .eq('id', runId)

    return { success: true, transactions: extracted.transactions.length }
  }
)
