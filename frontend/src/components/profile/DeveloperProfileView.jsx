import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService.js';
import { EXPERIENCE_LABELS } from '../../utils/profileCompletion.js';
import SkillBadge from './SkillBadge.jsx';
import ProfileStatsBar from './ProfileStatsBar.jsx';
import ProfileSocialLinks from './ProfileSocialLinks.jsx';
import ProfileProjectCard from './ProfileProjectCard.jsx';
import ProfileProjectCardSkeleton from './ProfileProjectCardSkeleton.jsx';
import Button from '../ui/Button.jsx';

function ProfileSection({ title, description, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      <div className="mb-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function MetaItem({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
      <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
        {icon}
      </span>
      {children}
    </span>
  );
}

export default function DeveloperProfileView({
  profile,
  isOwner = false,
  onEdit,
  profileCompletion = 0,
  actions,
}) {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const initials = profile?.name?.charAt(0)?.toUpperCase() || '?';
  const experienceLabel =
    EXPERIENCE_LABELS[profile?.experienceLevel] || profile?.experienceLevel;

  useEffect(() => {
    if (!profile?.username) return;

    let cancelled = false;
    const loadProjects = async () => {
      setProjectsLoading(true);
      try {
        const { data } = await projectService.getAll({
          developer: profile.username,
          limit: 6,
          sort: 'latest',
        });
        if (!cancelled) setProjects(data.data.projects || []);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    };

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [profile?.username]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero */}
      <div className="glass-card overflow-hidden p-0">
        <div
          className="relative h-28 bg-gradient-to-r from-brand-500/20 via-violet-500/20 to-emerald-500/15 sm:h-36 md:h-40 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        </div>

        <div className="relative px-4 pb-6 sm:px-6 md:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-card-hover ring-2 ring-brand-500/20 dark:border-slate-900 sm:h-28 sm:w-28 md:h-32 md:w-32"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-brand-100 to-brand-200 text-3xl font-bold text-brand-700 shadow-card-hover dark:border-slate-900 dark:from-brand-900 dark:to-brand-950 dark:text-brand-300 sm:h-28 sm:w-28 md:h-32 md:w-32">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0 pb-1 md:max-w-xl">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  {profile?.name}
                </h1>
                <p className="mt-1 font-mono text-sm text-brand-600 dark:text-brand-400">
                  @{profile?.username}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {profile?.location && (
                    <MetaItem
                      icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      }
                    >
                      {profile.location}
                    </MetaItem>
                  )}
                  {profile?.company && (
                    <MetaItem
                      icon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                    >
                      {profile.company}
                    </MetaItem>
                  )}
                  {experienceLabel && (
                    <span className="badge-brand">{experienceLabel}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:shrink-0 md:justify-end">
              {isOwner && onEdit && (
                <Button variant="secondary" onClick={onEdit}>
                  Edit profile
                </Button>
              )}
              {isOwner && (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}
              {actions}
            </div>
          </div>

          <div className="mt-6">
            <ProfileStatsBar profile={profile} projectCount={projects.length} />
          </div>

          {isOwner && (
            <div className="mt-5 rounded-xl border border-brand-200/60 bg-brand-50/50 p-4 dark:border-brand-900/50 dark:bg-brand-950/30">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Profile strength
                </span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {profileCompletion}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-700 ease-smooth"
                  style={{ width: `${profileCompletion}%` }}
                  role="progressbar"
                  aria-valuenow={profileCompletion}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              {profileCompletion < 100 && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Complete your bio, skills, and links to stand out to collaborators.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {(profile?.bio || profile?.education) && (
            <ProfileSection title="About" description="Background and introduction">
              {profile?.bio && (
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {profile.bio}
                </p>
              )}
              {profile?.education && (
                <div className={`${profile?.bio ? 'mt-4 border-t border-slate-100 pt-4 dark:border-slate-800' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Education
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {profile.education}
                  </p>
                </div>
              )}
            </ProfileSection>
          )}

          {(profile?.skills?.length > 0 || profile?.techStack?.length > 0) && (
            <ProfileSection
              title="Skills & technologies"
              description="Expertise and tools this developer works with"
            >
              <div className="space-y-5">
                {profile.skills?.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Core skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((s) => (
                        <SkillBadge key={s} label={s} variant="skill" />
                      ))}
                    </div>
                  </div>
                )}
                {profile.techStack?.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tech stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.techStack.map((t) => (
                        <SkillBadge key={t} label={t} variant="tech" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ProfileSection>
          )}

          <ProfileSection
            title="Projects"
            description={
              projects.length > 0
                ? `Public projects by @${profile?.username}`
                : 'Published work on DevConnect'
            }
          >
            {projectsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <ProfileProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-700">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  No projects published yet
                </p>
                {isOwner && (
                  <Link
                    to="/feed"
                    className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                  >
                    Share your first project →
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((p) => (
                    <ProfileProjectCard key={p._id} project={p} />
                  ))}
                </div>
                <Link
                  to="/feed"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  Browse project feed
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </ProfileSection>
        </div>

        <aside className="space-y-6">
          <ProfileSection title="Connect" description="Social profiles and links">
            <ProfileSocialLinks profile={profile} />
          </ProfileSection>

          {!profile?.bio && !isOwner && (
            <div className="card border-dashed bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This developer hasn&apos;t added a bio yet.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
