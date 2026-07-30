'use client';

import { useCallback, useRef, useState } from 'react';

import { isApiServiceError } from '@/types/api';
import { useAuth } from '@features/auth/hooks/useAuth';
import {
  removeVisitorProfileImage,
  uploadVisitorProfileImage,
} from '@features/visitor-profile/services/profile-picture.service';

const safeImageError = (error: unknown, action: 'upload' | 'remove') => {
  if (isApiServiceError(error) && error.status === 400) {
    return error.message || 'Select a valid image up to 5 MB';
  }

  return action === 'upload'
    ? 'Unable to update your profile picture. Please try again.'
    : 'Unable to remove your profile picture. Please try again.';
};

export const useProfilePicture = (
  onUpdated: (profileImageUrl: string | null) => void,
) => {
  const { updateUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      if (processingRef.current) return false;
      processingRef.current = true;
      setProcessing(true);
      setError(null);

      try {
        const data = await uploadVisitorProfileImage(file);
        updateUser({ profileImageUrl: data.profileImageUrl });
        onUpdated(data.profileImageUrl);
        return true;
      } catch (caughtError) {
        setError(safeImageError(caughtError, 'upload'));
        return false;
      } finally {
        processingRef.current = false;
        setProcessing(false);
      }
    },
    [onUpdated, updateUser],
  );

  const remove = useCallback(async () => {
    if (processingRef.current) return false;
    processingRef.current = true;
    setProcessing(true);
    setError(null);

    try {
      const data = await removeVisitorProfileImage();
      updateUser({ profileImageUrl: data.profileImageUrl });
      onUpdated(data.profileImageUrl);
      return true;
    } catch (caughtError) {
      setError(safeImageError(caughtError, 'remove'));
      return false;
    } finally {
      processingRef.current = false;
      setProcessing(false);
    }
  }, [onUpdated, updateUser]);

  return { error, processing, remove, setError, upload };
};
