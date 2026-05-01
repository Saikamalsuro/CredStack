import { notFound } from "next/navigation"
import { getCardById, creditCards } from "@/lib/data/cards"
import { CardDetailsClient } from "./card-details-client"

interface CardDetailsPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return creditCards.map((card) => ({
    id: card.id,
  }))
}

export async function generateMetadata({ params }: CardDetailsPageProps) {
  const { id } = await params
  const card = getCardById(id)
  
  if (!card) {
    return {
      title: "Card Not Found | CredStack",
    }
  }

  return {
    title: `${card.name} - ${card.issuer} | CredStack`,
    description: `Compare ${card.name} features, rewards, benefits, and fees. ${card.rewards.description}. Annual fee: ${card.annualFee === 0 ? 'Free' : `₹${card.annualFee}`}.`,
  }
}

export default async function CardDetailsPage({ params }: CardDetailsPageProps) {
  const { id } = await params
  const card = getCardById(id)

  if (!card) {
    notFound()
  }

  return <CardDetailsClient card={card} />
}
