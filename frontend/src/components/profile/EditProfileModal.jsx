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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <Alert>{error}</Alert>}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover ring-2 ring-brand-500"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-2xl dark:bg-slate-700">
                ?
              </div>
            )}
            <div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
                Upload photo
              </label>
              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG up to 5MB. Requires Cloudinary env vars on backend.
              </p>
            </div>
          </div>

          <Input label="Full name" name="name" value={form.name} onChange={handleChange} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              maxLength={500}
              placeholder="Tell developers about yourself..."
            />
          </div>
          <Input label="Education" name="education" value={form.education} onChange={handleChange} />
          <Input label="College / Company" name="company" value={form.company} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Experience level
            </label>
            <select
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
          <Input
            label="Skills (comma-separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="react, node.js, mongodb"
          />
          <Input
            label="Tech stack (comma-separated)"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="vite, express, tailwind"
          />
          <Input
            label="GitHub URL or username"
            name="githubProfile"
            value={form.githubProfile}
            onChange={handleChange}
          />
          <Input label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} />
          <Input label="Portfolio website" name="portfolio" value={form.portfolio} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
