import type { Metadata } from "next"
import { Suspense } from "react"
import { getCards } from "@/lib/db/cards"
import { CardsClient } from "./cards-client"

export const metadata: Metadata = {
  title: "Browse credit cards",
  description: "Filter and sort 80+ Indian credit cards by rewards, fees, lounge access, and category.",
}

export default async function CardsPage() {
  const cards = await getCards()

  return (
    <Suspense>
      <CardsClient cards={cards} />
    </Suspense>
  )
}
