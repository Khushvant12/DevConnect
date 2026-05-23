import { useEffect, useState } from 'react';
import { profileService } from '../services/profileService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../utils/getErrorMessage.js';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
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
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="My profile"
        subtitle="How others see you on DevConnect"
        className="!mb-6"
      />

      {error && (
        <div className="mb-6">
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
