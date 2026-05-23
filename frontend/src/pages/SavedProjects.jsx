import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import { useToast } from '../context/ToastContext.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function SavedProjects() {
  const { showToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await projectService.getSaved();
      setProjects(data.data.projects);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLike = async (project) => {
    setActionId(project._id);
    try {
      const { data } = await projectService.toggleLike(project._id);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id
            ? { ...p, isLiked: data.data.liked, likesCount: data.data.likesCount }
            : p
        )
      );
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleSave = async (project) => {
    setActionId(project._id);
    try {
      const { data } = await projectService.toggleSave(project._id);
      if (!data.data.saved) {
        setProjects((prev) => prev.filter((p) => p._id !== project._id));
        showToast('Removed from saved');
      }
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved projects</h1>
          <p className="text-slate-500">Bookmarks you&apos;ve saved for later</p>
        </div>

        {error && <Alert>{error}</Alert>}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="text-slate-600 dark:text-slate-400">No saved projects yet.</p>
            <Link to="/feed" className="mt-4 inline-block text-brand-600 hover:underline">
              Browse the feed →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={{ ...p, isSaved: true }}
                onLike={handleLike}
                onSave={handleSave}
                likeLoading={actionId === p._id}
                saveLoading={actionId === p._id}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
