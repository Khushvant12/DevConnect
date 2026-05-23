import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProfileCard from '../components/profile/ProfileCard.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function Developers() {
  const [q, setQ] = useState('');
  const [skills, setSkills] = useState('');
  const [tech, setTech] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await profileService.searchDevelopers({
        q: q.trim() || undefined,
        skills: skills.trim() || undefined,
        tech: tech.trim() || undefined,
        limit: 24,
      });
      setProfiles(data.data.profiles);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Find developers</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Search by name, skills, or tech stack
          </p>
        </div>

        <form onSubmit={search} className="card space-y-4">
          <Input
            label="Name or username"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search developers..."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="react, node"
            />
            <Input
              label="Tech stack (comma-separated)"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="mongodb, express"
            />
          </div>
          <Button type="submit" loading={loading}>
            Search
          </Button>
        </form>

        {error && <Alert>{error}</Alert>}

        {loading && profiles.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-center text-slate-500">No developers found. Try different filters.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((p) => (
              <ProfileCard key={p._id} profile={p} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
