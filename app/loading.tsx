export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 w-1/3 rounded bg-muted mb-4" />
      <div className="h-4 w-2/3 rounded bg-muted/70 mb-10" />
      <div className="grid sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted/60" />
        ))}
      </div>
    </div>
  )
}
