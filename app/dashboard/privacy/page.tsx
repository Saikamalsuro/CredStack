import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Download, Trash2, ShieldCheck } from "lucide-react"
import { PrivacyControls } from "./privacy-controls"

export const metadata: Metadata = {
  title: "Privacy & Data Vault | CredStack",
  description: "Export all your CredStack data or permanently delete your account.",
}

export default async function PrivacyPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/privacy")

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Lock className="h-3.5 w-3.5" />
          Data vault
        </div>
        <h1 className="text-3xl font-bold mb-2">Your data, your call</h1>
        <p className="text-muted-foreground">
          Export everything we have on you. Or delete it all permanently. Both are one click away, as DPDP Act intends.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-success/10">
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            <CardTitle>What we store about you</CardTitle>
          </div>
          <CardDescription>Tied to your account ({user.email}), RLS-gated to you alone.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>• <strong>Profile:</strong> name, email, optional income / age / city / CIBIL band</p>
          <p>• <strong>Cards in your portfolio</strong> (last 4 digits only, never the full number)</p>
          <p>• <strong>Transactions</strong> from any statements you uploaded</p>
          <p>• <strong>Card payments</strong> tracked for due-date reminders</p>
          <p>• <strong>Lounge visits, applications, referrals, wishlist</strong></p>
          <p>• <strong>Advisor + analyzer sessions</strong> for personalised recommendations</p>
          <p>• <strong>Reviews</strong> you have posted on cards</p>
        </CardContent>
      </Card>

      <PrivacyControls userEmail={user.email ?? null} />

      <Card className="mt-6 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">DPDP compliance summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>• <strong>Right to access:</strong> Export gives you the raw JSON. Open in any text editor or spreadsheet via JSON-to-CSV converter.</p>
          <p>• <strong>Right to be forgotten:</strong> Delete removes every row keyed to your user id and finally drops the auth account.</p>
          <p>• <strong>Right to portability:</strong> The export format is structured JSON — portable to any other service that accepts the schema.</p>
          <p>• <strong>What we don&apos;t store:</strong> Full card numbers, CVVs, OTPs, raw scans of PAN / Aadhaar. PDF statements you upload are deleted after parsing.</p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
