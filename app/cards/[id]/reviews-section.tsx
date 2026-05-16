"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, BadgeCheck, MessageSquare } from "lucide-react"
import type { CardReview, ReviewSummary, ExpertReview } from "@/lib/db/reviews"
import { postReviewAction, toggleHelpfulVoteAction } from "./review-actions"

interface Props {
  cardSlug: string
  cardName: string
  summary: ReviewSummary
  reviews: CardReview[]
  expertReviews: ExpertReview[]
  isAuthed: boolean
  reviewGate: number
}

export function ReviewsSection({
  cardSlug,
  cardName,
  summary,
  reviews,
  expertReviews,
  isAuthed,
  reviewGate,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [error, setError] = useState<string | null>(null)

  const gated = summary.count < reviewGate

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (body.trim().length < 50) {
      setError("Review body must be at least 50 characters")
      return
    }
    startTransition(async () => {
      const res = await postReviewAction({ cardSlug, rating, title: title || undefined, body: body.trim() })
      if (res.error) {
        setError(res.error)
        return
      }
      setBody("")
      setTitle("")
      setShowForm(false)
      router.refresh()
    })
  }

  return (
    <section className="space-y-6">
      {expertReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Expert review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expertReviews.map((e) => (
              <article key={e.id} className="space-y-3">
                <header className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-medium">{e.reviewerName}</p>
                    {e.reviewerTitle && <p className="text-xs text-muted-foreground">{e.reviewerTitle}</p>}
                  </div>
                  {e.rating && (
                    <div className="inline-flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{e.rating.toFixed(1)}</span>
                    </div>
                  )}
                </header>
                {e.useCase && <Badge variant="outline" className="text-xs">{e.useCase}</Badge>}
                {e.shortSummary && (
                  <p className="text-sm font-medium text-foreground/90 border-l-2 border-primary pl-3 italic">
                    {e.shortSummary}
                  </p>
                )}
                <p className="text-sm whitespace-pre-line">{e.body}</p>
                {(e.pros.length > 0 || e.cons.length > 0) && (
                  <div className="grid sm:grid-cols-2 gap-3 text-sm pt-2">
                    {e.pros.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-success mb-1">Pros</p>
                        <ul className="space-y-0.5 text-muted-foreground">
                          {e.pros.map((p, i) => <li key={i}>• {p}</li>)}
                        </ul>
                      </div>
                    )}
                    {e.cons.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-destructive mb-1">Cons</p>
                        <ul className="space-y-0.5 text-muted-foreground">
                          {e.cons.map((c, i) => <li key={i}>• {c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                User reviews
              </CardTitle>
              <CardDescription>
                {gated
                  ? `${summary.count} of ${reviewGate} reviews needed before display`
                  : `${summary.average.toFixed(1)} average across ${summary.count} reviews`}
              </CardDescription>
            </div>
            {isAuthed && (
              <Button size="sm" variant={showForm ? "outline" : "default"} onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Cancel" : "Write a review"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthed && (
            <p className="text-sm text-muted-foreground">Sign in to post a review on {cardName}.</p>
          )}

          {showForm && (
            <form onSubmit={submit} className="space-y-3 p-4 border rounded-md">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Review (50-500 chars)</Label>
                <textarea
                  id="body"
                  className="w-full min-h-[100px] rounded-md border bg-background p-2 text-sm"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{body.length}/500</p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Posting..." : "Post review"}
              </Button>
            </form>
          )}

          {gated ? (
            <p className="text-sm text-muted-foreground">
              Reviews are hidden until {reviewGate} cardholders post. Be one of the first.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm pb-3 border-b">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-lg">{summary.average.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">across {summary.count} reviews</span>
              </div>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} isAuthed={isAuthed} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function ReviewCard({ review, isAuthed }: { review: CardReview; isAuthed: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [count, setCount] = useState(review.helpfulCount)

  function vote() {
    if (!isAuthed) return
    startTransition(async () => {
      const res = await toggleHelpfulVoteAction(review.id)
      if (res.voted) setCount((c) => c + 1)
      else setCount((c) => Math.max(0, c - 1))
      router.refresh()
    })
  }

  return (
    <article className="p-4 border rounded-md space-y-2">
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-3.5 w-3.5 ${n <= Math.round(review.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
            />
          ))}
        </div>
        <span className="font-medium">{review.userName ?? "Anonymous"}</span>
        {review.isVerifiedCardholder && (
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
            <BadgeCheck className="h-3 w-3 mr-0.5" />
            Verified
          </Badge>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
      {review.title && <p className="font-medium text-sm">{review.title}</p>}
      <p className="text-sm text-muted-foreground whitespace-pre-line">{review.body}</p>
      <div className="flex items-center gap-2 pt-1">
        <Button variant="ghost" size="sm" disabled={!isAuthed || isPending} onClick={vote}>
          <ThumbsUp className="h-3 w-3 mr-1.5" />
          Helpful ({count})
        </Button>
      </div>
    </article>
  )
}
