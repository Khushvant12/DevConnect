import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await notificationService.getAll({ limit: 15 });
      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    load();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ notification, unreadCount: count }) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 15));
      setUnreadCount(count);
    };
    socket.on('new_notification', handler);
    return () => socket.off('new_notification', handler);
  }, [socket]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  const handleClick = async (n) => {
    if (!n.read) {
      await notificationService.markRead(n._id);
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const markAll = async () => {
    await notificationService.markAllRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) load();
        }}
        className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="text-xs text-brand-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-slate-500">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li key={n._id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      !n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</p>
                    {n.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                    )}
                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
