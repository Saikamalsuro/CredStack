import { notFound } from "next/navigation"
import { getCardById, getCards } from "@/lib/db/cards"
import { getSimilarCards } from "@/lib/db/recommendations"
import { createPublicClient } from "@/lib/db/public-client"
import { createServerClient } from "@/lib/db/server"
import { getOffersByCardSlug } from "@/lib/db/offers"
import { isCardWishlisted } from "@/lib/db/wishlist"
import { getCardReviewSummary, getCardReviews, getExpertReviews, REVIEW_GATE } from "@/lib/db/reviews"
import { CardDetailsClient } from "./card-details-client"
import { ReviewsSection } from "./reviews-section"

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

  const [similarCards, dataLastVerifiedAt, offers, wishlisted, dbCard] = await Promise.all([
    getSimilarCards(id, 12),
    getVerificationDate(id),
    getOffersByCardSlug(id, 9),
    user ? isCardWishlisted(user.id, id) : Promise.resolve(false),
    (async () => {
      const supabase = createPublicClient()
      const { data } = await supabase.from("cards").select("id").eq("slug", id).maybeSingle()
      return data
    })(),
  ])

  const [reviewSummary, reviews, expertReviews] = dbCard
    ? await Promise.all([
        getCardReviewSummary(dbCard.id),
        getCardReviews(dbCard.id, 20),
        getExpertReviews(dbCard.id),
      ])
    : [{ count: 0, average: 0, distribution: [] }, [], []]

  return (
    <>
      <CardDetailsClient
        card={card}
        similarCards={similarCards}
        dataLastVerifiedAt={dataLastVerifiedAt}
        offers={offers}
        isWishlisted={wishlisted}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <ReviewsSection
          cardSlug={card.id}
          cardName={card.name}
          summary={reviewSummary}
          reviews={reviews}
          expertReviews={expertReviews}
          isAuthed={Boolean(user)}
          reviewGate={REVIEW_GATE}
        />
      </div>
    </>
  )
}
