import { EXPERIENCE_LABELS } from '../../utils/profileCompletion.js';

function StatItem({ label, value, icon }) {
  return (
    <div className="glass-card flex flex-col items-center px-4 py-3.5 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 sm:px-5">
      <span className="mb-1 text-slate-400 dark:text-slate-500" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default function ProfileStatsBar({ profile, projectCount = 0 }) {
  const skillsCount = profile?.skills?.length ?? 0;
  const techCount = profile?.techStack?.length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      <StatItem
        label="Skills"
        value={skillsCount}
        icon={
          <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
      />
      <StatItem
        label="Tech stack"
        value={techCount}
        icon={
          <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        }
      />
      <StatItem
        label="Projects"
        value={projectCount}
        icon={
          <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      <StatItem
        label="Level"
        value={
          profile?.experienceLevel
            ? (EXPERIENCE_LABELS[profile.experienceLevel] || profile.experienceLevel).split(' ')[0]
            : '—'
        }
        icon={
          <svg className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />
    </div>
  );
}
