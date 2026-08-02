import { requestWithAuth } from '@features/auth/services/auth.service';
import type { PrisonerProfileData } from '@features/prisoner-profile/types';

export const getPrisonerProfile = (): Promise<PrisonerProfileData> =>
  requestWithAuth<PrisonerProfileData>('/prisoner/profile');
