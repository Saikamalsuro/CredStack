import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclosures about CredStack and the information it provides.",
}

export default function DisclaimerPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Disclaimer"
      description="Read this before acting on any information on this site."
    >
      <h2>Not financial advice</h2>
      <p>
        CredStack is an informational and comparison tool. Nothing on this site constitutes financial, tax, investment, legal, or accounting advice. You should consult a qualified professional before making decisions about credit products.
      </p>

      <h2>No affiliation with banks</h2>
      <p>
        CredStack is an independent platform. We are not owned, operated, or endorsed by any bank, card network, or financial institution. Card names, logos, and trademarks belong to their respective owners and are used here for identification only.
      </p>

      <h2>Accuracy</h2>
      <p>
        Card features, fees, reward rates, and offer terms change frequently. We update our database regularly but cannot guarantee real-time accuracy. Always verify on the issuing bank&apos;s official website before applying.
      </p>

      <h2>Reward & savings estimates</h2>
      <p>
        Reward calculations on Compare and Optimizer pages are estimates based on the spending profile you provide and publicly advertised reward rates. Actual rewards may differ due to category exclusions, monthly caps, milestone benefits, and bank policy changes.
      </p>

      <h2>Affiliate links</h2>
      <p>
        Some &ldquo;Apply Now&rdquo; buttons are affiliate links. CredStack may receive compensation when you apply through these links. This does not influence which cards we list or how they are ranked.
      </p>

      <h2>Third-party services</h2>
      <p>
        Statement analysis is powered by third-party LLM providers (Groq). While we instruct the model to operate strictly within parsing tasks, large language model outputs can contain errors. Treat parsed categories as suggestions, not authoritative records.
      </p>

      <h2>Use at your own risk</h2>
      <p>
        CredStack is provided &ldquo;as is&rdquo; without warranties of any kind. Use the information here at your own discretion and risk.
      </p>
    </StaticPageShell>
  )
}
