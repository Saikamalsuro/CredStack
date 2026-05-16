import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/db/server"
import { getWishlist } from "@/lib/db/wishlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { WishlistRow } from "./wishlist-row"

export const metadata: Metadata = {
  title: "Wishlist | CredStack",
  description: "Cards saved for later. Move them into your portfolio when approved.",
}

export default async function WishlistPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/sign-in?redirect=/dashboard/wishlist")

  const items = await getWishlist(user.id)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <Bookmark className="h-3.5 w-3.5" />
          Wishlist
        </div>
        <h1 className="text-3xl font-bold mb-2">Cards to apply for later</h1>
        <p className="text-muted-foreground">
          Save cards you&apos;re researching. Move them to your portfolio once approved.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bookmark className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium mb-2">Nothing saved yet</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Open any card and tap the bookmark icon to add it here.
            </p>
            <Button asChild>
              <Link href="/cards">Browse cards</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{items.length} saved</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/compare?cards=${items.slice(0, 4).map((i) => i.cardSlug).join(",")}`}>
                Compare top 4
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <WishlistRow key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
