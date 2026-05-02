import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-destructive/10 p-3 rounded-xl w-fit">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-display">Something went wrong</CardTitle>
          <CardDescription>
            The link is invalid or has expired. Please try logging in again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
