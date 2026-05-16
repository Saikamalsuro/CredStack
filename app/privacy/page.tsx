import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"

export const metadata: Metadata = {
  title: "Privacy Policy — CredStack",
  description: "How CredStack collects, uses, and protects your personal information.",
}

const LAST_UPDATED = "16 May 2026"

export default function PrivacyPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description={`Last updated: ${LAST_UPDATED}`}
    >
      <p>
        CredStack (&ldquo;we&rdquo;, &ldquo;our&rdquo;) operates the website at cred-stack.vercel.app and any future domain we may operate. This policy explains what personal data we collect, why, and what your rights are.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account data</strong>: email address, name, and authentication tokens supplied during sign-up via Supabase Auth.</li>
        <li><strong>Profile data</strong>: cards you add, spending profile, preferences, and wishlists you create inside the app.</li>
        <li><strong>Statement data</strong>: PDF statements you choose to upload to the Analyzer. We extract transactions, categorise them, and store the results against your account.</li>
        <li><strong>Usage data</strong>: anonymised page views and performance metrics collected via Vercel Analytics and Speed Insights.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To run the core features (compare cards, recommend offers, analyse statements, surface rewards).</li>
        <li>To send transactional emails (due-date reminders, password resets) via Resend.</li>
        <li>To improve performance, fix bugs, and detect abuse.</li>
      </ul>

      <h2>How we store it</h2>
      <p>
        All user data lives in Supabase Postgres with row-level security. Statement PDFs are stored in Supabase Storage and auto-deleted after 30 days by a scheduled job. Authentication tokens are httpOnly cookies, never accessible to JavaScript.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We never sell your data.</li>
        <li>We do not share statement contents with banks, advertisers, or any third party.</li>
        <li>We do not use your data to train AI models.</li>
      </ul>

      <h2>Third-party processors</h2>
      <p>
        We rely on Supabase (database, auth, storage), Groq (LLM inference for categorisation), Vercel (hosting + analytics), Resend (email), Inngest (background jobs), and Upstash (caching). Each operates under their own privacy terms.
      </p>

      <h2>Your rights</h2>
      <p>
        You can export or delete all your data from Dashboard → Privacy. To raise a complaint or request action under Indian DPDP / EU GDPR, contact <a href="mailto:privacy@credstack.com">privacy@credstack.com</a>.
      </p>
    </StaticPageShell>
  )
}
