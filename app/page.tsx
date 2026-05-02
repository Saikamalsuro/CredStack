import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCardsSection } from "@/components/home/featured-cards-section"
import { CategorySection } from "@/components/home/category-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"
import { getFeaturedCards, getPopularCards } from "@/lib/db/cards"

export const revalidate = 3600

export default async function HomePage() {
  const [featured, popular] = await Promise.all([
    getFeaturedCards(),
    getPopularCards(),
  ])

  return (
    <>
      <HeroSection floatingCards={featured.slice(0, 3)} />
      <FeaturedCardsSection popularCards={popular.slice(0, 6)} />
      <CategorySection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </>
  )
}
