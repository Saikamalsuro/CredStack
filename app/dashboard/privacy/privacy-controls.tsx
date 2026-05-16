"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Trash2, AlertTriangle } from "lucide-react"
import { downloadDataAction, deleteAccountAction } from "./actions"

export function PrivacyControls({ userEmail }: { userEmail: string | null }) {
  const router = useRouter()
  const [isExporting, startExportTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleExport() {
    setError(null)
    startExportTransition(async () => {
      const res = await downloadDataAction()
      if (res.error || !res.json) {
        setError(res.error ?? "Export failed")
        return
      }
      const blob = new Blob([res.json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `credstack-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  function handleDelete() {
    if (confirmText !== "DELETE") {
      setError('Type "DELETE" exactly to confirm')
      return
    }
    setError(null)
    startDeleteTransition(async () => {
      const res = await deleteAccountAction()
      if (res.error) {
        setError(res.error)
        return
      }
      // Account is gone — bounce to sign-in
      router.push("/auth/sign-in?deleted=1")
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Export your data</CardTitle>
          </div>
          <CardDescription>One JSON file with every row keyed to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Preparing..." : "Download my data"}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Generated server-side, streamed directly to your browser. We don&apos;t keep a copy of the export.
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle>Delete your account</CardTitle>
          </div>
          <CardDescription>Permanent. Every row keyed to your account is removed, including the auth record.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showConfirm ? (
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete my account
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-md bg-destructive/5 border border-destructive/30">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">This cannot be undone.</p>
                  <p className="text-muted-foreground">
                    Once submitted, {userEmail ?? "this account"} is removed and cannot sign in again. Download your data first if you want a copy.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Type DELETE to confirm</Label>
                <Input
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowConfirm(false)
                    setConfirmText("")
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || confirmText !== "DELETE"}
                >
                  {isDeleting ? "Deleting..." : "Permanently delete"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
