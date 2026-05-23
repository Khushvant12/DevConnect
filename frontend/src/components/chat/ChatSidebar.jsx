import { Link } from 'react-router-dom';

export default function ChatSidebar({
  conversations,
  activeUserId,
  onSelect,
  loading,
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        No conversations yet.
        <br />
        <Link to="/developers" className="mt-2 inline-block text-brand-600 hover:underline">
          Find developers →
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
      {conversations.map((c) => {
        const partner = c.partner;
        const active = String(partner?._id) === String(activeUserId);
        const last = c.lastMessage;

        return (
          <li key={c.conversationId}>
            <button
              type="button"
              onClick={() => onSelect(partner)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                active ? 'bg-brand-50 dark:bg-brand-900/20' : ''
              }`}
            >
              <div className="relative shrink-0">
                {partner?.avatar ? (
                  <img src={partner.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {partner?.name?.charAt(0)}
                  </div>
                )}
                {c.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-slate-900 dark:text-white">
                    {partner?.name}
                  </span>
                  {c.unreadCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-bold text-white">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500">
                  {last?.content || 'No messages'}
                </p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
