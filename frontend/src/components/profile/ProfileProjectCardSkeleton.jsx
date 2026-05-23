export default function ProfileProjectCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0" aria-hidden="true">
      <div className="skeleton h-36 w-full rounded-none" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
        <div className="skeleton h-3 w-2/3 rounded-lg" />
      </div>
    </div>
  );
}
