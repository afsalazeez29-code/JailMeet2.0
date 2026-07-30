'use client';

import { useEffect, useState } from 'react';

import { ErrorAlert, ForbiddenAlert, LoadingAlert } from '@components/common/StatusAlert';
import { isApiServiceError } from '@/types/api';
import { useProtectedPage } from '@features/auth/hooks/useProtectedPage';
import VisitorProfileView from '@features/visitor-profile/components/VisitorProfileView';
import { getVisitorProfile } from '@features/visitor-profile/services/visitor.service';
import type { VisitorProfileData } from '@features/visitor-profile/types';

export default function VisitorProfileScreen() {
  const protectedPage = useProtectedPage();
  const { isReady, redirectToLogin } = protectedPage;
  const [profile, setProfile] = useState<VisitorProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    let active = true;
    setLoading(true);
    setError(null);

    getVisitorProfile()
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((caughtError) => {
        if (!active) return;
        if (isApiServiceError(caughtError) && caughtError.status === 401) {
          redirectToLogin();
          return;
        }
        setError(
          isApiServiceError(caughtError) && caughtError.status === 403
            ? 'Access denied'
            : 'Unable to load visitor profile',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isReady, redirectToLogin]);

  if (protectedPage.isLoading || loading || (!isReady && !protectedPage.error && !protectedPage.isForbidden)) {
    return <div className="container-xxl flex-grow-1 container-p-y"><LoadingAlert>Loading profile...</LoadingAlert></div>;
  }
  if (protectedPage.isForbidden || error === 'Access denied') {
    return <div className="container-xxl flex-grow-1 container-p-y"><ForbiddenAlert /></div>;
  }
  if (protectedPage.error || error) {
    return <div className="container-xxl flex-grow-1 container-p-y"><ErrorAlert>{protectedPage.error || error}</ErrorAlert></div>;
  }
  if (!profile) return null;

  return <VisitorProfileView profileData={profile} />;
}
