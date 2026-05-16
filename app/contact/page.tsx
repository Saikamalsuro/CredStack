import type { Metadata } from "next"
import { StaticPageShell } from "@/components/layout/static-page-shell"
import { Mail, MessageSquare, Bug, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact — CredStack",
  description: "How to reach CredStack for support, partnerships, security disclosures, or feedback.",
}

const channels = [
  {
    icon: Mail,
    title: "General",
    email: "hello@credstack.com",
    description: "Product questions, partnerships, anything else.",
  },
  {
    icon: MessageSquare,
    title: "Feedback",
    email: "feedback@credstack.com",
    description: "Feature ideas, missing cards, bad recommendations — we read everything.",
  },
  {
    icon: Bug,
    title: "Bug reports",
    email: "bugs@credstack.com",
    description: "Something broken? Include browser, OS, and steps to reproduce.",
  },
  {
    icon: Shield,
    title: "Security",
    email: "security@credstack.com",
    description: "Responsible disclosure. PGP key on request. Please do not publish before we respond.",
  },
]

export default function ContactPage() {
  return (
    <StaticPageShell
      eyebrow="Support"
      title="Talk to us"
      description="Pick the channel that fits. We reply within 2 working days."
    >
      <div className="not-prose grid sm:grid-cols-2 gap-4 mt-4">
        {channels.map((c) => (
          <div
            key={c.email}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">{c.title}</h3>
            </div>
            <a
              href={`mailto:${c.email}`}
              className="text-sm text-primary hover:underline block mb-2"
            >
              {c.email}
            </a>
            <p className="text-sm text-muted-foreground">{c.description}</p>
          </div>
        ))}
      </div>

      <h2>Office</h2>
      <p>CredStack is a remote team based in India. We don&apos;t take walk-in visits — please email first.</p>
    </StaticPageShell>
  )
}
