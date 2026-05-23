import { useEffect, useState } from 'react';
import { teamRequestService } from '../services/teamRequestService.js';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import { useToast } from '../context/ToastContext.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import TeamRequestCard from '../components/team/TeamRequestCard.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function TeamRequests() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('incoming');
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [inRes, outRes] = await Promise.all([
        teamRequestService.incoming(),
        teamRequestService.outgoing(),
      ]);
      setIncoming(inRes.data.data.requests);
      setOutgoing(outRes.data.data.requests);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAccept = async (id) => {
    setActionLoading(true);
    try {
      await teamRequestService.accept(id);
      showToast('Request accepted');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      await teamRequestService.reject(id);
      showToast('Request rejected');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      await teamRequestService.cancel(id);
      showToast('Request cancelled');
      load();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const list = tab === 'incoming' ? incoming : outgoing;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team-up requests</h1>
          <p className="text-slate-500">Collaboration invites you&apos;ve sent or received</p>
        </div>

        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
          {['incoming', 'outgoing'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-sm font-medium capitalize transition ${
                tab === t
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              <span className="ml-1 text-xs">
                ({t === 'incoming' ? incoming.length : outgoing.length})
              </span>
            </button>
          ))}
        </div>

        {error && <Alert>{error}</Alert>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : list.length === 0 ? (
          <div className="card py-12 text-center text-slate-500">
            No {tab} requests.
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((r) => (
              <TeamRequestCard
                key={r._id}
                request={r}
                type={tab}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
