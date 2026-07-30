import { requestWithAuth } from '@features/auth/services/auth.service';
import {
  UpdateVisitorProfileInput,
  ProfileImageData,
  VisitorProfileData,
} from '@features/visitor-profile/types';

export const getVisitorProfile = async (): Promise<VisitorProfileData> =>
  requestWithAuth<VisitorProfileData>('/visitor/profile');

export const updateVisitorProfile = async (
  payload: UpdateVisitorProfileInput,
): Promise<VisitorProfileData> =>
  requestWithAuth<VisitorProfileData>('/visitor/profile', undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const uploadVisitorProfileImage = async (
  image: File,
): Promise<ProfileImageData> => {
  const body = new FormData();
  body.append('image', image);

  return requestWithAuth<ProfileImageData>('/visitor/profile/image', undefined, {
    method: 'PUT',
    body,
  });
};

export const removeVisitorProfileImage = async (): Promise<ProfileImageData> =>
  requestWithAuth<ProfileImageData>('/visitor/profile/image', undefined, {
    method: 'DELETE',
  });
