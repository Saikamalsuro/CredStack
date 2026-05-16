import type { ReactNode } from "react"

interface Props {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}

export function StaticPageShell({ eyebrow, title, description, children }: Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="mb-10">
        {eyebrow ? (
          <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-4">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
        ) : null}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h3:text-lg prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
        {children}
      </div>
    </div>
  )
}
