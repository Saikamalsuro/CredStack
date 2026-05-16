import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, AlertOctagon, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Credit Card Helplines — All Indian Banks 2026 | CredStack",
  description:
    "Toll-free customer service, complaint email, and escalation paths for every major Indian credit card issuer. Banking Ombudsman link for unresolved disputes.",
}

interface BankHelpline {
  bank: string
  tollFree: string
  paid?: string
  email: string
  cardSpecific?: { line: string; phone: string }[]
  escalation?: string
  notes?: string
}

const HELPLINES: BankHelpline[] = [
  {
    bank: "HDFC Bank",
    tollFree: "1800-202-6161",
    paid: "022-6160-6161",
    email: "support@hdfcbank.com",
    cardSpecific: [
      { line: "Infinia / Diners Black", phone: "1800-118-887" },
    ],
    escalation: "principal.nodalofficer@hdfcbank.com",
  },
  {
    bank: "SBI Card",
    tollFree: "1860-180-1290",
    paid: "39-02-02-02",
    email: "customercare@sbicard.com",
    cardSpecific: [
      { line: "ELITE / Aurum", phone: "1860-500-1290" },
    ],
    escalation: "PrincipalNodalOfficer@sbicard.com",
  },
  {
    bank: "ICICI Bank",
    tollFree: "1800-1080",
    paid: "022-3366-7777",
    email: "customer.care@icicibank.com",
    cardSpecific: [
      { line: "Emeralde / Sapphiro", phone: "1800-103-8181" },
    ],
    escalation: "headservicequality@icicibank.com",
  },
  {
    bank: "Axis Bank",
    tollFree: "1860-419-5555",
    paid: "022-6798-7700",
    email: "customer.service@axisbank.com",
    cardSpecific: [
      { line: "Reserve / Magnus", phone: "1800-419-7666" },
    ],
    escalation: "nodal.officer@axisbank.com",
  },
  {
    bank: "American Express",
    tollFree: "1800-419-1414",
    paid: "0124-280-1800",
    email: "Indian.cardmember@aexp.com",
    cardSpecific: [
      { line: "Platinum / Centurion", phone: "1800-419-9991" },
    ],
    escalation: "TheNodalOfficer@aexp.com",
  },
  {
    bank: "Kotak Mahindra Bank",
    tollFree: "1860-266-2666",
    paid: "022-6204-2666",
    email: "ccservices@kotak.com",
    escalation: "service.head@kotak.com",
  },
  {
    bank: "IDFC FIRST Bank",
    tollFree: "1800-10-888",
    paid: "022-6248-5152",
    email: "customer.care@idfcfirstbank.com",
    escalation: "principalnodalofficer@idfcfirstbank.com",
  },
  {
    bank: "YES Bank",
    tollFree: "1800-1200",
    paid: "022-6121-9000",
    email: "yestouch@yesbank.in",
    escalation: "head.grievanceredressal@yesbank.in",
  },
  {
    bank: "IndusInd Bank",
    tollFree: "1860-267-7777",
    paid: "022-4220-7777",
    email: "premium.care@indusind.com",
    escalation: "nodal.officer@indusind.com",
  },
  {
    bank: "RBL Bank",
    tollFree: "1800-121-9050",
    email: "cardservices@rblbank.com",
    escalation: "principalnodalofficer@rblbank.com",
  },
  {
    bank: "Standard Chartered",
    tollFree: "1800-345-1000",
    paid: "022-6601-9999",
    email: "customer.care@sc.com",
    escalation: "head.service@sc.com",
  },
  {
    bank: "HSBC Bank India",
    tollFree: "1800-266-3456",
    paid: "044-3942-3942",
    email: "indiancustomerservices@hsbc.co.in",
    escalation: "complaints.india@hsbc.co.in",
  },
  {
    bank: "AU Small Finance Bank",
    tollFree: "1800-1200-1200",
    email: "customercare@aubank.in",
    escalation: "nodal.officer@aubank.in",
  },
  {
    bank: "Bank of Baroda (BOBCARD)",
    tollFree: "1800-225-100",
    paid: "022-4204-9100",
    email: "crm@bobfinancial.com",
    escalation: "grievance.redressal@bobfinancial.com",
  },
  {
    bank: "Federal Bank",
    tollFree: "1800-425-1199",
    email: "contact@federalbank.co.in",
    escalation: "principalnodalofficer@federalbank.co.in",
  },
  {
    bank: "OneCard (FPL Technologies)",
    tollFree: "1800-210-9111",
    email: "help@getonecard.app",
    notes: "App-based support; chat 24x7 via OneCard app",
  },
]

export default function HelplinesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Phone className="h-3.5 w-3.5" />
          Helpline directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Credit card helplines — every Indian bank</h1>
        <p className="text-muted-foreground">
          Customer support numbers, complaint emails, escalation contacts, and Banking Ombudsman path for every major Indian issuer.
        </p>
      </div>

      <Card className="bg-amber-500/5 border-amber-500/30 mb-8">
        <CardContent className="pt-6 flex items-start gap-3">
          <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Card lost or compromised?</p>
            <p className="text-muted-foreground">Call the bank&apos;s toll-free number <strong>first</strong> and block the card. Then file a written complaint within 3 working days to preserve zero-liability protection under RBI rules.</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mb-10">
        {HELPLINES.map((b) => (
          <Card key={b.bank}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{b.bank}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Toll-free</p>
                    <a href={`tel:${b.tollFree.replace(/-/g, "")}`} className="font-medium hover:underline">{b.tollFree}</a>
                    {b.paid && (
                      <p className="text-xs text-muted-foreground mt-0.5">From abroad / paid: {b.paid}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Customer care</p>
                    <a href={`mailto:${b.email}`} className="font-medium hover:underline break-all">{b.email}</a>
                  </div>
                </div>
              </div>

              {b.cardSpecific && b.cardSpecific.length > 0 && (
                <div className="text-sm pt-2 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Premium card lines</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {b.cardSpecific.map((cs) => (
                      <div key={cs.line}>
                        <span className="text-muted-foreground">{cs.line}: </span>
                        <a href={`tel:${cs.phone.replace(/-/g, "")}`} className="font-medium hover:underline">{cs.phone}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {b.escalation && (
                <div className="text-sm pt-2 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Escalation (if unresolved in 30 days)</p>
                  <a href={`mailto:${b.escalation}`} className="font-medium hover:underline break-all">{b.escalation}</a>
                </div>
              )}

              {b.notes && (
                <p className="text-xs text-muted-foreground italic">{b.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-primary" />
            <CardTitle>Banking Ombudsman</CardTitle>
          </div>
          <CardDescription>If the bank doesn&apos;t resolve in 30 days, escalate to RBI&apos;s ombudsman.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>RB-IOS portal:</strong> <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cms.rbi.org.in</a></p>
          <p><strong>Toll-free:</strong> 14448 (9:30 AM – 5:15 PM, Mon-Fri)</p>
          <p className="text-muted-foreground mt-3">Complaints are accepted online or by post. There is no fee. You can also lodge a complaint at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">cybercrime.gov.in</a> for fraud cases.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/safety/fraud-guide">Fraud response guide →</Link>
        </Button>
      </div>
    </div>
  )
}
