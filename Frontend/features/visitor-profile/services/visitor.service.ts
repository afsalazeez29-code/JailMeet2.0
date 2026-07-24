import { requestWithAuth } from '@features/auth/services/auth.service';
import {
  UpdateVisitorProfileInput,
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
