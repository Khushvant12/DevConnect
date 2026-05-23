import { useState } from 'react';
import { teamRequestService } from '../../services/teamRequestService.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../ui/Button.jsx';
import Alert from '../ui/Alert.jsx';

export default function SendTeamRequestModal({
  open,
  onClose,
  receiverId,
  receiverName,
  projectId = '',
  projectTitle = '',
}) {
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    try {
      await teamRequestService.send({
        receiverId,
        message: message.trim(),
        projectId: projectId || undefined,
      });
      showToast(`Request sent to ${receiverName}`);
      setMessage('');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h2 className="text-lg font-bold">Team-up request</h2>
        <p className="mt-1 text-sm text-slate-500">
          Send a collaboration request to {receiverName}
          {projectTitle && ` about "${projectTitle}"`}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && <Alert>{error}</Alert>}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Hi! I'd love to collaborate on..."
            maxLength={500}
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Send request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
