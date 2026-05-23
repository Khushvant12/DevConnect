const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'ai-ml', label: 'AI / ML' },
  { value: 'devops', label: 'DevOps' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'game', label: 'Game' },
  { value: 'open-source', label: 'Open Source' },
  { value: 'other', label: 'Other' },
];

const DIFFICULTIES = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'liked', label: 'Most liked' },
  { value: 'trending', label: 'Trending' },
];

export default function FilterSidebar({ filters, onChange }) {
  const set = (name, value) => onChange({ ...filters, [name]: value });

  return (
    <aside className="card space-y-5 p-4 lg:sticky lg:top-20">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Filters</h2>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Sort by
        </label>
        <select
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
          className="input-field"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => set('category', e.target.value)}
          className="input-field"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400">
          Difficulty
        </label>
        <select
          value={filters.difficulty}
          onChange={(e) => set('difficulty', e.target.value)}
          className="input-field"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
