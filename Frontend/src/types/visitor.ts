import { ApiResponse } from './api';
import { AuthUser } from './auth';

export type VisitorProfile = {
  phone: string;
  address: string | null;
  state: string | null;
  zip: string | null;
};

export type VisitorProfileData = {
  user: AuthUser;
  visitorProfile: VisitorProfile;
};

export type VisitorProfileResponse = ApiResponse<VisitorProfileData>;

export type UpdateVisitorProfileInput = {
  phone?: string;
  address?: string;
  state?: string;
  zip?: string;
};
