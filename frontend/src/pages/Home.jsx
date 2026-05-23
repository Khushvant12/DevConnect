import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const features = [
  {
    title: 'Developer profiles',
    desc: 'Skills, bio, GitHub & portfolio links in one place.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    title: 'Project showcase',
    desc: 'Share what you build and get likes from the community.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    ),
  },
  {
    title: 'Team matching',
    desc: 'Post collaboration requests and find the right stack.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    title: 'Real-time chat',
    desc: 'Message developers instantly and keep momentum.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="animate-fade-in">
      <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/80 via-white to-slate-50 dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl dark:bg-brand-600/10" aria-hidden="true" />
        <div className="absolute -bottom-24 left-0 -z-10 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" aria-hidden="true" />

        <div className="page-container py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="badge-brand mb-6 inline-flex px-4 py-1.5 text-xs">
              Built for developers, by developers
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Connect. Build.{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 bg-clip-text text-transparent">
                Ship together.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Showcase projects, find teammates by tech stack, collaborate on ideas, and chat in real time — your professional dev network.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/feed">
                    <Button size="lg">Explore feed</Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="secondary" size="lg">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg">Get started free</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg">Log in</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="card-interactive group p-6 text-left"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-400 dark:group-hover:bg-brand-900/50">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
