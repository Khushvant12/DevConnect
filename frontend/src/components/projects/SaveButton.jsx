export default function SaveButton({ saved, onClick, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        saved
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
      }`}
      title={saved ? 'Saved' : 'Save project'}
    >
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  );
}
