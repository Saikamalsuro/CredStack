export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="h-9 w-48 rounded bg-muted mb-2" />
      <div className="h-4 w-80 rounded bg-muted/70 mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted/60" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-lg bg-muted/40" />
        <div className="h-80 rounded-lg bg-muted/40" />
      </div>
    </div>
  )
}
