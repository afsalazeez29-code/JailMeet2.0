'use client';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '../../../components/common/StatusAlert';
import { useEffect, useState } from 'react';

import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import { getVisitorProfile } from '@features/visitor-profile/services/visitor.service';
import { isApiServiceError } from '@/types/api';
import { VisitorProfileData } from '@features/visitor-profile/types';

import VisitorSettingsForm from '@features/visitor-profile/components/VisitorSettingsForm';

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
        <LoadingAlert>Loading visitor settings...</LoadingAlert>
      </div>
    );
  }

  if (protectedPage.isForbidden) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert />
      </div>
    );
  }

  if (profileError === 'Access denied') {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ForbiddenAlert />
      </div>
    );
  }

  if (protectedPage.error) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{protectedPage.error}</ErrorAlert>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container-xxl flex-grow-1 container-p-y">
        <ErrorAlert>{profileError}</ErrorAlert>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return <VisitorSettingsForm profileData={profileData} />;
}


