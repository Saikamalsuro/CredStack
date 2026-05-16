"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[app/error] Unhandled error:", error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">Something broke</h1>
      <p className="text-muted-foreground mb-2 max-w-md mx-auto">
        We hit an unexpected error rendering this page. The team has been notified.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground mb-8 font-mono">
          Reference: {error.digest}
        </p>
      ) : (
        <div className="mb-8" />
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  )
}
