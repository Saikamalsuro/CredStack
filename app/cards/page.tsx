import { Suspense } from "react"
import { getCards } from "@/lib/supabase/cards"
import { CardsClient } from "./cards-client"

export default async function CardsPage() {
  const cards = await getCards()

  return (
    <Suspense>
      <CardsClient cards={cards} />
    </Suspense>
  )
}
