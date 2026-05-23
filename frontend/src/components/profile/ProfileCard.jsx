import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge.jsx';

export default function ProfileCard({ profile }) {
  const initials = profile?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <Link
      to={`/developers/${profile.username}`}
      className="card group block transition hover:border-brand-300 hover:shadow-md dark:hover:border-brand-700"
    >
      <div className="flex items-start gap-4">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200 group-hover:ring-brand-400 dark:ring-slate-700"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {profile.name}
          </h3>
          <p className="font-mono text-xs text-slate-500">@{profile.username}</p>
          {profile.location && (
            <p className="mt-1 truncate text-xs text-slate-500">{profile.location}</p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {profile.bio}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(profile.skills || []).slice(0, 4).map((s) => (
          <SkillBadge key={s} label={s} />
        ))}
        {(profile.techStack || []).slice(0, 3).map((t) => (
          <SkillBadge key={t} label={t} variant="tech" />
        ))}
      </div>

      {profile.profileCompletion !== undefined && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-500">
            <span>Profile</span>
            <span>{profile.profileCompletion}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${profile.profileCompletion}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
