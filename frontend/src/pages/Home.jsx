import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const features = [
  {
    title: 'Developer profiles',
    desc: 'Showcase your skills, biography, GitHub links, and portfolio projects in a unified, professional format.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    title: 'Project showcase',
    desc: 'Publish your side projects, receive peer feedback, and gain visibility within the global developer network.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    ),
  },
  {
    title: 'Team matching',
    desc: 'Easily match with builders based on matching stacks for hackathons, start-ups, or open-source projects.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    title: 'Real-time chat',
    desc: 'Collaborate and message developers instantly with integrated direct message rooms and live status notifications.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.35] dark:opacity-[0.2]" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[800px] rounded-full bg-brand-500/10 blur-[120px] dark:bg-brand-500/15" aria-hidden="true" />
      <div className="absolute top-1/2 left-10 -translate-y-1/2 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[80px]" aria-hidden="true" />

      <div className="page-container relative z-10">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-500/30 bg-brand-500/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400 uppercase">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            Developer Collaboration Hub
          </div>
          
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white leading-[1.1] sm:leading-[1.05]">
            Connect. Build.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
              Ship together.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Showcase your project prototypes, match with developer teammates by specific tech stack, and align for hackathons or startups — all in one real-time workspace.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/feed">
                  <Button size="lg" className="px-8 py-3">Explore Feed</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="secondary" size="lg" className="px-8 py-3">User Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8 py-3">Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="px-8 py-3">Log In</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grids */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="glass-card p-8 transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-400 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
