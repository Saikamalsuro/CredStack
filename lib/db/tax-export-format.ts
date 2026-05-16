/**
 * Client-safe CSV formatter for tax export. Split from tax-export.ts so
 * Client Components can import without dragging in next/headers.
 */

import type { TaxYearReport } from './tax-export-types'

export function toCsv(report: TaxYearReport): string {
  const lines: string[] = []
  lines.push(`Financial Year,${report.fyStart} to ${report.fyEnd}`)
  lines.push('')
  lines.push(`Total spend (₹),${report.totalSpend}`)
  lines.push(`Total rewards (₹),${report.totalRewards}`)
  lines.push(`Forex spend (₹),${report.forexSpend}`)
  lines.push('')
  lines.push('Category,Transactions,Total (₹)')
  for (const c of report.byCategory) {
    lines.push(`${c.category},${c.count},${c.total}`)
  }
  lines.push('')
  lines.push('Date,Card,Merchant,Category,Amount (₹)')
  for (const t of report.transactions) {
    const m = t.merchant.replace(/[,"\n]/g, ' ').trim()
    const c = t.cardName.replace(/[,"\n]/g, ' ').trim()
    lines.push(`${t.date},${c},${m},${t.category},${t.amount}`)
  }
  return lines.join('\n')
}
