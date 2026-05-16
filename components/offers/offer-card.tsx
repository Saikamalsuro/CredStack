"use client"

import { useEffect, useState } from 'react'
import { ExternalLink, Calendar, ShieldCheck, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  OFFER_CATEGORY_LABELS,
  OFFER_TYPE_LABELS,
  type Offer,
} from '@/lib/types/offers'

function formatValue(o: Offer): string {
  if (o.valuePct && o.maxValue) return `${o.valuePct}% off · up to ₹${o.maxValue.toLocaleString()}`
  if (o.valuePct) return `${o.valuePct}% ${o.offerType === 'cashback' ? 'cashback' : 'off'}`
  if (o.valueFlat) return `Flat ₹${o.valueFlat.toLocaleString()} off`
  return OFFER_TYPE_LABELS[o.offerType]
}

function formatDate(iso: string | null): string {
  if (!iso) return 'Ongoing'
  const d = new Date(iso)
  return `Until ${d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
}

const FLASH_WINDOW_MS = 48 * 60 * 60 * 1000

function computeFlashState(endsAt: string | null, now: number): { flash: boolean; countdown: string | null } {
  if (!endsAt) return { flash: false, countdown: null }
  const ms = new Date(endsAt).getTime() - now
  const flash = ms > 0 && ms <= FLASH_WINDOW_MS
  if (!flash) return { flash: false, countdown: null }
  if (ms <= 0) return { flash, countdown: 'Ending now' }
  const hours = Math.floor(ms / 3600000)
  if (hours >= 24) return { flash, countdown: `${Math.floor(hours / 24)}d ${hours % 24}h left` }
  const minutes = Math.floor((ms % 3600000) / 60000)
  return { flash, countdown: `${hours}h ${minutes}m left` }
}

function confidenceColor(band: Offer['confidenceBand']): string {
  switch (band) {
    case 'verified':
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-300'
    case 'high':
      return 'bg-sky-500/10 text-sky-700 border-sky-200 dark:text-sky-300'
    case 'medium':
      return 'bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-300'
    case 'low':
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function OfferCard({ offer }: { offer: Offer }) {
  const [{ flash, countdown }, setState] = useState<{ flash: boolean; countdown: string | null }>(
    { flash: false, countdown: null }
  )
  useEffect(() => {
    const tick = () => setState(computeFlashState(offer.endsAt, Date.now()))
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [offer.endsAt])
  return (
    <Card className={`flex h-full flex-col ${flash ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {flash && countdown && (
            <Badge className="text-[10px] uppercase tracking-wide bg-amber-500/15 text-amber-700 border-amber-500/40 dark:text-amber-300">
              <Zap className="h-3 w-3 mr-1" />
              Flash · {countdown}
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {OFFER_CATEGORY_LABELS[offer.category]}
          </Badge>
          <Badge className={`text-[10px] uppercase tracking-wide ${confidenceColor(offer.confidenceBand)}`}>
            {offer.manuallyVerified ? (
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> verified
              </span>
            ) : (
              offer.confidenceBand
            )}
          </Badge>
        </div>
        <CardTitle className="text-base leading-snug line-clamp-2">{offer.title}</CardTitle>
        {offer.merchantName && (
          <p className="text-xs text-muted-foreground">{offer.merchantName}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3 text-sm">
        <div className="space-y-2">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400">{formatValue(offer)}</p>
          {offer.description && (
            <p className="text-xs text-muted-foreground line-clamp-3">{offer.description}</p>
          )}
          {offer.eligibleIssuers.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {offer.eligibleIssuers.slice(0, 3).map((iss) => (
                <Badge key={iss} variant="secondary" className="text-[10px]">
                  {iss}
                </Badge>
              ))}
              {offer.eligibleIssuers.length > 3 && (
                <Badge variant="secondary" className="text-[10px]">
                  +{offer.eligibleIssuers.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(offer.endsAt)}
            </span>
            {offer.minTxn ? <span>Min ₹{offer.minTxn.toLocaleString()}</span> : <span>No min</span>}
          </div>
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={offer.sourceUrl} target="_blank" rel="noreferrer">
              View source
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
