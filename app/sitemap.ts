import type { MetadataRoute } from "next"
import { getCards } from "@/lib/db/cards"
import { REWARD_PROGRAMS } from "@/lib/data/reward-programs"
import { ARTICLES } from "@/lib/data/academy"

const STATIC_PATHS = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/cards", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/compare", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/advisor", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/analyzer", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/optimizer", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/eligibility", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/offers", priority: 0.6, changeFrequency: "daily" as const },
  { path: "/methodology", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/banks", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/tools/interest-calculator", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/tools/emi-calculator", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/apply/documents", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/safety/helplines", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/safety/fraud-guide", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/safety/virtual-cards", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/safety/rbi-updates", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/tools/points-converter", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/first-credit-card", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/rewards", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/help", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/docs", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.3, changeFrequency: "monthly" as const },
  { path: "/press", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/blog", priority: 0.4, changeFrequency: "weekly" as const },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" as const },
]

// Card changelog pages are appended dynamically below per active card.
// /dashboard/* routes intentionally excluded from sitemap (auth-gated).

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }))

  let cardEntries: MetadataRoute.Sitemap = []
  try {
    const cards = await getCards()
    cardEntries = cards.flatMap((c) => [
      {
        url: `${base}/cards/${c.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${base}/cards/${c.id}/changes`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.4,
      },
    ])
  } catch {
    // If DB is unreachable at build time, sitemap still serves the static paths.
  }

  const programEntries: MetadataRoute.Sitemap = REWARD_PROGRAMS.map((p) => ({
    url: `${base}/learn/rewards/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const articleEntries: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/learn/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...cardEntries, ...programEntries, ...articleEntries]
}
