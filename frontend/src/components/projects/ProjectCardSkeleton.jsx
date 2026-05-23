export default function ProjectCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0" aria-hidden="true">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-8 rounded-full" />
          <div className="skeleton h-4 w-32" />
        </div>
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-6 w-14 rounded-lg" />
          <div className="skeleton h-6 w-14 rounded-lg" />
          <div className="skeleton h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
