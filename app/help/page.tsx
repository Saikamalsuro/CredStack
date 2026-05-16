import type { Metadata } from "next"
import Link from "next/link"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { BookOpen, BarChart3, Sparkles, ShieldCheck, MessageSquare, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Help Center — CredStack",
  description: "Guides and articles for getting the most out of CredStack.",
}

const sections = [
  {
    icon: BookOpen,
    title: "Getting started",
    items: [
      { label: "Create your first wishlist", href: "/dashboard/wishlist" },
      { label: "Add cards you already own", href: "/dashboard" },
      { label: "Understand the recommendation score", href: "/methodology" },
    ],
  },
  {
    icon: BarChart3,
    title: "Analyzer",
    items: [
      { label: "Upload a bank statement", href: "/analyzer" },
      { label: "How categorisation works", href: "/faq" },
      { label: "Export your annual tax summary", href: "/dashboard/tax-export" },
    ],
  },
  {
    icon: Sparkles,
    title: "AI Advisor",
    items: [
      { label: "Ask for a recommendation", href: "/advisor" },
      { label: "Tweak your spending profile", href: "/dashboard" },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Account & privacy",
    items: [
      { label: "Export your data", href: "/dashboard/privacy" },
      { label: "Delete your account", href: "/dashboard/privacy" },
      { label: "Read our privacy policy", href: "/privacy" },
    ],
  },
  {
    icon: FileText,
    title: "Reference",
    items: [
      { label: "Methodology", href: "/methodology" },
      { label: "Safety & trust", href: "/safety" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
  {
    icon: MessageSquare,
    title: "Still stuck?",
    items: [
      { label: "Contact support", href: "/contact" },
      { label: "Browse the FAQ", href: "/faq" },
    ],
  },
]

export default function HelpPage() {
  return (
    <StaticPageShell
      eyebrow="Support"
      title="Help Center"
      description="Find a guide, browse the FAQ, or contact us directly."
    >
      <div className="not-prose grid sm:grid-cols-2 gap-4 mt-2">
        {sections.map((s) => (
          <div key={s.title} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">{s.title}</h3>
            </div>
            <ul className="space-y-2">
              {s.items.map((it) => (
                <li key={it.href + it.label}>
                  <Link href={it.href} className="text-sm text-muted-foreground hover:text-primary">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </StaticPageShell>
  )
}
