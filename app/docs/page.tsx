import type { Metadata } from "next"
import Link from "next/link"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "API Docs",
  description: "Programmatic access to CredStack data.",
}

export default function DocsPage() {
  return (
    <StaticPageShell
      eyebrow="Developers"
      title="API Documentation"
      description="A public, read-only API is on the roadmap. Until then, here's what's planned."
    >
      <h2>Planned endpoints</h2>
      <p>The public API will expose the same card catalog and offers data that powers cred-stack.vercel.app.</p>
      <ul>
        <li><code>GET /api/v1/cards</code> — list all cards with rewards and fees.</li>
        <li><code>GET /api/v1/cards/:slug</code> — single card detail.</li>
        <li><code>GET /api/v1/offers</code> — active offers, filterable by category.</li>
        <li><code>GET /api/v1/banks</code> — issuer index.</li>
      </ul>

      <h2>Authentication</h2>
      <p>API keys will be issued per developer. Anonymous reads will be allowed for low-volume catalog requests; authenticated reads will get higher rate limits and access to derived endpoints (compare, recommend).</p>

      <h2>Rate limits</h2>
      <ul>
        <li>Anonymous: 30 req/min per IP.</li>
        <li>Authenticated: 600 req/min per key.</li>
      </ul>

      <h2>Status</h2>
      <p>The API is currently in private design. If you want early access for a research, journalism, or integration project, reach out.</p>

      <div className="not-prose mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <a href="mailto:api@credstack.com">
            <Mail className="h-4 w-4 mr-2" />
            Request early access
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/methodology">Read the methodology</Link>
        </Button>
      </div>
    </StaticPageShell>
  )
}
