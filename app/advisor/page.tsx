import type { Metadata } from "next"
import { getCards } from "@/lib/db/cards"
import { AdvisorClient } from "./advisor-client"

export const metadata: Metadata = {
  title: "AI Advisor — CredStack",
  description: "Tell us how you spend; the AI Advisor picks the card that earns you the most.",
}

export const revalidate = 3600

export default async function AdvisorPage() {
  const allCards = await getCards()
  return <AdvisorClient allCards={allCards} />
}
