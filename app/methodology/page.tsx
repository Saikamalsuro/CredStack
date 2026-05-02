import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Calculator, Sparkles, Database, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Methodology | CredStack",
  description:
    "How CredStack verifies card data, computes net annual value, and uses AI to generate recommendations.",
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Trust & Methodology
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            How CredStack Works
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            We tell you the actual rupee value each card delivers — based on how you spend.
            Here is exactly how we verify cards, compute net value, and build recommendations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Card Data Verification</CardTitle>
                <CardDescription>How fees, rewards, and benefits enter our database</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              Every card record links to its <strong>Most Important Terms &amp; Conditions (MITC)</strong>{" "}
              document and the issuer&apos;s public product page. Editorial review happens at issue,
              and a weekly job flags any card not re-verified in the last 60 days.
            </p>
            <p>
              The card detail page exposes <strong>Last verified</strong> on every card. If the
              date is older than 60 days, treat the figures as approximate and confirm with the
              bank before applying.
            </p>
            <p>
              We do <strong>not</strong> scrape bank websites for card terms. The catalog is curated by
              hand because reward caps, capping categories, and exclusion lists are not reliably
              extractable from marketing pages.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Net Annual Value</CardTitle>
                <CardDescription>
                  Reward earned, less fees — modeled against your spending profile
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              For each card we model a deterministic monthly reward calculation across your
              spending categories (shopping, travel, fuel, dining, other). Per-category rules
              come from a curated <code>card_reward_rules</code> table — accelerated rates,
              monthly caps, and excluded categories are all applied.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Reward is capped per rule (e.g. ₹1,000/month on Amazon).</li>
              <li>Excluded categories (rent, wallet load, government, etc.) earn zero.</li>
              <li>Annual milestone bonuses are added when your annual spend crosses thresholds.</li>
              <li>The annual fee is subtracted — and zeroed if your spend triggers a fee waiver.</li>
            </ul>
            <p>
              The result — <strong>Net Annual Value</strong> — is shown on the Compare page and
              powers Advisor rankings. No LLM is in this loop; the math is reproducible.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle>AI Advisor</CardTitle>
                <CardDescription>What the LLM does — and what it doesn&apos;t</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              The advisor first runs the deterministic Net Annual Value engine over every eligible
              card. Top candidates are ranked by net rupee value. Only then is the LLM (Groq, Llama
              3.3 70B) asked to write a 1–2 sentence explanation per card, given the structured
              card data and your computed reward number.
            </p>
            <p>
              The model never invents benefits, rates, or caps. Outputs are validated against a
              Zod schema and fall back to a generic explanation if the LLM is unavailable. We
              cache responses for 24 hours per spending profile.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle>Important Notes</CardTitle>
                <CardDescription>Limits of what this tool can tell you</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>This site is informational. It is not financial advice.</li>
              <li>
                Card ratings shown are aggregated estimates pending the launch of verified user
                reviews. Confirm specifics with the issuer before applying.
              </li>
              <li>
                Reward rules can change without notice — the <strong>Last verified</strong> date is
                your trust signal. If it is stale, treat the data as a starting point.
              </li>
              <li>
                Net Annual Value depends on your inputs. Garbage in, garbage out. If your real
                spending differs from the profile you modeled, your real reward will differ too.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/cards">Browse Cards</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/advisor">Get a Recommendation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
