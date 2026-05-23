import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Overview', icon: '◉' },
  { to: '/feed', label: 'Project feed', icon: '▣' },
  { to: '/chat', label: 'Messages', icon: '💬' },
  { to: '/team-requests', label: 'Team requests', icon: '🤝' },
  { to: '/saved', label: 'Saved projects', icon: '★' },
  { to: '/profile', label: 'My profile', icon: '◎' },
  { to: '/developers', label: 'Find developers', icon: '⌕' },
];

export default function DashboardSidebar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
    }`;

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="card sticky top-20 p-4">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="truncate font-mono text-xs text-slate-500">@{user?.username}</p>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} className={linkClass}>
              <span className="text-base opacity-70">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
