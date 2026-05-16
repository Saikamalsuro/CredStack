import type { Metadata } from "next"
import Link from "next/link"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About — CredStack",
  description: "What CredStack is, why it exists, and who builds it.",
}

export default function AboutPage() {
  return (
    <StaticPageShell
      eyebrow="About"
      title="A smarter way to use credit cards in India"
      description="CredStack helps you pick the right card, earn more rewards, and avoid useless fees — all in one place, with AI on tap."
    >
      <h2>Why we built this</h2>
      <p>
        Credit cards in India have exploded — 80+ premium cards, dozens of issuers, hundreds of fast-changing offers. Most comparison sites read like ranked ads. We wanted a tool that answered the only question that matters: <strong>given how I actually spend, which card earns me the most?</strong>
      </p>

      <h2>What CredStack does</h2>
      <ul>
        <li><strong>Compare</strong> any two cards side-by-side on rewards, fees, lounge access, and forex markup.</li>
        <li><strong>Analyse</strong> a real bank statement — upload a PDF and see your spend broken down by category.</li>
        <li><strong>Recommend</strong> the best card for your spending pattern with a transparent score (no &ldquo;sponsored&rdquo; ranking).</li>
        <li><strong>Track</strong> your wishlist, applications, lounge visits, and due dates.</li>
        <li><strong>Surface offers</strong> across banks — dining, travel, fuel, shopping — refreshed daily.</li>
      </ul>

      <h2>How we make money</h2>
      <p>
        CredStack is free to use. When you apply for a card through an &ldquo;Apply Now&rdquo; link, the issuing bank may pay us a referral fee. This <em>never</em> affects ranking. Rankings come from a deterministic score, not commercial relationships.
      </p>

      <h2>How we keep your data safe</h2>
      <p>
        Statements stay encrypted at rest in Supabase. Row-level security means even a leaked API key cannot read another user&apos;s data. PDFs are auto-purged after 30 days. We never sell, share, or train on your data. See <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>The team</h2>
      <p>
        CredStack is built by a small team of engineers based in India. Open to feedback — write to <a href="mailto:hello@credstack.com">hello@credstack.com</a>.
      </p>

      <div className="not-prose mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/cards">Browse cards</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/methodology">Read our methodology</Link>
        </Button>
      </div>
    </StaticPageShell>
  )
}
