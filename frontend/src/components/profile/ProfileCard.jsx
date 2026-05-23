import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge.jsx';

export default function ProfileCard({ profile }) {
  const initials = profile?.name?.charAt(0)?.toUpperCase() || '?';
  const skillCount = (profile?.skills?.length ?? 0) + (profile?.techStack?.length ?? 0);

  return (
    <Link
      to={`/developers/${profile.username}`}
      className="card-interactive group block overflow-hidden p-0"
    >
      <div className="h-16 bg-gradient-to-r from-slate-800 to-brand-800 opacity-90 transition group-hover:opacity-100" />
      <div className="relative px-5 pb-5">
        <div className="-mt-8 mb-3 flex items-end justify-between">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="h-14 w-14 rounded-xl border-4 border-white object-cover shadow-md ring-2 ring-brand-500/20 dark:border-slate-900"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-white bg-gradient-to-br from-brand-100 to-brand-200 text-lg font-bold text-brand-700 shadow-md dark:border-slate-900 dark:from-brand-900 dark:to-brand-950 dark:text-brand-300">
              {initials}
            </div>
          )}
          {profile.profileCompletion !== undefined && (
            <span className="badge-brand tabular-nums">{profile.profileCompletion}%</span>
          )}
        </div>

        <h3 className="truncate font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {profile.name}
        </h3>
        <p className="font-mono text-xs text-slate-500">@{profile.username}</p>

        {profile.location && (
          <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-slate-500">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {profile.location}
          </p>
        )}

        {profile.bio && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {profile.bio}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(profile.skills || []).slice(0, 3).map((s) => (
            <SkillBadge key={s} label={s} size="sm" />
          ))}
          {(profile.techStack || []).slice(0, 2).map((t) => (
            <SkillBadge key={t} label={t} variant="tech" size="sm" />
          ))}
          {skillCount > 5 && (
            <span className="badge text-[11px]">+{skillCount - 5}</span>
          )}
        </div>

        {profile.profileCompletion !== undefined && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
                style={{ width: `${profile.profileCompletion}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
