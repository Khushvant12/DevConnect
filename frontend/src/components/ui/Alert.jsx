export default function Alert({ type = 'error', children }) {
  const styles =
    type === 'error'
      ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';

  return (
    <div className={`rounded-lg px-4 py-3 text-sm ${styles}`} role="alert">
      {children}
    </div>
  );
}
