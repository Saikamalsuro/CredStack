import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"

export const metadata: Metadata = {
  title: "Terms of Service — CredStack",
  description: "The rules for using CredStack.",
}

const LAST_UPDATED = "16 May 2026"

export default function TermsPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description={`Last updated: ${LAST_UPDATED}`}
    >
      <p>
        By accessing or using CredStack you agree to these terms. If you do not agree, do not use the service.
      </p>

      <h2>The service</h2>
      <p>
        CredStack is an informational tool that helps users compare Indian credit cards, analyse spending, and discover rewards. It is not a bank, a financial advisor, or a regulated entity.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be 18+ and an Indian resident (or otherwise legally able to apply for the cards listed).</li>
        <li>You are responsible for the security of your login credentials.</li>
        <li>One person, one account. Automated scraping or bulk account creation is prohibited.</li>
      </ul>

      <h2>What you upload</h2>
      <p>
        You retain ownership of any statements you upload. You grant CredStack a limited licence to parse, categorise, and store those statements for the sole purpose of running the Analyzer features for your account.
      </p>

      <h2>No financial advice</h2>
      <p>
        Card recommendations, reward calculations, and offer listings are estimates based on public information and your inputs. They do not constitute financial, tax, or investment advice. Always verify card details directly with the issuing bank before applying.
      </p>

      <h2>Affiliate disclosure</h2>
      <p>
        Some &ldquo;Apply Now&rdquo; links may be affiliate links — when you apply through CredStack we may receive a referral fee from the issuing bank. This never changes the rank, score, or recommendation logic.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>No reverse engineering, scraping, or excessive automated requests.</li>
        <li>No uploading content you do not have permission to share (e.g. someone else&apos;s statement).</li>
        <li>No attempts to break authentication or access other users&apos; data.</li>
      </ul>

      <h2>Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these terms. You can delete your account at any time from Dashboard → Privacy.
      </p>

      <h2>Liability</h2>
      <p>
        CredStack is provided &ldquo;as is&rdquo;. We are not liable for losses arising from acting on the information provided. Maximum liability in any case is capped at INR 1,000.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka.
      </p>
    </StaticPageShell>
  )
}
