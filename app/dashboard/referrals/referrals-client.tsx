"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, PlusCircle, CheckCircle, Gift } from "lucide-react"
import type { ReferralEntry } from "@/lib/db/referrals"
import {
  createReferralAction,
  markReferralCreditedAction,
  deleteReferralAction,
} from "./actions"

interface Props {
  initial: ReferralEntry[]
  cards: { slug: string; name: string }[]
}

function rupee(v: number): string {
  return `₹${v.toLocaleString("en-IN")}`
}

export function ReferralsClient({ initial, cards }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [show, setShow] = useState(false)
  const [cardSlug, setCardSlug] = useState<string>(cards[0]?.slug ?? "")
  const [name, setName] = useState("")
  const [bonus, setBonus] = useState<number>(0)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  const totals = useMemo(() => {
    const pending = initial.filter((r) => r.status === "pending")
    const credited = initial.filter((r) => r.status === "credited")
    return {
      pending: pending.length,
      credited: credited.length,
      pendingValue: pending.reduce((s, r) => s + r.expectedBonus, 0),
      creditedValue: credited.reduce((s, r) => s + r.expectedBonus, 0),
    }
  }, [initial])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError("Referred name is required")
      return
    }
    startTransition(async () => {
      const res = await createReferralAction({
        cardSlug,
        referredName: name.trim(),
        expectedBonus: bonus,
        referredDate: date,
        notes: notes || undefined,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      setName("")
      setBonus(0)
      setNotes("")
      setShow(false)
      router.refresh()
    })
  }

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total referrals</CardDescription>
            <CardTitle className="text-2xl">{initial.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending bonus</CardDescription>
            <CardTitle className="text-2xl">{rupee(totals.pendingValue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Credited bonus</CardDescription>
            <CardTitle className="text-2xl text-success">{rupee(totals.creditedValue)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShow((s) => !s)} variant={show ? "outline" : "default"}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {show ? "Cancel" : "Log referral"}
        </Button>
      </div>

      {show && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Referred person</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card</Label>
                <Select value={cardSlug} onValueChange={setCardSlug}>
                  <SelectTrigger id="card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonus">Expected bonus (₹)</Label>
                <Input
                  id="bonus"
                  type="number"
                  min={0}
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Referred date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={isPending} className="ml-auto">
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {initial.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No referrals logged yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {initial.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.referredName}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.cardName ?? "Card unset"} · {r.referredDate} · {rupee(r.expectedBonus)}
                  </p>
                  {r.notes && <p className="text-xs text-muted-foreground italic mt-1">&quot;{r.notes}&quot;</p>}
                </div>
                <Badge
                  variant={r.status === "credited" ? "default" : "outline"}
                  className={r.status === "credited" ? "bg-success/15 text-success border-success/40" : ""}
                >
                  {r.status}
                </Badge>
                {r.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Mark credited"
                    onClick={() =>
                      startTransition(async () => {
                        await markReferralCreditedAction(r.id)
                        router.refresh()
                      })
                    }
                  >
                    <CheckCircle className="h-4 w-4 text-success" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteReferralAction(r.id)
                      router.refresh()
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
