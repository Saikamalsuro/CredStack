export default function CardsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-9 w-56 rounded bg-muted mb-2" />
      <div className="h-4 w-80 rounded bg-muted/70 mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-56 rounded-lg bg-muted/50" />
        ))}
      </div>
    </div>
  )
}
