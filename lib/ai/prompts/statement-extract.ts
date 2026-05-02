import { z } from 'zod'

export const StatementTransactionSchema = z.object({
  date: z.string(),
  merchant: z.string(),
  amount: z.number(),
  raw: z.string().optional(),
})

export const StatementExtractSchema = z.object({
  transactions: z.array(StatementTransactionSchema),
  statementPeriodStart: z.string().nullable(),
  statementPeriodEnd: z.string().nullable(),
})

export type StatementExtract = z.infer<typeof StatementExtractSchema>

export function buildStatementExtractPrompt(text: string) {
  const system = `You are a credit card statement parser. Extract every transaction line into structured JSON. Skip running balances, summary blocks, and headers. Dates as YYYY-MM-DD. Amounts as positive numbers in rupees (debits). Skip credits/refunds (mark amount negative if a clear refund). Strip any card numbers — only the last four digits should remain in raw if present. Return: { transactions: [{ date, merchant, amount, raw }], statementPeriodStart, statementPeriodEnd }.`
  const user = text.slice(0, 60000)
  return { system, user }
}

export const fallbackStatementExtract: StatementExtract = {
  transactions: [],
  statementPeriodStart: null,
  statementPeriodEnd: null,
}
