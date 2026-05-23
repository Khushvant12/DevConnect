import { useEffect, useState } from 'react';
import { profileService } from '../../services/profileService.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';

const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Select level' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

const parseCsv = (str) =>
  str
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

function FormSection({ title, description, children }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30 sm:p-5">
      <legend className="mb-1 px-1">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
        {description && (
          <p className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

export default function EditProfileModal({ open, onClose, profile, onSaved }) {
  const [form, setForm] = useState({});
  const [skillsInput, setSkillsInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile || !open) return;
    setForm({
      name: profile.name || '',
      bio: profile.bio || '',
      education: profile.education || '',
      company: profile.company || '',
      location: profile.location || '',
      experienceLevel: profile.experienceLevel || '',
      githubProfile: profile.githubProfile || profile.socialLinks?.github || '',
      linkedin: profile.socialLinks?.linkedin || '',
      portfolio: profile.socialLinks?.portfolio || '',
    });
    setSkillsInput((profile.skills || []).join(', '));
    setTechInput((profile.techStack || []).join(', '));
    setPreviewUrl(profile.avatar || '');
    setAvatarFile(null);
    setError('');
  }, [profile, open]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (avatarFile) {
        await profileService.uploadAvatar(avatarFile);
      }

      const { data } = await profileService.updateProfile({
        name: form.name,
        bio: form.bio,
        education: form.education,
        company: form.company,
        location: form.location,
        experienceLevel: form.experienceLevel,
        githubProfile: form.githubProfile,
        skills: parseCsv(skillsInput),
        techStack: parseCsv(techInput),
        socialLinks: {
          github: form.githubProfile,
          linkedin: form.linkedin,
          portfolio: form.portfolio,
        },
      });

      onSaved?.(data.data);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card-hover animate-slide-up dark:border-slate-700 dark:bg-slate-900">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
          <div>
            <h2 id="edit-profile-title" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Edit profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update how you appear to the community
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost !p-2"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-6">
          {error && <Alert>{error}</Alert>}

          <FormSection title="Profile photo" description="A clear photo helps you get recognized">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-brand-500/30"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-200 text-2xl text-slate-500 dark:bg-slate-700">
                  ?
                </div>
              )}
              <div>
                <label className="btn-secondary inline-flex cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  />
                  Upload photo
                </label>
                <p className="mt-2 text-xs text-slate-500">JPG or PNG, max 5MB</p>
              </div>
            </div>
          </FormSection>

          <FormSection title="Basic info">
            <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
                maxLength={500}
                placeholder="Tell developers about your experience, interests, and what you're building…"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{form.bio?.length ?? 0}/500</p>
            </div>
          </FormSection>

          <FormSection title="Professional details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Location" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
              <Input label="Company / College" name="company" value={form.company} onChange={handleChange} />
            </div>
            <Input label="Education" name="education" value={form.education} onChange={handleChange} />
            <div>
              <label htmlFor="experienceLevel" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Experience level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className="input-field"
              >
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </FormSection>

          <FormSection title="Skills & stack" description="Comma-separated values">
            <Input
              label="Skills"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="react, node.js, system design"
            />
            <Input
              label="Tech stack"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="vite, mongodb, tailwind"
            />
          </FormSection>

          <FormSection title="Social links">
            <Input
              label="GitHub"
              name="githubProfile"
              value={form.githubProfile}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
            <Input
              label="Portfolio"
              name="portfolio"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://yoursite.dev"
            />
          </FormSection>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose} className="sm:min-w-[100px]">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="sm:min-w-[140px]">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
