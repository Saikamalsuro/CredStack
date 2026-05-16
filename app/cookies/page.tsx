import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How CredStack uses cookies and similar technologies.",
}

const LAST_UPDATED = "16 May 2026"

export default function CookiesPage() {
  return (
    <StaticPageShell
      eyebrow="Legal"
      title="Cookie Policy"
      description={`Last updated: ${LAST_UPDATED}`}
    >
      <p>This page explains what cookies CredStack sets, why, and how to control them.</p>

      <h2>Strictly necessary</h2>
      <ul>
        <li><code>sb-*</code> — Supabase authentication cookies. Required to keep you signed in.</li>
        <li><code>_vercel_*</code> — Vercel infrastructure cookies (load balancing, deployment routing).</li>
      </ul>
      <p>You cannot disable strictly necessary cookies. Without them the site cannot function.</p>

      <h2>Performance & analytics</h2>
      <ul>
        <li>Vercel Analytics sets an anonymised first-party identifier to count unique page views. No cross-site tracking.</li>
        <li>Vercel Speed Insights collects Core Web Vitals without identifiers.</li>
      </ul>

      <h2>What we don&apos;t set</h2>
      <ul>
        <li>No third-party advertising cookies.</li>
        <li>No Google Analytics, Meta Pixel, or similar.</li>
        <li>No cross-site behavioural tracking.</li>
      </ul>

      <h2>Controlling cookies</h2>
      <p>
        You can delete or block cookies from your browser settings. Blocking <code>sb-*</code> will sign you out. Browser DNT (Do-Not-Track) signals are respected for analytics.
      </p>
    </StaticPageShell>
  )
}
