import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertOctagon, Phone, FileText, Building2, Scale, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Credit Card Fraud — Response Guide (India, 2026) | CredStack",
  description:
    "Step-by-step what to do if your credit card is stolen, cloned, or fraudulently charged. RBI zero-liability rules, complaint paths, and common scam patterns.",
}

const STEPS = [
  {
    icon: Phone,
    title: "Block the card immediately",
    body: "Call the bank&apos;s toll-free number (see Helplines directory) and request a card block. Most issuers also support blocking via mobile app, SMS (BLOCK to the bank&apos;s number), or net banking. Don&apos;t wait for office hours — fraud alerts are 24x7.",
    eta: "Within minutes",
  },
  {
    icon: FileText,
    title: "File a written complaint",
    body: "Send an email to the bank&apos;s customer service AND CC the principal nodal officer. Include card last 4 digits, last legitimate transaction, list of disputed transactions, and request a chargeback. Keep proof of submission (timestamped email).",
    eta: "Within 3 working days (mandatory for zero liability)",
  },
  {
    icon: AlertOctagon,
    title: "Report to cybercrime.gov.in",
    body: "Lodge an FIR equivalent on the National Cybercrime Reporting Portal. Add transaction reference numbers, screenshots of fraudulent charges, and any phishing messages received. Quote this complaint number in your bank communication.",
    eta: "Same day",
  },
  {
    icon: Scale,
    title: "Banking Ombudsman (if unresolved)",
    body: "If the bank fails to resolve within 30 days, escalate to RBI&apos;s Integrated Ombudsman Scheme via cms.rbi.org.in or call 14448. Filing is free; ombudsman can order refund + compensation.",
    eta: "After 30 days of no resolution",
  },
  {
    icon: Building2,
    title: "RBI complaint (final escalation)",
    body: "If ombudsman doesn&apos;t resolve in 30 days, write to the RBI Consumer Education and Protection Department, Mumbai. Include the complete trail of bank + ombudsman correspondence.",
    eta: "Last resort, after ombudsman",
  },
]

const LIABILITY = [
  { window: "Within 3 working days", liability: "Zero", note: "If reported promptly, you owe nothing under RBI 2017 guidelines." },
  { window: "4 to 7 working days", liability: "Up to ₹10,000 (general) / ₹25,000 (credit card)", note: "Limited liability — exact cap depends on card type." },
  { window: "Beyond 7 working days", liability: "Per bank policy", note: "Banks may hold you fully liable. Speed matters." },
]

const SCAMS = [
  {
    title: "OTP phishing",
    pattern: "Caller claims to be from your bank, says your card is blocked / KYC pending. Asks for OTP to &quot;reactivate&quot;.",
    defense: "No bank ever asks for OTP, CVV, or full card number over phone. Hang up. Call the number on the back of your card to verify.",
  },
  {
    title: "Fake reward redemption",
    pattern: "SMS / WhatsApp with a link saying &quot;your reward points expire today, click to redeem&quot;. Link harvests credentials.",
    defense: "Always redeem rewards via the official bank app or website. Don&apos;t click SMS links.",
  },
  {
    title: "SIM swap",
    pattern: "Fraudster gets your SIM blocked and ported to their device, then receives OTPs.",
    defense: "Enable Aadhaar-based SIM lock. If your SIM goes dead unexpectedly, call your carrier immediately and your bank to freeze cards.",
  },
  {
    title: "Skimming / cloning",
    pattern: "Magnetic stripe is captured at ATMs or shady POS terminals. Cloned card used elsewhere.",
    defense: "Use chip + PIN cards. Cover the keypad while entering PIN. Avoid handing card out of sight; use the merchant&apos;s tap terminal yourself.",
  },
  {
    title: "Fake bank app",
    pattern: "Lookalike app on Play Store or APK link from SMS. Captures login + OTPs.",
    defense: "Only install from official store. Verify the publisher name. Banks never ask you to install an app via SMS link.",
  },
  {
    title: "Investment / loan scams",
    pattern: "&quot;Pay ₹500 processing fee to activate your pre-approved loan / credit card upgrade&quot;.",
    defense: "Banks never charge a fee before issuing a card or disbursing a loan. Anyone asking is a fraudster.",
  },
]

export default function FraudGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-sm font-medium mb-4">
          <Shield className="h-3.5 w-3.5" />
          Safety
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Credit card fraud — what to do</h1>
        <p className="text-muted-foreground">
          A step-by-step playbook for responding to fraud, scam patterns to watch for, and your rights under RBI zero-liability rules.
        </p>
      </div>

      <Card className="bg-destructive/5 border-destructive/30 mb-10">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Act within 3 working days for zero liability.</p>
            <p className="text-sm text-muted-foreground">Under RBI&apos;s 2017 customer protection circular, prompt reporting limits or eliminates your liability for unauthorised transactions. Every hour matters.</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Step-by-step response</h2>
      <div className="space-y-4 mb-12">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={s.title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="p-3 rounded-lg bg-primary/10 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">Step {i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{s.body}</p>
                    <div className="inline-flex items-center gap-1.5 text-xs bg-muted px-2.5 py-1 rounded-full">
                      <Clock className="h-3 w-3" />
                      <span>{s.eta}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="text-2xl font-bold mb-4">Your liability window</h2>
      <Card className="mb-12">
        <CardContent className="pt-6">
          <div className="space-y-3">
            {LIABILITY.map((l) => (
              <div key={l.window} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-3 last:pb-0 border-b last:border-b-0">
                <div className="sm:w-1/3">
                  <p className="font-medium text-sm">{l.window}</p>
                </div>
                <div className="sm:w-1/4">
                  <p className="text-sm font-medium text-primary">{l.liability}</p>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{l.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Common scam patterns</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {SCAMS.map((s) => (
          <Card key={s.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Pattern</p>
                <p>{s.pattern}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Defence</p>
                <p>{s.defense}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Useful contacts</CardTitle>
          <CardDescription>Save these now — you won&apos;t want to search during an incident.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-1.5">
          <p><strong>National Cybercrime helpline:</strong> 1930</p>
          <p><strong>RBI Banking Ombudsman:</strong> 14448</p>
          <p><strong>Cybercrime portal:</strong> <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cybercrime.gov.in</a></p>
          <p><strong>RBI complaint system:</strong> <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cms.rbi.org.in</a></p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/safety/helplines">Bank helpline directory →</Link>
        </Button>
      </div>
    </div>
  )
}
