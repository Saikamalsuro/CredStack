import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCardsSection } from "@/components/home/featured-cards-section"
import { CategorySection } from "@/components/home/category-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"
import { HomeUserBar } from "@/components/home/home-user-bar"
import { getFeaturedCards, getPopularCards } from "@/lib/db/cards"
import { getCurrentUser } from "@/lib/auth/helpers"

export default async function HomePage() {
  const [featured, popular, user] = await Promise.all([
    getFeaturedCards(),
    getPopularCards(),
    getCurrentUser(),
  ])

  const fullName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? null
  const email = user?.email ?? null

  return (
    <>
      {user && <HomeUserBar fullName={fullName} email={email} />}
      <HeroSection floatingCards={featured.slice(0, 3)} />
      <FeaturedCardsSection popularCards={popular.slice(0, 6)} />
      <CategorySection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </>
  )
}
