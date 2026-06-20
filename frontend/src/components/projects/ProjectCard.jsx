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
    <article className="glass-card group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
      {/* Thumbnail or Fallback */}
      <Link to={`/projects/${project._id}`} className="relative block aspect-[16/10] w-full overflow-hidden border-b border-slate-200/50 dark:border-white/5">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 via-brand-50/50 to-brand-100/50 dark:from-slate-900/60 dark:via-brand-950/20 dark:to-brand-900/40">
            <span className="font-mono text-5xl font-bold text-brand-500/20 dark:text-brand-400/10">
              {'</>'}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="badge capitalize backdrop-blur-md bg-white/75 dark:bg-slate-950/70 border-white/10">{project.category}</span>
          <span className="badge capitalize backdrop-blur-md bg-white/75 dark:bg-slate-950/70 border-white/10">{project.difficulty}</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        <Link to={`/projects/${project._id}`} className="block">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200 group-hover:text-brand-500 dark:group-hover:text-brand-400">
            {project.title}
          </h3>
        </Link>

        {/* Developer link */}
        <Link
          to={`/developers/${author?.username}`}
          className="mt-3 flex items-center gap-2.5 rounded-lg py-1 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {author?.avatar ? (
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="h-7 w-7 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/10 text-[10px] font-bold text-brand-500">
              {author?.name?.charAt(0)}
            </div>
          )}
          <span className="text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{author?.name}</span>
            <span className="opacity-70"> · @{author?.username}</span>
          </span>
        </Link>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(project.techStack || []).slice(0, 4).map((t) => (
            <TechBadge key={t} label={t} />
          ))}
          {(project.techStack || []).length > 4 && (
            <span className="badge font-mono text-[10px] font-semibold text-slate-400">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>

        {/* Divider & Actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {project.commentsCount ?? 0} comments
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
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
