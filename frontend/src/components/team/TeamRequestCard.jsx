import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export default function TeamRequestCard({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  loading,
}) {
  const other = type === 'incoming' ? request.sender : request.receiver;

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-3">
          {other?.avatar ? (
            <img src={other.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
              {other?.name?.charAt(0)}
            </div>
          )}
          <div>
            <Link
              to={`/developers/${other?.username}`}
              className="font-semibold text-slate-900 hover:text-brand-600 dark:text-white"
            >
              {other?.name}
            </Link>
            <p className="text-xs text-slate-500">@{other?.username}</p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[request.status]}`}
            >
              {request.status}
            </span>
          </div>
        </div>
        <time className="text-xs text-slate-400">
          {new Date(request.createdAt).toLocaleDateString()}
        </time>
      </div>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{request.message}</p>

      {request.project && (
        <Link
          to={`/projects/${request.project._id}`}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
        >
          {request.project.thumbnail && (
            <img src={request.project.thumbnail} alt="" className="h-8 w-12 rounded object-cover" />
          )}
          <span>Re: {request.project.title}</span>
        </Link>
      )}

      {request.status === 'pending' && type === 'incoming' && (
        <div className="mt-4 flex gap-2">
          <Button onClick={() => onAccept(request._id)} loading={loading}>
            Accept
          </Button>
          <Button variant="secondary" onClick={() => onReject(request._id)}>
            Reject
          </Button>
        </div>
      )}

      {request.status === 'pending' && type === 'outgoing' && (
        <div className="mt-4">
          <Button variant="secondary" onClick={() => onCancel(request._id)}>
            Cancel request
          </Button>
        </div>
      )}

      {request.status === 'accepted' && (
        <Link to={`/chat?user=${other?._id}`} className="mt-4 inline-block text-sm text-brand-600 hover:underline">
          Open chat →
        </Link>
      )}
    </div>
  );
}
