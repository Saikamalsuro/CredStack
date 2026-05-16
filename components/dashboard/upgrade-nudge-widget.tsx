"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp } from "lucide-react"
import type { UpgradeNudge } from "@/lib/db/upgrade-nudge"

export function UpgradeNudgeWidget({ nudges }: { nudges: UpgradeNudge[] }) {
  if (nudges.length === 0) return null

  return (
    <Card className="bg-primary/5 border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Upgrade nudges</CardTitle>
        </div>
        <CardDescription>Cards in your tier with higher reward rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nudges.map((n, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-md border text-sm">
            <div className={`w-10 h-6 rounded shrink-0 bg-gradient-to-br ${n.fromColor}`} />
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className={`w-10 h-6 rounded shrink-0 bg-gradient-to-br ${n.toColor}`} />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                Switch {n.fromName} → {n.toName}
              </p>
              <p className="text-xs text-muted-foreground">
                +{(n.toBaseRate - n.fromBaseRate).toFixed(1)}% → ~₹
                {n.estimatedAnnualGain.toLocaleString("en-IN")}/year extra
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/cards/${n.toSlug}`}>View</Link>
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Estimates assume ₹30K/month base-rate spend. Not a substitute for the AI Advisor for your actual profile.
        </p>
      </CardContent>
    </Card>
  )
}
