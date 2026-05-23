export default function PresenceDot({ online, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-2.5 w-2.5 border-[1.5px]',
    md: 'h-3 w-3 border-2',
    lg: 'h-3.5 w-3.5 border-2',
  };

  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      aria-label={online ? 'Online' : 'Offline'}
      title={online ? 'Online' : 'Offline'}
    >
      {online && (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50"
          aria-hidden="true"
        />
      )}
      <span
        className={`relative block rounded-full border-white dark:border-slate-900 ${sizes[size]} ${
          online ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
        }`}
        aria-hidden="true"
      />
    </span>
  );
}
