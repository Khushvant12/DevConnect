import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import Alert from '../components/ui/Alert.jsx';

export default function Profile() {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await profileService.getMyProfile();
      setProfile(data.data.profile);
      setCompletion(data.data.profileCompletion);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = async () => {
    await load();
    await refreshUser();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <ProfileHeader
        profile={profile}
        isOwner
        profileCompletion={completion}
        onEdit={() => setEditOpen(true)}
      />
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSaved={handleSaved}
      />
    </DashboardLayout>
  );
}
