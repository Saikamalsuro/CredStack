import type { Metadata } from "next"
import Link from "next/link"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form writing on Indian credit cards, rewards strategy, and product updates.",
}

export default function BlogPage() {
  return (
    <StaticPageShell
      eyebrow="Blog"
      title="Writing"
      description="Long-form pieces on Indian credit cards, rewards strategy, and what we ship at CredStack."
    >
      <div className="not-prose rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="font-medium mb-1">Nothing here yet</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
          First posts land soon. Until then, the Learn library has 20 ready-made guides — beginner to advanced.
        </p>
        <Button asChild>
          <Link href="/learn">Open the Learn library</Link>
        </Button>
      </div>

      <h2>What you can expect</h2>
      <ul>
        <li>Deep dives into specific cards — what looks good on paper vs what actually earns.</li>
        <li>Reward arbitrage: redemption-rate gaps across banks.</li>
        <li>Spending strategy: how to extract value without spending more.</li>
        <li>Quarterly state-of-the-cards reports.</li>
      </ul>
    </StaticPageShell>
  )
}
