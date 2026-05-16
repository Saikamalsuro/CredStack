import type { Metadata } from "next"
import { getCards } from "@/lib/db/cards"
import { InterestCalculatorClient } from "./interest-calculator-client"

export const metadata: Metadata = {
  title: "Credit Card Interest Calculator | CredStack",
  description:
    "See how much you'll pay in interest if you carry a balance on your credit card. Project month-by-month payoff for any Indian credit card.",
}

export const revalidate = 86400

export default async function InterestCalculatorPage() {
  const cards = await getCards()
  const cardChoices = cards.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    aprMonthlyPct: c.interestRate.max,
  }))
  return <InterestCalculatorClient cards={cardChoices} />
}
