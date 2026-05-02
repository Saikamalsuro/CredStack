import { notFound } from "next/navigation"
import { getCardById, getCards } from "@/lib/db/cards"
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

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { id } = await params
  const card = await getCardById(id)

  if (!card) {
    notFound()
  }

  const all = await getCards()
  const similarCards = all
    .filter((c) => c.id !== card.id && c.category.some((cat) => card.category.includes(cat)))
    .slice(0, 3)

  return <CardDetailsClient card={card} similarCards={similarCards} />
}
