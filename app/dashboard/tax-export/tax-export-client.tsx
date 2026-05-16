"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileText, IndianRupee, BarChart3 } from "lucide-react"
import type { TaxYearReport } from "@/lib/db/tax-export"
import { toCsv } from "@/lib/db/tax-export"

interface Props {
  report: TaxYearReport
  fyStartYear: number
  fyOptions: number[]
}

function rupee(v: number): string {
  return `₹${v.toLocaleString("en-IN")}`
}

export function TaxExportClient({ report, fyStartYear, fyOptions }: Props) {
  const router = useRouter()
  const fyLabel = `FY ${fyStartYear}-${(fyStartYear + 1).toString().slice(-2)}`

  const csv = useMemo(() => toCsv(report), [report])

  function download(format: "csv" | "json") {
    const blob =
      format === "csv"
        ? new Blob([csv], { type: "text/csv;charset=utf-8" })
        : new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `credstack-tax-${fyStartYear}-${fyStartYear + 1}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const empty = report.transactions.length === 0

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <FileText className="h-3.5 w-3.5" />
          Tax export
        </div>
        <h1 className="text-3xl font-bold mb-2">Annual summary — {fyLabel}</h1>
        <p className="text-muted-foreground">
          ITR-ready summary of your credit card spending. Indian FY runs April – March.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Pick financial year</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={String(fyStartYear)}
            onValueChange={(v) => router.push(`/dashboard/tax-export?fy=${v}`)}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fyOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  FY {y}-{(y + 1).toString().slice(-2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5" />
              Total spend
            </CardDescription>
            <CardTitle className="text-2xl">{rupee(report.totalSpend)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rewards earned</CardDescription>
            <CardTitle className="text-2xl">{rupee(report.totalRewards)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Forex spend</CardDescription>
            <CardTitle className="text-2xl">{rupee(report.forexSpend)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {empty ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium mb-1">No transactions for {fyLabel}</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload a statement via the Analyzer to populate transactions. The export becomes available the moment data lands in your account.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/analyzer">Open Analyzer</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Spend by category</CardTitle>
              <CardDescription>Aggregated for the financial year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.byCategory.map((c) => {
                  const pct = report.totalSpend > 0 ? (c.total / report.totalSpend) * 100 : 0
                  return (
                    <div key={c.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{c.category.replace(/_/g, " ")}</span>
                        <span className="text-muted-foreground">
                          {rupee(c.total)} <span className="text-xs">({c.count} txn)</span>
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Download</CardTitle>
              <CardDescription>Use the CSV in spreadsheets / ITR utilities. JSON for archival.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => download("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button variant="outline" onClick={() => download("json")}>
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">What to use this for</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Cross-reference card spending against ITR Schedule deductions (medical, travel, charity).</p>
          <p>• Foreign currency spend can be flagged for ITR Schedule FA / FSI if applicable.</p>
          <p>• Rewards earned on credit cards aren&apos;t generally taxable, but consult a CA for cashback above ₹50K/year.</p>
          <p>• The exported file is generated client-side; nothing leaves your browser.</p>
        </CardContent>
      </Card>
    </div>
  )
}
