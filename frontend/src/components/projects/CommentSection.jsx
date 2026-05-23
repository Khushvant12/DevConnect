import { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../ui/Button.jsx';

export default function CommentSection({ projectId }) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const load = async () => {
    try {
      const { data } = await projectService.getComments(projectId);
      setComments(data.data.comments);
    } catch {
      showToast('Failed to load comments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await projectService.addComment(projectId, text);
      setComments((prev) => [data.data.comment, ...prev]);
      setText('');
      showToast('Comment added');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (commentId) => {
    try {
      const { data } = await projectService.updateComment(commentId, editText);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.data.comment : c))
      );
      setEditingId(null);
      showToast('Comment updated');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await projectService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showToast('Comment deleted');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading comments...</p>;
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Comments ({comments.length})
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Share feedback on this project..."
            maxLength={1000}
          />
          <Button type="submit" loading={submitting}>
            Post comment
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Log in to comment.</p>
      )}

      <ul className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <li className="text-sm text-slate-500">No comments yet. Be the first!</li>
        ) : (
          comments.map((c) => {
            const isOwner = user && String(c.user?._id) === String(user._id);
            return (
              <li
                key={c._id}
                className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800"
              >
                {c.user?.avatar ? (
                  <img src={c.user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {c.user?.name?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {c.user?.name}
                    </span>
                    <span className="text-xs text-slate-400">@{c.user?.username}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {editingId === c._id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input-field resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(c._id)}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
                  )}
                  {isOwner && editingId !== c._id && (
                    <div className="mt-2 flex gap-3 text-xs">
                      <button
                        type="button"
                        className="text-brand-600 hover:underline"
                        onClick={() => {
                          setEditingId(c._id);
                          setEditText(c.text);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
