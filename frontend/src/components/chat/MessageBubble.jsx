import { memo } from 'react';
import { formatBubbleTime } from '../../utils/chatFormat.js';

function MessageBubble({ message, isOwn, showAvatar, avatarUrl, senderName, isGrouped }) {
  const time = formatBubbleTime(message.createdAt);

  return (
    <div
      className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${
        isGrouped ? 'mt-0.5' : 'mt-3 first:mt-0'
      }`}
    >
      {!isOwn && (
        <div className="w-8 shrink-0">
          {showAvatar ? (
            avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {senderName?.charAt(0)}
              </div>
            )
          ) : (
            <span className="block h-8 w-8" aria-hidden="true" />
          )}
        </div>
      )}

      <div className={`flex max-w-[min(85%,28rem)] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {!isOwn && showAvatar && senderName && (
          <span className="mb-1 px-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {senderName}
          </span>
        )}
        <div
          className={`relative px-4 py-2.5 shadow-sm transition-colors ${
            isOwn
              ? `rounded-2xl bg-brand-600 text-white ${isGrouped ? 'rounded-tr-lg' : 'rounded-br-md'}`
              : `rounded-2xl border border-slate-200/80 bg-white text-slate-900 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-100 ${
                  isGrouped ? 'rounded-tl-lg' : 'rounded-bl-md'
                }`
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-relaxed">
            {message.content}
          </p>
        </div>
        <div
          className={`mt-1 flex items-center gap-1.5 px-1 text-[11px] ${
            isOwn ? 'flex-row-reverse text-slate-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <time dateTime={message.createdAt}>{time}</time>
          {isOwn && message.read && (
            <span className="inline-flex items-center gap-0.5 text-brand-400" title="Read">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <svg className="-ml-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
