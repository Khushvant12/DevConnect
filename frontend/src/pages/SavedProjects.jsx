import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import { useToast } from '../context/ToastContext.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton.jsx';
import Alert from '../components/ui/Alert.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';

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
        <PageHeader
          title="Saved projects"
          subtitle="Bookmarks you've saved for later"
        />

        {error && <Alert>{error}</Alert>}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            }
            title="No saved projects yet"
            description="Save projects from the feed to revisit them here."
            action={
              <Link to="/feed">
                <Button>Browse feed</Button>
              </Link>
            }
          />
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
