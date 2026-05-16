import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers — CredStack",
  description: "Work on CredStack.",
}

export default function CareersPage() {
  return (
    <StaticPageShell
      eyebrow="Careers"
      title="Build CredStack with us"
      description="Small team, real users, fast iteration. We don't have open roles right now — that may change soon."
    >
      <h2>How we work</h2>
      <ul>
        <li>Remote-first, India-based. We meet in Bengaluru once a quarter.</li>
        <li>Async by default. Async docs over sync calls.</li>
        <li>Ship small, ship often. Production deploys are routine, not events.</li>
        <li>Engineering owns design and product calls. No hand-offs.</li>
      </ul>

      <h2>What we look for</h2>
      <ul>
        <li>Strong fundamentals over framework familiarity.</li>
        <li>Comfort with ambiguity. The roadmap shifts every quarter.</li>
        <li>Bias for the boring tools that work — Postgres, server actions, plain TypeScript.</li>
        <li>Curiosity about Indian credit, banking, and fintech specifically.</li>
      </ul>

      <h2>Roles we'll probably open</h2>
      <ul>
        <li>Senior full-stack engineer (Next.js + Postgres)</li>
        <li>Data engineer (offers ingestion, statement parsing)</li>
        <li>Product designer (web + email)</li>
      </ul>

      <p>None of these are open today. If any feel like you, send a note now — we keep a queue.</p>

      <div className="not-prose mt-8">
        <Button asChild>
          <a href="mailto:careers@credstack.com">
            <Briefcase className="h-4 w-4 mr-2" />
            careers@credstack.com
          </a>
        </Button>
      </div>
    </StaticPageShell>
  )
}
