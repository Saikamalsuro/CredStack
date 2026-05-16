import { notFound } from "next/navigation"
import { getCardById, getCards } from "@/lib/db/cards"
import { getSimilarCards } from "@/lib/db/recommendations"
import { createPublicClient } from "@/lib/db/public-client"
import { createServerClient } from "@/lib/db/server"
import { getOffersByCardSlug } from "@/lib/db/offers"
import { isCardWishlisted } from "@/lib/db/wishlist"
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

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [similarCards, dataLastVerifiedAt, offers, wishlisted] = await Promise.all([
    getSimilarCards(id, 12),
    getVerificationDate(id),
    getOffersByCardSlug(id, 9),
    user ? isCardWishlisted(user.id, id) : Promise.resolve(false),
  ])

  return (
    <CardDetailsClient
      card={card}
      similarCards={similarCards}
      dataLastVerifiedAt={dataLastVerifiedAt}
      offers={offers}
      isWishlisted={wishlisted}
    />
  )
}
