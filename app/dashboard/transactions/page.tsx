import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { listUserTransactions, getYearOverYearSpend } from "@/lib/db/transactions-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt, TrendingUp, FileText } from "lucide-react"
import { TransactionList } from "./transaction-list"
import { YearOverYear } from "./year-over-year"

export const metadata: Metadata = {
  title: "Transactions & analytics | CredStack",
  description: "Per-transaction view, re-classify categories, year-over-year spending analytics.",
}

export default async function TransactionsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/transactions")

  const [txns, yoy] = await Promise.all([
    listUserTransactions(user.id, 100),
    getYearOverYearSpend(user.id),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Receipt className="h-3.5 w-3.5" />
          Transactions
        </div>
        <h1 className="text-3xl font-bold mb-2">Spend profiler + analytics</h1>
        <p className="text-muted-foreground">
          Recent transactions with category re-classification. Month-over-month and year-over-year spend trends.
        </p>
      </div>

      {txns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium mb-2">No transactions yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Upload a credit card statement via the Analyzer to populate this page. Transactions get auto-categorised and shown here for review.
            </p>
            <Button asChild>
              <Link href="/analyzer">Upload statement</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Year-over-year</CardTitle>
              </div>
              <CardDescription>This year vs last year per month</CardDescription>
            </CardHeader>
            <CardContent>
              <YearOverYear thisYear={yoy.thisYear} lastYear={yoy.lastYear} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent transactions</CardTitle>
              <CardDescription>Re-classify any transaction the parser got wrong</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={txns} />
            </CardContent>
          </Card>
        </>
      )}

      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Reward audit (preview)</CardTitle>
          <CardDescription>
            What you earned vs what you could have earned, when transactions are populated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Once you upload statements via the Analyzer, this section shows missed-reward analysis: per-transaction comparison of the card you used vs the best card in your portfolio for that category.
          </p>
          <p>
            Coming next: per-statement "missed value" report and category-by-category coverage gaps.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
