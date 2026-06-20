import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../services/profileService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await profileService.getMyProfile();
      setData(res.data);
      await refreshUser();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const profile = data?.profile || user;
  const stats = data?.stats || {};
  const completion = data?.profileCompletion ?? 0;
  const activity = data?.recentActivity || [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back, ${profile?.name?.split(' ')[0] || 'there'}`}
          actions={<Button onClick={() => setEditOpen(true)}>Edit profile</Button>}
        />

        {error && <Alert>{error}</Alert>}

        {/* User info card */}
        <div className="glass-card p-6 flex flex-col gap-6 sm:flex-row sm:items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-brand-500/5 blur-2xl" />
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-500/30"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10 text-xl font-bold text-brand-500">
              {profile?.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{profile?.name}</h2>
            <p className="text-sm text-slate-500">@{profile?.username} · {profile?.email}</p>
            {profile?.bio && (
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {profile.bio}
              </p>
            )}
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-4xl font-extrabold bg-gradient-to-br from-brand-400 to-brand-600 bg-clip-text text-transparent">{completion}%</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Profile Complete</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Skills" value={stats.skillsCount ?? 0} accent="brand" />
          <StatCard label="Tech stack" value={stats.techStackCount ?? 0} accent="violet" />
          <StatCard
            label="Saved projects"
            value={stats.savedProjectsCount ?? 0}
            hint="Module 4"
            accent="emerald"
          />
          <StatCard
            label="Collaboration posts"
            value={stats.collaborationRequestsCount ?? 0}
            hint="Module 5"
            accent="amber"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent activity */}
          <div className="card">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent activity</h2>
            <ul className="mt-4 space-y-3">
              {activity.length === 0 ? (
                <li className="py-4 text-center text-sm text-slate-500">No activity yet — post a project or connect with developers.</li>
              ) : (
                activity.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-slate-100 pb-3 text-sm last:border-0 dark:border-slate-800"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{item.message}</span>
                    <span className="shrink-0 text-slate-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h2 className="font-semibold text-slate-900 dark:text-white">Quick actions</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="rounded-xl border border-slate-200 px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                Complete your profile
              </button>
              <Link
                to="/developers"
                className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                Search developers
              </Link>
              <Link
                to={`/developers/${profile?.username}`}
                className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                View public profile
              </Link>
              <Link
                to="/feed"
                className="rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:shadow-sm dark:border-slate-700 dark:hover:border-brand-700 dark:hover:bg-brand-950/30"
              >
                Post a project
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Link to="/saved" className="card-interactive border-dashed">
            <h2 className="font-semibold text-slate-900 dark:text-white">Saved projects</h2>
            <p className="mt-2 text-2xl font-bold text-brand-600">{stats.savedProjectsCount ?? 0}</p>
            <p className="mt-1 text-sm text-slate-500">View bookmarks →</p>
          </Link>
          <Link to="/team-requests" className="card-interactive border-dashed">
            <h2 className="font-semibold text-slate-900 dark:text-white">Collaboration requests</h2>
            <p className="mt-2 text-sm text-slate-500">View team-up invites →</p>
          </Link>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSaved={() => loadDashboard()}
      />
    </DashboardLayout>
  );
}
