import { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { useToast } from '../../context/ToastContext.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';

const CATEGORIES = ['web', 'mobile', 'ai-ml', 'devops', 'blockchain', 'game', 'open-source', 'other'];

export default function EditProjectModal({ open, onClose, project, onUpdated }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({});
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!project || !open) return;
    setForm({
      title: project.title || '',
      description: project.description || '',
      techStack: (project.techStack || []).join(', '),
      githubLink: project.githubLink || '',
      liveDemoLink: project.liveDemoLink || '',
      category: project.category || 'web',
      difficulty: project.difficulty || 'intermediate',
      teamSize: String(project.teamSize || 1),
    });
    setPreview(project.thumbnail || '');
    setThumbnail(null);
    setError('');
  }, [project, open]);

  if (!open || !project) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append(
        'techStack',
        JSON.stringify(form.techStack.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))
      );
      if (thumbnail) fd.append('thumbnail', thumbnail);

      const { data } = await projectService.update(project._id, fd);
      showToast('Project updated');
      onUpdated?.(data.data.project);
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
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h2 className="text-lg font-bold">Edit project</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && <Alert>{error}</Alert>}
          {preview && <img src={preview} alt="" className="h-32 w-full rounded-lg object-cover" />}
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            setThumbnail(f);
            if (f) setPreview(URL.createObjectURL(f));
          }} className="text-sm" />
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field" required />
          <Input label="Tech stack" name="techStack" value={form.techStack} onChange={handleChange} />
          <Input label="GitHub" name="githubLink" value={form.githubLink} onChange={handleChange} />
          <Input label="Live demo" name="liveDemoLink" value={form.liveDemoLink} onChange={handleChange} />
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={loading}>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
