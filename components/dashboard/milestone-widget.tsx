"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import type { MilestoneProgress } from "@/lib/db/milestones"

export function MilestoneWidget({ milestones }: { milestones: MilestoneProgress[] }) {
  if (milestones.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Milestone tracker</CardTitle>
        </div>
        <CardDescription>Progress toward bonus rewards on your cards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.slice(0, 5).map((m, i) => {
          const tone =
            m.pct >= 100
              ? "bg-success"
              : m.pct >= 70
                ? "bg-primary"
                : m.pct >= 30
                  ? "bg-amber-500"
                  : "bg-muted-foreground/30"
          return (
            <div key={`${m.cardSlug}-${i}`} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-5 rounded shrink-0 bg-gradient-to-br ${m.cardColor}`} />
                <div className="flex-1 min-w-0">
                  <Link href={`/cards/${m.cardSlug}`} className="text-sm font-medium hover:underline truncate block">
                    {m.cardName}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1">{m.rewardDescription}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground capitalize">{m.period}</span>
                  <span className="font-medium">
                    ₹{m.currentSpend.toLocaleString("en-IN")} / ₹{m.spendThreshold.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${tone}`} style={{ width: `${m.pct}%` }} />
                </div>
                {m.pct >= 100 ? (
                  <p className="text-xs text-success mt-1">Milestone hit — reward incoming</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    ₹{m.remaining.toLocaleString("en-IN")} to go
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
