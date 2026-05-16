import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { getUserCards } from "@/lib/db/user-cards"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, CreditCard as CreditCardIcon, CalendarClock, IndianRupee } from "lucide-react"
import { MyCardRow } from "./my-card-row"

export const metadata: Metadata = {
  title: "My Cards | CredStack",
  description: "Manage the credit cards you hold.",
}

export default async function MyCardsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/cards")

  const userCards = await getUserCards(user.id)

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My cards</h1>
          <p className="text-muted-foreground">
            {userCards.length === 0
              ? "Add the credit cards you actually hold to unlock personalised insights."
              : `${userCards.length} card${userCards.length === 1 ? "" : "s"} in your portfolio`}
          </p>
        </div>
        <Button asChild>
          <Link href="/cards">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add a card
          </Link>
        </Button>
      </div>

      {userCards.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <CreditCardIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-medium mb-2">No cards yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Tap a card from the catalogue, scroll to the detail page, and press &quot;Add to portfolio&quot;.
              We use last-4 digits + statement / due day only — never the full card number.
            </p>
            <Button asChild>
              <Link href="/cards">Browse catalogue</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {userCards.map((uc) => (
            <MyCardRow
              key={uc.id}
              userCardId={uc.id}
              card={uc.card}
              lastFour={uc.cardLastFour}
              nickname={uc.nickname}
              statementDay={uc.statementDay}
              dueDay={uc.dueDay}
              creditLimit={uc.creditLimit}
              isPrimary={uc.isPrimary}
            />
          ))}
        </div>
      )}

      <Card className="mt-8 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            What we store
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1.5 text-muted-foreground">
          <p>• <strong>Last 4 digits</strong> only — to distinguish cards. No full card number, CVV, or expiry.</p>
          <p>• <strong>Statement and due day</strong> — to surface upcoming due dates.</p>
          <p>• <strong>Credit limit</strong> — for utilisation tracking. Optional.</p>
          <p>• All data is RLS-protected: only you can read your portfolio.</p>
        </CardContent>
      </Card>
    </div>
  )
}
