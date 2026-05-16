import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, GraduationCap, Plane, FileText, Check } from "lucide-react"

export const metadata: Metadata = {
  title: "Credit Card Application Documents — KYC Checklist 2026 | CredStack",
  description:
    "Complete document checklist for applying for a credit card in India. Salaried, self-employed, student and NRI requirements. Bank-specific notes included.",
}

interface ProfileChecklist {
  id: string
  title: string
  icon: typeof Briefcase
  blurb: string
  required: string[]
  optional: string[]
}

const PROFILES: ProfileChecklist[] = [
  {
    id: "salaried",
    title: "Salaried",
    icon: Briefcase,
    blurb: "Working as a regular employee with monthly salary credits.",
    required: [
      "PAN card (mandatory for all credit applications)",
      "Aadhaar card (front + back)",
      "Latest 3 salary slips",
      "Form 16 from current employer",
      "Bank statement of salary account (3 months)",
      "Recent passport-size photograph",
      "Filled and signed application form",
    ],
    optional: [
      "Office ID card for address verification",
      "Latest ITR for higher credit limits",
      "Existing card statement (for credit history)",
    ],
  },
  {
    id: "self-employed",
    title: "Self-employed",
    icon: Building2,
    blurb: "Business owner, freelancer, or professional with self-declared income.",
    required: [
      "PAN card",
      "Aadhaar card (front + back)",
      "ITR for last 2 years (with computation)",
      "Bank statement (6 months) — current + savings",
      "Business proof: GST registration / Shop Act / Udyam certificate",
      "Office address proof (utility bill / rent agreement)",
    ],
    optional: [
      "CA-certified profit & loss statement",
      "Audited balance sheet (if turnover > ₹1 crore)",
      "Trade licence or professional certificate",
    ],
  },
  {
    id: "student",
    title: "Student",
    icon: GraduationCap,
    blurb: "Add-on or supplementary cards via parent, or specific student variants.",
    required: [
      "Aadhaar card",
      "College / university ID card",
      "Address proof (hostel or permanent)",
      "Parent's PAN + income proof (for add-on)",
      "Latest fee receipt",
    ],
    optional: [
      "PAN card (if 18+)",
      "Fixed deposit receipt (for FD-backed cards like IDFC WOW)",
    ],
  },
  {
    id: "nri",
    title: "NRI",
    icon: Plane,
    blurb: "Indians residing abroad applying for cards on NRE/NRO funding.",
    required: [
      "Passport (with valid visa pages)",
      "OCI / PIO card if applicable",
      "Overseas address proof (utility bill / rent agreement / driving license)",
      "Indian address proof",
      "NRE / NRO account statement (6 months)",
      "Latest salary slips or income proof from overseas employer",
      "Recent passport-size photograph",
    ],
    optional: [
      "Form 60 (if no PAN)",
      "Foreign tax return (last year)",
    ],
  },
]

const BANK_NOTES = [
  { bank: "HDFC Bank", note: "Pre-approved offers via Net Banking skip most KYC; new-to-bank applicants need full set." },
  { bank: "SBI Card", note: "Form 16 mandatory for premium cards (PRIME, ELITE) even for high-salary applicants." },
  { bank: "ICICI Bank", note: "Existing relationship customers get auto-approved on Coral / Platinum with PAN + Aadhaar only." },
  { bank: "Axis Bank", note: "Magnus and Reserve cards require AAA-rated employer or audited financials for self-employed." },
  { bank: "American Express", note: "Strict income verification; income ≥ ₹6L for Platinum Travel, ₹15L for Platinum Reserve." },
  { bank: "AU Small Finance Bank", note: "Self-employed applicants > ₹10L require CA-attested ITR." },
  { bank: "IDFC FIRST Bank", note: "WOW Card requires only an FD of ₹2K+; no income proof needed." },
  { bank: "Standard Chartered", note: "Existing bank customers can apply through net banking with no additional documents." },
]

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <FileText className="h-3.5 w-3.5" />
          Reference
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Documents required to apply for a credit card</h1>
        <p className="text-muted-foreground">
          Indian KYC requirements by applicant profile. PAN and Aadhaar are mandatory for almost every issuer; income proof varies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {PROFILES.map((p) => {
          const Icon = p.icon
          return (
            <Card key={p.id} id={p.id} className="scroll-mt-20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{p.title}</CardTitle>
                </div>
                <CardDescription>{p.blurb}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Required</p>
                  <ul className="space-y-1.5">
                    {p.required.map((r) => (
                      <li key={r} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {p.optional.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Optional (helps approval)</p>
                    <ul className="space-y-1.5">
                      {p.optional.map((o) => (
                        <li key={o} className="text-sm flex items-start gap-2 text-muted-foreground">
                          <Check className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bank-specific notes</CardTitle>
          <CardDescription>Issuer quirks worth knowing before applying</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BANK_NOTES.map((b) => (
              <div key={b.bank} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                <Badge variant="outline" className="shrink-0">{b.bank}</Badge>
                <p className="text-sm text-muted-foreground flex-1">{b.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Before you apply</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>• Keep digital copies of all documents (PDF / clear photo). Most banks now accept e-KYC end-to-end.</p>
          <p>• Each credit application produces a hard enquiry on your CIBIL report. Avoid applying for multiple cards in the same week.</p>
          <p>• Income proof is checked against your declared income — under-declaring is rejected, over-declaring is fraud.</p>
          <p>• Pre-approved offers in your bank&apos;s net banking skip most of this; check there first.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 mt-8">
        <Button asChild>
          <Link href="/eligibility">Check eligibility</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cards">Browse cards</Link>
        </Button>
      </div>
    </div>
  )
}
