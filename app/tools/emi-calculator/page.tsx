import type { Metadata } from "next"
import { getCards } from "@/lib/db/cards"
import { EMICalculatorClient } from "./emi-calculator-client"

export const metadata: Metadata = {
  title: "Credit Card EMI Calculator — No-Cost vs Interest EMI | CredStack",
  description:
    "Compare no-cost EMI and interest-bearing EMI on Indian credit cards. See effective interest after processing fees and the real total cost.",
}

export const revalidate = 86400

export default async function EMICalculatorPage() {
  const cards = await getCards()
  const cardChoices = cards.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    aprMonthlyPct: c.interestRate.max,
  }))
  return <EMICalculatorClient cards={cardChoices} />
}
