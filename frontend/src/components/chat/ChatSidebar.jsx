import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext.jsx';
import { formatMessageTime } from '../../utils/chatFormat.js';
import PresenceDot from './PresenceDot.jsx';

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
      <div className="skeleton h-12 w-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="skeleton h-4 w-28 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function ChatSidebar({
  conversations,
  activeUserId,
  onSelect,
  loading,
}) {
  const { isUserOnline } = useSocket();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations || [];
    const q = query.toLowerCase();
    return (conversations || []).filter((c) => {
      const p = c.partner;
      return (
        p?.name?.toLowerCase().includes(q) ||
        p?.username?.toLowerCase().includes(q)
      );
    });
  }, [conversations, query]);

  if (loading) {
    return (
      <div className="space-y-1 p-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <ConversationSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200/80 p-3 dark:border-slate-800">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="input-field !rounded-xl !py-2.5 !pl-9 !text-sm"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {!conversations?.length ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="font-medium text-slate-700 dark:text-slate-300">No conversations yet</p>
          <p className="mt-1 text-sm text-slate-500">Start chatting with developers</p>
          <Link
            to="/developers"
            className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Find developers →
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="p-6 text-center text-sm text-slate-500">No matches for &ldquo;{query}&rdquo;</p>
      ) : (
        <ul className="chat-scroll flex-1 space-y-0.5 overflow-y-auto p-2" role="listbox" aria-label="Conversations">
          {filtered.map((c) => {
            const partner = c.partner;
            const active = String(partner?._id) === String(activeUserId);
            const last = c.lastMessage;
            const online = isUserOnline(partner?._id) || c.isOnline;

            return (
              <li key={c.conversationId} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => onSelect(partner)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                    active
                      ? 'bg-brand-50 shadow-sm dark:bg-brand-950/50'
                      : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    {partner?.avatar ? (
                      <img
                        src={partner.avatar}
                        alt=""
                        className={`h-12 w-12 rounded-full object-cover ring-2 transition-all ${
                          active ? 'ring-brand-500/30' : 'ring-transparent'
                        }`}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-100 to-brand-200 text-sm font-bold text-brand-700 dark:from-brand-900 dark:to-brand-950 dark:text-brand-300">
                        {partner?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <PresenceDot online={online} size="md" />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`truncate font-semibold ${
                          active ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {partner?.name}
                      </span>
                      {last?.createdAt && (
                        <span className="shrink-0 text-[11px] text-slate-400">
                          {formatMessageTime(last.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                        {last?.content || (
                          <span className="italic text-slate-400">No messages yet</span>
                        )}
                      </p>
                      {c.unreadCount > 0 && (
                        <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                          {c.unreadCount > 99 ? '99+' : c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
                      @{partner?.username}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
