export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
        ? 'btn-secondary'
        : 'text-brand-600 hover:text-brand-700 font-medium text-sm';

  return (
    <button
      type={type}
      className={`${base} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
