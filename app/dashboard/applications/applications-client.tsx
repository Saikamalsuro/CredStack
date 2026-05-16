"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Trash2, PlusCircle } from "lucide-react"
import type { ApplicationEntry, ApplicationStatus } from "@/lib/db/applications"
import {
  createApplicationAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
} from "./actions"

const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "under_review",
  "approved",
  "rejected",
  "received",
]

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  received: "Received",
}

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  applied: "bg-muted text-muted-foreground",
  under_review: "bg-amber-500/15 text-amber-700",
  approved: "bg-emerald-500/15 text-emerald-700",
  rejected: "bg-destructive/15 text-destructive",
  received: "bg-primary/15 text-primary",
}

function daysSince(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000))
  if (days === 0) return "Today"
  if (days === 1) return "1 day ago"
  return `${days} days ago`
}

interface Props {
  initial: ApplicationEntry[]
  cards: { slug: string; name: string; issuer: string }[]
}

export function ApplicationsClient({ initial, cards }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [cardSlug, setCardSlug] = useState(cards[0]?.slug ?? "")
  const [appliedDate, setAppliedDate] = useState(new Date().toISOString().slice(0, 10))
  const [referenceNumber, setReferenceNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await createApplicationAction({
        cardSlug,
        appliedDate,
        referenceNumber: referenceNumber || undefined,
        notes: notes || undefined,
      })
      if (res.error) {
        setError(res.error)
        return
      }
      setReferenceNumber("")
      setNotes("")
      setShowForm(false)
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{initial.length} application{initial.length === 1 ? "" : "s"}</p>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? "outline" : "default"}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Log application"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="card">Card</Label>
                <Select value={cardSlug} onValueChange={setCardSlug}>
                  <SelectTrigger id="card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name} — {c.issuer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Application date</Label>
                <Input
                  id="date"
                  type="date"
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref">Reference / app number (optional)</Label>
                <Input
                  id="ref"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATUS_ORDER.map((status) => {
          const items = initial.filter((a) => a.status === status)
          return (
            <Card key={status} className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded ${STATUS_COLOR[status]}`}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">{items.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
                {items.map((a) => (
                  <div key={a.id} className="p-3 bg-card border rounded-md text-sm">
                    <div className="flex items-start gap-2 mb-1">
                      <div className={`w-8 h-5 rounded shrink-0 bg-gradient-to-br ${a.cardColor}`} />
                      <Link href={`/cards/${a.cardSlug}`} className="font-medium hover:underline truncate flex-1 leading-tight">
                        {a.cardName}
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{daysSince(a.appliedDate)}</p>
                    {a.referenceNumber && (
                      <p className="text-xs text-muted-foreground font-mono mb-2">Ref: {a.referenceNumber}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Select
                        value={a.status}
                        onValueChange={(v) =>
                          startTransition(async () => {
                            await updateApplicationStatusAction(a.id, v as ApplicationStatus)
                            router.refresh()
                          })
                        }
                      >
                        <SelectTrigger className="h-7 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_ORDER.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          startTransition(async () => {
                            await deleteApplicationAction(a.id)
                            router.refresh()
                          })
                        }
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
