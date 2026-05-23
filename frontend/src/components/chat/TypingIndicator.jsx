export default function TypingIndicator({ name, showAvatar, avatarUrl }) {
  return (
    <div className="mt-3 flex gap-2.5 animate-fade-in">
      <div className="w-8 shrink-0">
        {showAvatar !== false && (
          avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover opacity-80" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700">
              {name?.charAt(0) || '?'}
            </div>
          )
        )}
      </div>
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-4 py-3 shadow-sm dark:border-slate-700/80 dark:bg-slate-800">
          <span className="flex items-center gap-1" aria-hidden="true">
            <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="typing-dot h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
          </span>
        </div>
        <span className="sr-only">{name ? `${name} is typing` : 'Someone is typing'}</span>
        <p className="mt-1 px-1 text-[11px] text-slate-400 dark:text-slate-500" aria-hidden="true">
          {name ? `${name} is typing…` : 'Typing…'}
        </p>
      </div>
    </div>
  );
}
