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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Welcome back, {profile?.name?.split(' ')[0]}
            </p>
          </div>
          <Button onClick={() => setEditOpen(true)}>Edit profile</Button>
        </div>

        {error && <Alert>{error}</Alert>}

        {/* User info card */}
        <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-500"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-900">
              {profile?.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{profile?.name}</h2>
            <p className="text-sm text-slate-500">@{profile?.username} · {profile?.email}</p>
            {profile?.bio && (
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {profile.bio}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-brand-600">{completion}%</p>
            <p className="text-xs text-slate-500">Profile complete</p>
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
                <li className="text-sm text-slate-500">No activity yet</li>
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
                className="rounded-lg border border-slate-200 px-4 py-3 text-left text-sm font-medium transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-brand-900/20"
              >
                Complete your profile
              </button>
              <Link
                to="/developers"
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-brand-900/20"
              >
                Search developers
              </Link>
              <Link
                to={`/developers/${profile?.username}`}
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium transition hover:border-brand-300 dark:border-slate-700"
              >
                View public profile
              </Link>
              <Link
                to="/feed"
                className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium transition hover:border-brand-300 dark:border-slate-700"
              >
                Post a project
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholders */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Link to="/saved" className="card border-dashed transition hover:border-brand-300 dark:hover:border-brand-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Saved projects</h2>
            <p className="mt-2 text-2xl font-bold text-brand-600">{stats.savedProjectsCount ?? 0}</p>
            <p className="mt-1 text-sm text-slate-500">View bookmarks →</p>
          </Link>
          <Link to="/team-requests" className="card border-dashed transition hover:border-brand-300 dark:hover:border-brand-700">
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
