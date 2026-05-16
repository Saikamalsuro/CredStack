"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
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
import { logLoungeVisitAction } from "./actions"

interface Props {
  cards: { id: string; label: string }[]
}

export function LoungeLogForm({ cards }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [userCardId, setUserCardId] = useState<string>(cards[0]?.id ?? "")
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [loungeName, setLoungeName] = useState<string>("")
  const [visitType, setVisitType] = useState<"domestic" | "international">("domestic")
  const [guestCount, setGuestCount] = useState<number>(0)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!userCardId || !loungeName.trim()) {
      setError("Pick a card and enter the lounge name.")
      return
    }
    startTransition(async () => {
      const result = await logLoungeVisitAction({
        userCardId,
        visitDate,
        loungeName: loungeName.trim(),
        visitType,
        guestCount,
      })
      if (result.error) {
        setError(result.error)
        return
      }
      setLoungeName("")
      setGuestCount(0)
      router.refresh()
    })
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="card">Card</Label>
        <Select value={userCardId} onValueChange={setUserCardId}>
          <SelectTrigger id="card">
            <SelectValue placeholder="Pick a card" />
          </SelectTrigger>
          <SelectContent>
            {cards.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="visit-date">Visit date</Label>
        <Input
          id="visit-date"
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="lounge">Lounge name</Label>
        <Input
          id="lounge"
          placeholder="e.g. Plaza Premium Lounge, BLR T2"
          value={loungeName}
          onChange={(e) => setLoungeName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={visitType}
          onValueChange={(v) => setVisitType(v as "domestic" | "international")}
        >
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Guests brought</Label>
        <Input
          id="guests"
          type="number"
          min={0}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
        />
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3">
        {error && <p className="text-sm text-destructive flex-1">{error}</p>}
        <Button type="submit" disabled={isPending} className="sm:ml-auto">
          {isPending ? "Logging..." : "Log visit"}
        </Button>
      </div>
    </form>
  )
}
