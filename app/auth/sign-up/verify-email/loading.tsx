export default function Loading() {
  return (
    <main className="mt-4">
      <div className="container">
        <div className="text-3xl font-bold tracking-tight">Verify Email</div>
        <div className="my-2 h-1 bg-muted">
          <div className="rounded p-4">
            <div className="h-2 bg-muted animated-pulse" />

            <div className="h-24 bg-muted animated-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
