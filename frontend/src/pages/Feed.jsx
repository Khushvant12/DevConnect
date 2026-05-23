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
import PageHeader from '../components/ui/PageHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

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
        <PageHeader
          title="Developer feed"
          subtitle="Discover projects from the community"
          actions={
            isAuthenticated ? (
              <Button onClick={() => setCreateOpen(true)}>+ New project</Button>
            ) : null
          }
        />

        <div className="card mb-6 !p-5">
          <SearchBar values={search} onChange={setSearch} onSearch={handleSearch} loading={loading} />
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            title="No projects found"
            description="Try adjusting your filters or search terms, or be the first to share a project."
            action={
              isAuthenticated ? (
                <Button onClick={() => setCreateOpen(true)}>Create project</Button>
              ) : null
            }
          />
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
            <div ref={loaderRef} className="mt-8 flex justify-center py-6">
              {loadingMore && (
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" role="status" aria-label="Loading more" />
              )}
              {!hasMore && projects.length > 0 && (
                <p className="text-sm font-medium text-slate-400">You&apos;ve reached the end</p>
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
