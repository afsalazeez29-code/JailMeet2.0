'use client';

import { useEffect, useState } from 'react';

import { useProtectedPage } from '@/hooks/useProtectedPage';
import { getVisitorProfile } from '@/services/visitor.service';
import { isApiServiceError } from '@/types/api';
import { VisitorProfileData } from '@/types/visitor';

import VisitorSettingsForm from '../../../components/visitor/VisitorSettingsForm';

export default function VisitorSettingsPage() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [profileData, setProfileData] = useState<VisitorProfileData | null>(
    null,
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);

      try {
        const data = await getVisitorProfile();

        if (!isMounted) {
          return;
        }

        setProfileData(data);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        if (isApiServiceError(caughtError)) {
          if (caughtError.status === 401) {
            redirectToLogin();
            return;
          }

          if (caughtError.status === 403) {
            setProfileError('Access denied');
            return;
          }

          setProfileError(
            caughtError.message || 'Unable to load visitor profile',
          );
          return;
        }

        setProfileError('Unable to load visitor profile');
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isReady, redirectToLogin]);

  if (
    protectedPage.isLoading ||
    profileLoading ||
    (!protectedPage.isReady &&
      !protectedPage.error &&
      !protectedPage.isForbidden)
  ) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-info">Loading visitor settings...</div>
      </div>
    );
  }

  if (protectedPage.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">Access denied</div>
      </div>
    );
  }

  if (profileError === 'Access denied') {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">Access denied</div>
      </div>
    );
  }

  if (protectedPage.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">{protectedPage.error}</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="alert alert-danger">{profileError}</div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return <VisitorSettingsForm profileData={profileData} />;
}
