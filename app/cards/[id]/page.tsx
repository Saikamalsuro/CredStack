import { notFound } from "next/navigation"
import { getCardById, getCards } from "@/lib/db/cards"
import { getSimilarCards } from "@/lib/db/recommendations"
import { createPublicClient } from "@/lib/db/public-client"
import { CardDetailsClient } from "./card-details-client"

interface CardDetailsPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 86400

export async function generateStaticParams() {
  const cards = await getCards()
  return cards.map((card) => ({ id: card.id }))
}

export async function generateMetadata({ params }: CardDetailsPageProps) {
  const { id } = await params
  const card = await getCardById(id)

  if (!card) {
    return { title: "Card Not Found | CredStack" }
  }

  return {
    title: `${card.name} - ${card.issuer} | CredStack`,
    description: `Compare ${card.name} features, rewards, benefits, and fees. ${card.rewards.description}. Annual fee: ${card.annualFee === 0 ? 'Free' : `₹${card.annualFee}`}.`,
  }
}

async function getVerificationDate(slug: string): Promise<string | null> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("cards")
    .select("data_last_verified_at")
    .eq("slug", slug)
    .maybeSingle()
  return data?.data_last_verified_at ?? null
}

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { id } = await params
  const card = await getCardById(id)

  if (!card) notFound()

  const [similarCards, dataLastVerifiedAt] = await Promise.all([
    getSimilarCards(id, 3),
    getVerificationDate(id),
  ])

  return (
    <CardDetailsClient
      card={card}
      similarCards={similarCards}
      dataLastVerifiedAt={dataLastVerifiedAt}
    />
  )
}
