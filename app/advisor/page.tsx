import { getCards } from "@/lib/db/cards"
import { AdvisorClient } from "./advisor-client"

export const revalidate = 3600

export default async function AdvisorPage() {
  const allCards = await getCards()
  return <AdvisorClient allCards={allCards} />
}
