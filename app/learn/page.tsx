import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, ArrowRight, Trophy, GraduationCap } from "lucide-react"
import { ARTICLES } from "@/lib/data/academy"

export const metadata: Metadata = {
  title: "Credit Academy — Learn Credit Cards (India) | CredStack",
  description:
    "Plain-English explanations of how credit cards, CIBIL scores, reward programmes, and forex markup actually work in India.",
}

const LEVEL_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const

const LEVEL_COLOR = {
  beginner: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  intermediate: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  advanced: "bg-rose-500/10 text-rose-700 border-rose-500/30",
}

export default function CreditAcademyPage() {
  const beginner = ARTICLES.filter((a) => a.level === "beginner")
  const intermediate = ARTICLES.filter((a) => a.level === "intermediate")
  const advanced = ARTICLES.filter((a) => a.level === "advanced")

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium mb-4">
          <BookOpen className="h-3.5 w-3.5" />
          Credit Academy
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Learn the mechanics, save the money</h1>
        <p className="text-muted-foreground">
          Banks profit when you don&apos;t read the small print. We explain the small print.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">First card guide</CardTitle>
            </div>
            <CardDescription>Beginner playbook with starter cards.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/learn/first-credit-card">Open guide</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Rewards programmes</CardTitle>
            </div>
            <CardDescription>HDFC, Amex, ICICI, SBI, Axis and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/learn/rewards">Compare programmes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">All articles</CardTitle>
            </div>
            <CardDescription>{ARTICLES.length} guides and counting.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Browse below by level.</p>
          </CardContent>
        </Card>
      </div>

      {beginner.length > 0 && (
        <ArticleGroup label="Beginner" articles={beginner} levelColor={LEVEL_COLOR.beginner} levelLabel={LEVEL_LABEL.beginner} />
      )}
      {intermediate.length > 0 && (
        <ArticleGroup label="Intermediate" articles={intermediate} levelColor={LEVEL_COLOR.intermediate} levelLabel={LEVEL_LABEL.intermediate} />
      )}
      {advanced.length > 0 && (
        <ArticleGroup label="Advanced" articles={advanced} levelColor={LEVEL_COLOR.advanced} levelLabel={LEVEL_LABEL.advanced} />
      )}
    </div>
  )
}

function ArticleGroup({
  label,
  articles,
  levelColor,
  levelLabel,
}: {
  label: string
  articles: typeof ARTICLES
  levelColor: string
  levelLabel: string
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4">{label}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {articles.map((a) => (
          <Card key={a.slug}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={levelColor}>{levelLabel}</Badge>
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {a.readMinutes} min read
                </div>
              </div>
              <CardTitle className="text-base leading-tight">{a.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm">{a.excerpt}</CardDescription>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/learn/${a.slug}`}>
                  Read article
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
