"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Award } from "lucide-react"
import type { RedemptionValues } from "@/lib/data/reward-redemption"

const REDEMPTION_LABELS = {
  statementCredit: "Statement credit",
  voucher: "Voucher / gift card",
  airlineMiles: "Airline miles",
  hotelPoints: "Hotel points",
  smartBuyOrPartner: "SmartBuy / partner site",
  productCatalogue: "Product catalogue",
} as const

function rupee(paise: number): string {
  const rupees = paise / 100
  return `₹${rupees.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
}

export function PointsConverterClient({ cards }: { cards: RedemptionValues[] }) {
  const [cardId, setCardId] = useState<string>(cards[0]?.cardId ?? "")
  const [points, setPoints] = useState<number>(10000)

  const card = useMemo(() => cards.find((c) => c.cardId === cardId), [cards, cardId])

  const computed = useMemo(() => {
    if (!card) return []
    return (Object.keys(card.values) as Array<keyof typeof card.values>).map((key) => ({
      key,
      label: REDEMPTION_LABELS[key],
      paisePerPoint: card.values[key],
      total: points * card.values[key],
    }))
  }, [card, points])

  const best = useMemo(() => computed.filter((c) => c.paisePerPoint > 0).sort((a, b) => b.total - a.total)[0], [computed])
  const worst = useMemo(() => computed.filter((c) => c.paisePerPoint > 0).sort((a, b) => a.total - b.total)[0], [computed])
  const spread = best && worst ? best.total - worst.total : 0

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Coins className="h-3.5 w-3.5" />
          Free tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Reward points value calculator</h1>
        <p className="text-muted-foreground">
          Same points, very different value depending on how you redeem. See the real worth of your balance across redemption options.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Your balance</CardTitle>
            <CardDescription>Pick card + enter points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="card">Card</Label>
              <Select value={cardId} onValueChange={setCardId}>
                <SelectTrigger id="card">
                  <SelectValue placeholder="Pick a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((c) => (
                    <SelectItem key={c.cardId} value={c.cardId}>
                      {c.cardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {card && (
                <p className="text-xs text-muted-foreground">Program: {card.programName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points balance</Label>
              <Input
                id="points"
                type="number"
                min={0}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>

            {card?.notes && (
              <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 border">
                <p className="font-medium text-foreground mb-1">Note</p>
                <p>{card.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {best && spread > 0 && (
            <Card className="bg-success/5 border-success/30">
              <CardContent className="pt-6 flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Best redemption: <span className="text-success">{best.label}</span> — {rupee(best.total)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    That&apos;s {rupee(spread)} more than the worst option ({worst?.label}). Same points, different choice.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All redemption options</CardTitle>
              <CardDescription>Sorted by value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...computed]
                  .sort((a, b) => b.total - a.total)
                  .map((c, i) => {
                    const isBest = i === 0 && c.paisePerPoint > 0
                    const available = c.paisePerPoint > 0
                    return (
                      <div
                        key={c.key}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                          isBest ? "border-success/50 bg-success/5" : available ? "" : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isBest && <Award className="h-4 w-4 text-success shrink-0" />}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{c.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {available ? `${(c.paisePerPoint / 100).toFixed(2)} / point` : "Not available"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-lg">{available ? rupee(c.total) : "—"}</p>
                          {isBest && <Badge variant="outline" className="text-xs">Best</Badge>}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How redemption types differ</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• <strong className="text-foreground">Statement credit</strong> is usually the lowest value but the most flexible — applies to your outstanding bill.</p>
              <p>• <strong className="text-foreground">Vouchers</strong> (Amazon, Flipkart, BookMyShow) typically beat statement credit by 1.5–2×.</p>
              <p>• <strong className="text-foreground">Airline miles & hotel points</strong> via 1:1 transfers can return 3–5× statement credit, but require travel use.</p>
              <p>• <strong className="text-foreground">SmartBuy / partner sites</strong> (HDFC SmartBuy, ICICI Mall) often offer the best on-demand value for flights and electronics.</p>
              <p>• <strong className="text-foreground">Product catalogue</strong> tends to be the weakest — banks price merchandise above retail then discount with points.</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              {card ? <Link href={`/cards/${card.cardId}`}>View card details →</Link> : <span />}
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools/interest-calculator">Interest calculator</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
