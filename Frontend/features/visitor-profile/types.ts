import { ApiResponse } from '@/types/api';
import { AuthUser } from '@features/auth/types';

export type VisitorProfile = {
  publicId: string | null;
  phone: string;
  address: string | null;
  state: string | null;
  zip: string | null;
};

export type VisitorProfileData = {
  user: AuthUser & { isActive?: boolean };
  visitorProfile: VisitorProfile;
};

export type VisitorProfileResponse = ApiResponse<VisitorProfileData>;

export type UpdateVisitorProfileInput = {
  phone?: string;
  address?: string;
  state?: string;
  zip?: string;
};

export type ProfileImageData = {
  profileImageUrl: string | null;
};
