import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCardsSection } from "@/components/home/featured-cards-section"
import { CategorySection } from "@/components/home/category-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"
import { getCards, getFeaturedCards, getPopularCards } from "@/lib/db/cards"
import { createPublicClient } from "@/lib/db/public-client"

export const revalidate = 3600

async function getLatestVerificationDate(): Promise<string | null> {
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from("cards")
      .select("data_last_verified_at")
      .eq("is_active", true)
      .not("data_last_verified_at", "is", null)
      .order("data_last_verified_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    return data?.data_last_verified_at ?? null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [featured, popular, allCards, lastVerifiedAt] = await Promise.all([
    getFeaturedCards(),
    getPopularCards(),
    getCards(),
    getLatestVerificationDate(),
  ])

  return (
    <>
      <HeroSection floatingCards={featured.slice(0, 3)} />
      <FeaturedCardsSection popularCards={popular.slice(0, 6)} />
      <CategorySection />
      <HowItWorksSection />
      <StatsSection cardCount={allCards.length} lastVerifiedAt={lastVerifiedAt} />
      <CTASection />
    </>
  )
}
