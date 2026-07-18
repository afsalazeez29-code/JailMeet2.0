import { requestWithAuth } from '@/services/auth.service';
import {
  UpdateVisitorProfileInput,
  VisitorProfileData,
} from '@/types/visitor';

export const getVisitorProfile = async (): Promise<VisitorProfileData> =>
  requestWithAuth<VisitorProfileData>('/visitor/profile');

export const updateVisitorProfile = async (
  payload: UpdateVisitorProfileInput,
): Promise<VisitorProfileData> =>
  requestWithAuth<VisitorProfileData>('/visitor/profile', undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
