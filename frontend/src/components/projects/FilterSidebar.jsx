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

function FilterField({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange }) {
  const set = (name, value) => onChange({ ...filters, [name]: value });

  return (
    <aside className="card space-y-5 p-4 lg:sticky lg:top-20 lg:p-5" aria-label="Project filters">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h2>

      <FilterField label="Sort by" id="filter-sort">
        <select
          id="filter-sort"
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
      </FilterField>

      <FilterField label="Category" id="filter-category">
        <select
          id="filter-category"
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
      </FilterField>

      <FilterField label="Difficulty" id="filter-difficulty">
        <select
          id="filter-difficulty"
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
      </FilterField>
    </aside>
  );
}
