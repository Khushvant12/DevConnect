import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { profileService } from '../services/profileService.js';
import { teamRequestService } from '../services/teamRequestService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import SendTeamRequestModal from '../components/team/SendTeamRequestModal.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import Button from '../components/ui/Button.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function DeveloperProfile() {
  const { username } = useParams();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const loadRequestStatus = async (profileId) => {
    if (!profileId || !isAuthenticated) return;
    try {
      setStatusLoading(true);
      const { data } = await teamRequestService.status(profileId);
      setRequestStatus(data.data.status);
    } catch {
      // Non-blocking
    } finally {
      setStatusLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await profileService.getProfile(username);
      setProfile(data.data.profile);
      setCompletion(data.data.profileCompletion);
      setIsOwner(data.data.isOwner);

      if (data.data.profile?._id && !data.data.isOwner) {
        await loadRequestStatus(data.data.profile._id);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Developer not found'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [username]);

  const getButtonLabel = () => {
    if (statusLoading) return 'Loading…';
    if (requestStatus === 'pending_outgoing') return 'Request sent';
    if (requestStatus === 'pending_incoming') return 'Respond to request';
    if (requestStatus === 'accepted') return 'Connected';
    return 'Team up';
  };

  const getButtonDisabled = () =>
    requestStatus === 'pending_outgoing' || requestStatus === 'accepted' || statusLoading;

  const handleTeamModalClose = () => {
    setTeamModalOpen(false);
    if (profile?._id) loadRequestStatus(profile._id);
  };

  if (loading) {
    return (
      <div className="page-container flex min-h-[50vh] items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container max-w-lg py-16">
        <Alert>{error}</Alert>
      </div>
    );
  }

  const visitorActions =
    isAuthenticated && !isOwner && profile?._id ? (
      <>
        <Link to={`/chat?user=${profile._id}`}>
          <Button>Message</Button>
        </Link>
        <Button
          variant="secondary"
          onClick={() => setTeamModalOpen(true)}
          disabled={getButtonDisabled()}
          title={
            requestStatus === 'pending_outgoing'
              ? 'Wait for response'
              : requestStatus === 'accepted'
                ? 'Already collaborating'
                : ''
          }
        >
          {getButtonLabel()}
        </Button>
      </>
    ) : null;

  return (
    <div className="page-container max-w-5xl py-6 sm:py-8 lg:py-10">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        profileCompletion={completion}
        onEdit={isOwner ? () => setEditOpen(true) : undefined}
        actions={visitorActions}
      />

      <SendTeamRequestModal
        open={teamModalOpen}
        onClose={handleTeamModalClose}
        receiverId={profile?._id}
        receiverName={profile?.name}
      />

      {isOwner && (
        <EditProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          profile={profile}
          onSaved={() => load()}
        />
      )}
    </div>
  );
}
