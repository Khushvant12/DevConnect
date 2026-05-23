import { Link } from 'react-router-dom';
import SkillBadge from './SkillBadge.jsx';
import Button from '../ui/Button.jsx';
import { EXPERIENCE_LABELS } from '../../utils/profileCompletion.js';

export default function ProfileHeader({
  profile,
  isOwner = false,
  onEdit,
  profileCompletion = 0,
}) {
  const initials = profile?.name?.charAt(0)?.toUpperCase() || '?';
  const github =
    profile?.githubProfile || profile?.socialLinks?.github;
  const linkedin = profile?.socialLinks?.linkedin;
  const portfolio = profile?.socialLinks?.portfolio;

  return (
    <div className="card overflow-hidden p-0">
      <div className="h-24 bg-gradient-to-r from-brand-600 to-brand-400 sm:h-32" />
      <div className="relative px-6 pb-6">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg dark:border-slate-900 sm:h-28 sm:w-28"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-3xl font-bold text-brand-700 shadow-lg dark:border-slate-900 dark:bg-brand-900 dark:text-brand-300 sm:h-28 sm:w-28">
              {initials}
            </div>
          )}
          <div className="flex flex-wrap gap-2 sm:pb-1">
            {isOwner && onEdit && (
              <Button variant="secondary" onClick={onEdit}>
                Edit profile
              </Button>
            )}
            {isOwner && (
              <Link to="/dashboard">
                <Button variant="secondary">Dashboard</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profile?.name}
          </h1>
          <p className="font-mono text-brand-600 dark:text-brand-400">
            @{profile?.username}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            {profile?.location && <span>{profile.location}</span>}
            {profile?.company && <span>{profile.company}</span>}
            {profile?.experienceLevel && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                {EXPERIENCE_LABELS[profile.experienceLevel] || profile.experienceLevel}
              </span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Profile completion</span>
              <span className="font-semibold text-brand-600">{profileCompletion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        )}

        {profile?.bio && (
          <p className="mt-4 text-slate-600 dark:text-slate-300">{profile.bio}</p>
        )}

        {profile?.education && (
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-medium">Education:</span> {profile.education}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {github && (
            <a
              href={github.startsWith('http') ? github : `https://github.com/${github}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              GitHub
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              LinkedIn
            </a>
          )}
          {portfolio && (
            <a
              href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
            >
              Portfolio
            </a>
          )}
        </div>

        {(profile?.skills?.length > 0 || profile?.techStack?.length > 0) && (
          <div className="mt-6 space-y-3">
            {profile.skills?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <SkillBadge key={s} label={s} />
                  ))}
                </div>
              </div>
            )}
            {profile.techStack?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">Tech stack</p>
                <div className="flex flex-wrap gap-2">
                  {profile.techStack.map((t) => (
                    <SkillBadge key={t} label={t} variant="tech" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
