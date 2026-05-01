import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCardsSection } from "@/components/home/featured-cards-section"
import { CategorySection } from "@/components/home/category-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCardsSection />
      <CategorySection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </>
  )
}
