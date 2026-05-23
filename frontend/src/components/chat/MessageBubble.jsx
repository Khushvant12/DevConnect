import { memo } from 'react';

function MessageBubble({ message, isOwn }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[70%] ${
          isOwn
            ? 'rounded-br-md bg-brand-600 text-white'
            : 'rounded-bl-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        <p
          className={`mt-1 text-right text-[10px] ${
            isOwn ? 'text-brand-200' : 'text-slate-400'
          }`}
        >
          {time}
          {isOwn && message.read && ' · Read'}
        </p>
      </div>
    </div>
  );
}

export default memo(MessageBubble);
