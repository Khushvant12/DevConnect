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
    <article className="card group overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/projects/${project._id}`} className="block">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900">
            <span className="text-4xl font-bold text-brand-600/40">{'</>'}</span>
          </div>
        )}
      </Link>

      <div className="p-5">
        <Link to={`/projects/${project._id}`}>
          <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
            {project.title}
          </h3>
        </Link>

        <Link
          to={`/developers/${author?.username}`}
          className="mt-2 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {author?.avatar ? (
            <img src={author.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {author?.name?.charAt(0)}
            </div>
          )}
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {author?.name}{' '}
            <span className="text-slate-400">@{author?.username}</span>
          </span>
        </Link>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.techStack || []).slice(0, 5).map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{project.category}</span>
            <span>·</span>
            <span className="capitalize">{project.difficulty}</span>
            <span>·</span>
            <span>{project.commentsCount ?? 0} comments</span>
          </div>
          <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
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
