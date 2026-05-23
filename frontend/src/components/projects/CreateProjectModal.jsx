import { useState } from 'react';
import { projectService } from '../../services/projectService.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { useToast } from '../../context/ToastContext.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';

const CATEGORIES = ['web', 'mobile', 'ai-ml', 'devops', 'blockchain', 'game', 'open-source', 'other'];

export default function CreateProjectModal({ open, onClose, onCreated }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveDemoLink: '',
    category: 'web',
    difficulty: 'intermediate',
    teamSize: '1',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setThumbnail(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('techStack', JSON.stringify(
        form.techStack.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      ));
      if (thumbnail) fd.append('thumbnail', thumbnail);

      const { data } = await projectService.create(fd);
      showToast('Project published!');
      onCreated?.(data.data.project);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold">Create project</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <Alert>{error}</Alert>}
          {preview && (
            <img src={preview} alt="" className="h-40 w-full rounded-lg object-cover" />
          )}
          <label className="block text-sm font-medium">Thumbnail</label>
          <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field" required />
          </div>
          <Input label="Tech stack (comma-separated)" name="techStack" value={form.techStack} onChange={handleChange} />
          <Input label="GitHub link" name="githubLink" value={form.githubLink} onChange={handleChange} />
          <Input label="Live demo link" name="liveDemoLink" value={form.liveDemoLink} onChange={handleChange} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <Input label="Team size" name="teamSize" type="number" min={1} value={form.teamSize} onChange={handleChange} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>Publish</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
