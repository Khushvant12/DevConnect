export default function TypingIndicator({ name }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
      </span>
      {name ? `${name} is typing...` : 'Typing...'}
    </div>
  );
}
