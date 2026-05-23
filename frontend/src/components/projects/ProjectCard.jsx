import { Link } from 'react-router-dom';
import TechBadge from './TechBadge.jsx';
import LikeButton from './LikeButton.jsx';
import SaveButton from './SaveButton.jsx';

export default function ProjectCard({
  project,
  onLike,
  onSave,
  likeLoading,
  saveLoading,
}) {
  const author = project.createdBy;

  return (
    <article className="card group overflow-hidden p-0 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-hover">
      <Link to={`/projects/${project._id}`} className="block overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt=""
            className="h-48 w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-100 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-brand-950 dark:to-brand-900">
            <span className="font-mono text-4xl font-bold text-brand-500/30 dark:text-brand-400/20">
              {'</>'}
            </span>
          </div>
        )}
      </Link>

      <div className="p-5">
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {project.title}
          </h3>
        </Link>

        <Link
          to={`/developers/${author?.username}`}
          className="mt-3 flex items-center gap-2.5 rounded-lg py-1 transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          onClick={(e) => e.stopPropagation()}
        >
          {author?.avatar ? (
            <img src={author.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
              {author?.name?.charAt(0)}
            </div>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">{author?.name}</span>
            <span className="text-slate-400"> · @{author?.username}</span>
          </span>
        </Link>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.techStack || []).slice(0, 5).map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="badge capitalize">{project.category}</span>
            <span className="badge capitalize">{project.difficulty}</span>
            <span>{project.commentsCount ?? 0} comments</span>
          </div>
          <div className="flex gap-1" onClick={(e) => e.preventDefault()}>
            <LikeButton
              liked={project.isLiked}
              count={project.likesCount ?? 0}
              onClick={() => onLike?.(project)}
              loading={likeLoading}
            />
            <SaveButton
              saved={project.isSaved}
              onClick={() => onSave?.(project)}
              loading={saveLoading}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
