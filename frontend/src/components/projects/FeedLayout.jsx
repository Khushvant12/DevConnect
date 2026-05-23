import { useState } from 'react';

export default function FeedLayout({ sidebar, children }) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="page-container animate-fade-in py-6 sm:py-8 lg:py-10">
      <button
        type="button"
        className="btn-secondary mb-4 w-full lg:hidden"
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {filtersOpen ? 'Hide filters' : 'Show filters'}
      </button>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <div className={`lg:block ${filtersOpen ? 'block' : 'hidden'}`}>{sidebar}</div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
