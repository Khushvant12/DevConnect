export default function ProjectCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden p-0">
      <div className="h-44 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
