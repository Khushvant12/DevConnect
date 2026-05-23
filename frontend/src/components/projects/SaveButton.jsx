export default function SaveButton({ saved, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save project'}
      title={saved ? 'Saved' : 'Save project'}
      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-60 ${
        saved
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      <svg className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
