import type { Metadata } from "next"
import { Suspense } from "react"
import { getAllExtendedCards } from "@/lib/db/cards-extended"
import { computeNetAnnualValue, DEFAULT_PROFILE } from "@/lib/ai/scoring"
import { CompareClient } from "./compare-client"
import type { CreditCard } from "@/lib/data/cards"

export const metadata: Metadata = {
  title: "Compare credit cards side-by-side — CredStack",
  description: "Compare any two Indian credit cards on rewards, fees, lounge access, and net annual value.",
}

export const revalidate = 3600

export default async function ComparePage() {
  const extended = await getAllExtendedCards()

  const allCards: CreditCard[] = extended.map(({
    rewardRules: _rr,
    exclusions: _ex,
    milestones: _ms,
    insurance: _ins,
    pointValuePaise: _pvp,
    rewardExpiryMonths: _rem,
    rewardCappingMonthly: _rcm,
    annualFeeWaiverSpend: _afws,
    baseRewardRate: _brr,
    dataLastVerifiedAt: _dlva,
    mitcUrl: _mu,
    applyUrl: _au,
    isLifetimeFree: _ilf,
    ...card
  }) => card)

  const netValues: Record<string, number> = {}
  for (const card of extended) {
    netValues[card.id] = computeNetAnnualValue(card, DEFAULT_PROFILE).netAnnualValue
  }

  return (
    <Suspense>
      <CompareClient allCards={allCards} netValues={netValues} />
    </Suspense>
  )
}
