import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/projectService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import { useToast } from '../context/ToastContext.jsx';
import TechBadge from '../components/projects/TechBadge.jsx';
import LikeButton from '../components/projects/LikeButton.jsx';
import SaveButton from '../components/projects/SaveButton.jsx';
import CommentSection from '../components/projects/CommentSection.jsx';
import EditProjectModal from '../components/projects/EditProjectModal.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await projectService.getById(id);
      setProject(data.data.project);
    } catch (err) {
      setError(getErrorMessage(err, 'Project not found'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const isOwner = user && project && String(project.createdBy?._id) === String(user._id);

  const handleLike = async () => {
    if (!isAuthenticated) return showToast('Log in to like', 'error');
    setActionLoading(true);
    try {
      const { data } = await projectService.toggleLike(id);
      setProject((p) => ({
        ...p,
        isLiked: data.data.liked,
        likesCount: data.data.likesCount,
      }));
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return showToast('Log in to save', 'error');
    setActionLoading(true);
    try {
      const { data } = await projectService.toggleSave(id);
      setProject((p) => ({ ...p, isSaved: data.data.saved }));
      showToast(data.data.saved ? 'Saved!' : 'Removed from saved');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await projectService.delete(id);
      showToast('Project deleted');
      navigate('/feed');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Alert>{error}</Alert>
        <Link to="/feed" className="mt-4 inline-block text-brand-600 hover:underline">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const author = project.createdBy;

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 py-8">
      <Link to="/feed" className="text-sm text-brand-600 hover:underline dark:text-brand-400">
        ← Back to feed
      </Link>

      <article className="card mt-4 overflow-hidden p-0">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt="" className="h-64 w-full object-cover" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950">
            <span className="text-5xl font-bold text-brand-500/30">{'</>'}</span>
          </div>
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h1>

          <Link
            to={`/developers/${author?.username}`}
            className="mt-4 inline-flex items-center gap-2"
          >
            {author?.avatar ? (
              <img src={author.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold">
                {author?.name?.charAt(0)}
              </div>
            )}
            <span className="font-medium">{author?.name}</span>
            <span className="text-slate-400">@{author?.username}</span>
          </Link>

          <p className="mt-6 whitespace-pre-wrap text-slate-600 dark:text-slate-300">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(project.techStack || []).map((t) => (
              <TechBadge key={t} label={t} />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="capitalize">Category: {project.category}</span>
            <span className="capitalize">Difficulty: {project.difficulty}</span>
            <span>Team: {project.teamSize}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn-secondary">
                GitHub
              </a>
            )}
            {project.liveDemoLink && (
              <a href={project.liveDemoLink} target="_blank" rel="noreferrer" className="btn-primary">
                Live demo
              </a>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6 dark:border-slate-800">
            <LikeButton
              liked={project.isLiked}
              count={project.likesCount}
              onClick={handleLike}
              loading={actionLoading}
            />
            <SaveButton saved={project.isSaved} onClick={handleSave} loading={actionLoading} />
            {isOwner && (
              <>
                <Button variant="secondary" onClick={() => setEditOpen(true)}>
                  Edit project
                </Button>
                <Button variant="secondary" onClick={handleDelete} className="!text-red-600">
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </article>

      <div className="mt-8">
        <CommentSection projectId={id} />
      </div>

      {isOwner && (
        <EditProjectModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          project={project}
          onUpdated={(p) => setProject(p)}
        />
      )}
    </div>
  );
}
