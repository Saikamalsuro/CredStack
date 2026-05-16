import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">404</p>
      <h1 className="text-4xl sm:text-5xl font-bold mb-3">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        That page doesn&apos;t exist on CredStack. It may have been renamed or never existed. Use search or jump home.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cards">
            <Search className="h-4 w-4 mr-2" />
            Browse cards
          </Link>
        </Button>
      </div>
    </div>
  )
}
