import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { profileService } from '../services/profileService.js';
import { teamRequestService } from '../services/teamRequestService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import SendTeamRequestModal from '../components/team/SendTeamRequestModal.jsx';
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
    } catch (err) {
      console.error('Failed to load request status:', err);
      // Silently fail - doesn't block profile view
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
      
      // Load request status after profile is loaded
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
    if (statusLoading) return 'Loading...';
    if (requestStatus === 'pending_outgoing') return 'Request Sent';
    if (requestStatus === 'pending_incoming') return 'Respond to Request';
    if (requestStatus === 'accepted') return 'Connected';
    return 'Send Team-up Request';
  };

  const getButtonDisabled = () => {
    return requestStatus === 'pending_outgoing' || requestStatus === 'accepted' || statusLoading;
  };

  const handleTeamModalClose = () => {
    setTeamModalOpen(false);
    // Refresh status after sending a request
    if (profile?._id) {
      loadRequestStatus(profile._id);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Alert>{error}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 py-8 sm:px-6">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        profileCompletion={completion}
        onEdit={isOwner ? () => setEditOpen(true) : undefined}
      />

      {isAuthenticated && !isOwner && profile?._id && (
        <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      )}

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
