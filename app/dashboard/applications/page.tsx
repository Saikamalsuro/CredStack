import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/db/server"
import { listApplications } from "@/lib/db/applications"
import { getCards } from "@/lib/db/cards"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList } from "lucide-react"
import { ApplicationsClient } from "./applications-client"

export const metadata: Metadata = {
  title: "Application Tracker | CredStack",
  description: "Track credit card applications across banks. Kanban-style status board.",
}

export default async function ApplicationsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/applications")

  const [applications, cards] = await Promise.all([
    listApplications(user.id),
    getCards(),
  ])

  const cardChoices = cards.map((c) => ({ slug: c.id, name: c.name, issuer: c.issuer }))

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <ClipboardList className="h-3.5 w-3.5" />
          Application tracker
        </div>
        <h1 className="text-3xl font-bold mb-2">Card applications in flight</h1>
        <p className="text-muted-foreground">
          Track every card you&apos;ve applied for. Update status as the bank responds.
        </p>
      </div>

      {cardChoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p>Catalogue empty.</p>
          </CardContent>
        </Card>
      ) : (
        <ApplicationsClient initial={applications} cards={cardChoices} />
      )}
    </div>
  )
}
