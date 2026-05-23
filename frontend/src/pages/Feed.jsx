import { useCallback, useEffect, useRef, useState } from 'react';
import { projectService } from '../services/projectService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import { useToast } from '../context/ToastContext.jsx';
import FeedLayout from '../components/projects/FeedLayout.jsx';
import FilterSidebar from '../components/projects/FilterSidebar.jsx';
import SearchBar from '../components/projects/SearchBar.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton.jsx';
import CreateProjectModal from '../components/projects/CreateProjectModal.jsx';
import Button from '../components/ui/Button.jsx';

const emptySearch = { q: '', tech: '', developer: '' };

export default function Feed() {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState(emptySearch);
  const [filters, setFilters] = useState({ sort: 'latest', category: '', difficulty: '' });
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [actionId, setActionId] = useState(null);
  const loaderRef = useRef(null);

  const fetchProjects = useCallback(
    async (pageNum, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await projectService.getAll({
          ...search,
          ...filters,
          page: pageNum,
          limit: 9,
        });
        const list = data.data.projects;
        setProjects((prev) => (append ? [...prev, ...list] : list));
        setHasMore(data.data.pagination.hasMore);
        setPage(pageNum);
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [search, filters, showToast]
  );

  useEffect(() => {
    fetchProjects(1, false);
  }, [filters]);

  const handleSearch = () => {
    fetchProjects(1, false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) fetchProjects(page + 1, true);
  };

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  const handleLike = async (project) => {
    if (!isAuthenticated) {
      showToast('Log in to like projects', 'error');
      return;
    }
    setActionId(project._id);
    try {
      const { data } = await projectService.toggleLike(project._id);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id
            ? {
                ...p,
                isLiked: data.data.liked,
                likesCount: data.data.likesCount,
              }
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
    if (!isAuthenticated) {
      showToast('Log in to save projects', 'error');
      return;
    }
    setActionId(project._id);
    try {
      const { data } = await projectService.toggleSave(project._id);
      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id ? { ...p, isSaved: data.data.saved } : p
        )
      );
      showToast(data.data.saved ? 'Project saved' : 'Removed from saved');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <FeedLayout
        sidebar={
          <>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </>
        }
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Developer Feed</h1>
            <p className="text-slate-500">Discover projects from the community</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setCreateOpen(true)}>+ New project</Button>
          )}
        </div>

        <div className="card mb-6">
          <SearchBar values={search} onChange={setSearch} onSearch={handleSearch} loading={loading} />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No projects found</p>
            <p className="mt-2 text-sm text-slate-500">Try different filters or be the first to post!</p>
            {isAuthenticated && (
              <Button className="mt-6" onClick={() => setCreateOpen(true)}>
                Create project
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard
                  key={p._id}
                  project={p}
                  onLike={handleLike}
                  onSave={handleSave}
                  likeLoading={actionId === p._id}
                  saveLoading={actionId === p._id}
                />
              ))}
            </div>
            <div ref={loaderRef} className="mt-8 flex justify-center py-4">
              {loadingMore && (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
              )}
              {!hasMore && projects.length > 0 && (
                <p className="text-sm text-slate-400">You&apos;ve reached the end</p>
              )}
            </div>
          </>
        )}
      </FeedLayout>

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => fetchProjects(1, false)}
      />
    </>
  );
}
