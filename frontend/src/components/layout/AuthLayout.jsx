import { Link } from 'react-router-dom';

/**
 * Shared layout for login / register — responsive split panel.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
      {/* Brand panel — hidden on small screens */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-12 py-16 lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link to="/" className="text-xl font-bold text-white">
            DevConnect
          </Link>
          <p className="mt-8 max-w-sm text-lg text-brand-100">
            Build your developer profile, showcase projects, and find teammates who match your stack.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-brand-100">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            JWT-secured REST API
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Real-time messaging & collaboration
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Tech stack matching
          </li>
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="text-lg font-bold text-brand-600 dark:text-brand-400">
              DevConnect
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
