import { Link } from 'react-router-dom';
import TechBadge from '../projects/TechBadge.jsx';

export default function ProfileProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="card-interactive group overflow-hidden p-0"
    >
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt=""
          className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50 dark:from-slate-800 dark:to-brand-950">
          <span className="font-mono text-3xl font-bold text-brand-500/25">{'</>'}</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {(project.techStack || []).slice(0, 3).map((t) => (
              <TechBadge key={t} label={t} />
            ))}
          </div>
          <span className="text-xs text-slate-400">
            {project.likesCount ?? 0} likes
          </span>
        </div>
      </div>
    </Link>
  );
}
