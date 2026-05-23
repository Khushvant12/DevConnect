export default function FeedLayout({ sidebar, children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="lg:col-span-1">{sidebar}</div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
