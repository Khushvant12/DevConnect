import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const toastStyles = {
  success:
    'border-emerald-200/60 bg-white text-slate-900 shadow-card-hover dark:border-emerald-900/40 dark:bg-slate-900 dark:text-slate-100',
  error:
    'border-red-200/60 bg-white text-slate-900 shadow-card-hover dark:border-red-900/40 dark:bg-slate-900 dark:text-slate-100',
};

const dotStyles = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto animate-slide-up flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium ${toastStyles[t.type] || toastStyles.success}`}
          >
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotStyles[t.type] || dotStyles.success}`} aria-hidden="true" />
            <span className="leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast requires ToastProvider');
  return ctx;
};
