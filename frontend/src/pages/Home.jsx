import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="animate-fade-in">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-brand-950/40 dark:via-slate-950 dark:to-slate-900" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              Developer Collaboration Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Connect. Build.{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Ship together.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Showcase projects, find teammates by tech stack, collaborate on ideas, and chat in real time — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/feed">
                    <Button className="px-8 py-3 text-base">Explore Feed</Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="secondary" className="px-8 py-3 text-base">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/feed">
                    <Button variant="secondary" className="px-8 py-3 text-base">Browse projects</Button>
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link to="/register">
                    <Button className="px-8 py-3 text-base">Get Started</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" className="px-8 py-3 text-base">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Profiles', desc: 'Skills, bio, GitHub & social links' },
              { title: 'Projects', desc: 'Showcase work & get likes' },
              { title: 'Team Up', desc: 'Post collaboration requests' },
              { title: 'Real-time Chat', desc: 'Message developers instantly' },
            ].map((item) => (
              <div key={item.title} className="card animate-slide-up text-center">
                <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
