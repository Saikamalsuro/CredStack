"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { MonthlyAgg } from "@/lib/db/transactions-list"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function YearOverYear({
  thisYear,
  lastYear,
}: {
  thisYear: MonthlyAgg[]
  lastYear: MonthlyAgg[]
}) {
  const data = MONTH_NAMES.map((label, i) => {
    const monthKey = String(i + 1).padStart(2, "0")
    const ty = thisYear.find((t) => t.month.endsWith(`-${monthKey}`))
    const ly = lastYear.find((t) => t.month.endsWith(`-${monthKey}`))
    return {
      month: label,
      thisYear: ty?.spending ?? 0,
      lastYear: ly?.spending ?? 0,
    }
  })

  const ytdThisYear = data.reduce((s, d) => s + d.thisYear, 0)
  const ytdLastYear = data.reduce((s, d) => s + d.lastYear, 0)
  const diff = ytdThisYear - ytdLastYear
  const diffPct = ytdLastYear > 0 ? (diff / ytdLastYear) * 100 : 0

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
        <div className="p-3 rounded-md border">
          <p className="text-xs text-muted-foreground">YTD this year</p>
          <p className="text-lg font-bold">₹{ytdThisYear.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-3 rounded-md border">
          <p className="text-xs text-muted-foreground">YTD last year</p>
          <p className="text-lg font-bold">₹{ytdLastYear.toLocaleString("en-IN")}</p>
        </div>
        <div className="p-3 rounded-md border">
          <p className="text-xs text-muted-foreground">Change</p>
          <p
            className={`text-lg font-bold ${
              diff > 0 ? "text-destructive" : diff < 0 ? "text-success" : ""
            }`}
          >
            {diff >= 0 ? "+" : ""}
            ₹{diff.toLocaleString("en-IN")} ({diffPct >= 0 ? "+" : ""}
            {diffPct.toFixed(1)}%)
          </p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="thisYear" name="This year" fill="hsl(var(--primary))" />
            <Bar dataKey="lastYear" name="Last year" fill="hsl(var(--muted-foreground))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
