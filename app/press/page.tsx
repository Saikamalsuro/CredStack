import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Button } from "@/components/ui/button"
import { Mail, Download } from "lucide-react"

export const metadata: Metadata = {
  title: "Press — CredStack",
  description: "Press kit, fact sheet, and media contact for CredStack.",
}

export default function PressPage() {
  return (
    <StaticPageShell
      eyebrow="Press"
      title="Press kit"
      description="Everything journalists, bloggers, and researchers need to write about CredStack."
    >
      <h2>The 30-second version</h2>
      <p>
        CredStack is an independent Indian credit card comparison and analysis platform. Users compare cards side-by-side, upload statements for AI-powered categorisation, and receive personalised recommendations based on their actual spending. Built on Next.js, Supabase, and Groq. Free for end users. India-based team.
      </p>

      <h2>Fast facts</h2>
      <ul>
        <li><strong>Founded:</strong> 2026</li>
        <li><strong>HQ:</strong> India (remote-first)</li>
        <li><strong>Cards tracked:</strong> 80+ Indian credit cards</li>
        <li><strong>Stack:</strong> Next.js 16, Supabase, Groq LLM, Vercel</li>
        <li><strong>Business model:</strong> Affiliate referrals (no advertising, no data sale)</li>
        <li><strong>Status:</strong> Public beta</li>
      </ul>

      <h2>Brand assets</h2>
      <p>Logos, screenshots, and brand colours available on request. We can usually turn around press kits within one working day.</p>

      <h2>Media inquiries</h2>
      <p>For interviews, statements, or fact-checks, email us. We respond to journalists within 24 hours.</p>

      <div className="not-prose mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <a href="mailto:press@credstack.com">
            <Mail className="h-4 w-4 mr-2" />
            press@credstack.com
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="mailto:press@credstack.com?subject=Brand%20assets%20request">
            <Download className="h-4 w-4 mr-2" />
            Request brand assets
          </a>
        </Button>
      </div>
    </StaticPageShell>
  )
}
