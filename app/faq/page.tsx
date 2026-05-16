import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about CredStack.",
}

const faqs: { q: string; a: string }[] = [
  {
    q: "Is CredStack free?",
    a: "Yes. Comparing cards, using the AI Advisor, the Analyzer, and all dashboard features are free. We may add a paid tier later for power users; the core comparison will always remain free.",
  },
  {
    q: "Does CredStack charge banks to list cards?",
    a: "No. Every Indian credit card we know about is listed regardless of any commercial relationship. Ranking is deterministic and based on your spending profile, not advertiser bids.",
  },
  {
    q: "How does the Analyzer read my statement?",
    a: "You upload a PDF. We extract the text, send it to a large language model (Groq) with strict instructions to return structured JSON. The categorised transactions are stored in your account. The original PDF is auto-deleted after 30 days.",
  },
  {
    q: "Is my statement data shared with banks or advertisers?",
    a: "Never. Statement contents live in your Supabase row with row-level security. Only you can read them. We do not sell, share, or use them to train AI models.",
  },
  {
    q: "Why do the reward calculations differ from what I actually earn?",
    a: "We use publicly advertised reward rates and category logic. Real earnings can differ due to category exclusions (rent, fuel, government), monthly caps, milestone bonuses, and bank policy changes. We try to surface these in the card detail page.",
  },
  {
    q: "What happens when I click 'Apply Now'?",
    a: "You're redirected to the bank's official application page. Some of these are affiliate links — if you apply, we may receive a referral fee. This does not change your ranking on our site or affect approval odds.",
  },
  {
    q: "Can I delete my account?",
    a: "Yes. Dashboard → Privacy → Delete account. This wipes all your data including transactions, statements, and preferences within 24 hours.",
  },
  {
    q: "Which cards are missing?",
    a: "We track 80+ Indian credit cards. If yours isn't listed, email hello@credstack.com — we'll usually add it within a week.",
  },
  {
    q: "Is this regulated by RBI?",
    a: "No. CredStack is an information and comparison platform, not a financial institution. We do not handle payments, issue cards, or hold funds.",
  },
  {
    q: "Why do I see different recommendations than my friend?",
    a: "Recommendations depend on your spending profile, the cards you already hold, and your eligibility (income, credit score band). Two users with different inputs will see different rankings — that's the point.",
  },
]

export default function FaqPage() {
  return (
    <StaticPageShell
      eyebrow="Help"
      title="Frequently asked questions"
      description="Quick answers to the questions people ask us most."
    >
      <div className="not-prose space-y-6 mt-2">
        {faqs.map((item) => (
          <div key={item.q} className="border-l-2 border-primary/40 pl-4">
            <h3 className="font-semibold mb-2">{item.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </StaticPageShell>
  )
}
