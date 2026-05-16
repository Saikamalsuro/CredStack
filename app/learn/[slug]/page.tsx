import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ARTICLES, getArticle } from "@/lib/data/academy"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, CalendarDays, BookOpen } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

const RESERVED_SLUGS = new Set(["rewards", "first-credit-card"])

export async function generateStaticParams() {
  return ARTICLES.filter((a) => !RESERVED_SLUGS.has(a.slug)).map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return { title: "Not found | CredStack" }
  return {
    title: `${a.title} | CredStack Academy`,
    description: a.excerpt,
  }
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params

  // Defer to dedicated routes for reserved slugs.
  if (RESERVED_SLUGS.has(slug)) notFound()

  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/learn">
          <ArrowLeft className="h-4 w-4 mr-2" />
          All articles
        </Link>
      </Button>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className={LEVEL_COLOR[article.level]}>
              {LEVEL_LABEL[article.level]}
            </Badge>
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.readMinutes} min read
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              {formatDate(article.publishedAt)}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">{article.title}</h1>
          <p className="text-lg text-muted-foreground">{article.excerpt}</p>
        </header>

        <div className="space-y-6">
          {article.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="text-xl font-bold mb-3">{s.heading}</h2>}
              {s.body && (
                <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
                  {s.body}
                </p>
              )}
              {s.list && (
                <ul className="mt-3 space-y-2">
                  {s.list.map((item, j) => (
                    <li key={j} className="text-base leading-relaxed text-foreground/90">
                      • {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {article.relatedLinks.length > 0 && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Keep reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {article.relatedLinks.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="flex items-center justify-between p-2.5 rounded-md border hover:bg-muted/30 transition-colors text-sm"
                  >
                    <span>{r.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  )
}
