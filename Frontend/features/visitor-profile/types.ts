import { ApiResponse } from '@/types/api';
import { AuthUser } from '@features/auth/types';

export type VisitorProfile = {
  publicId: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  dateOfBirth: string | null;
  gender: string | null;
};

export type VisitorProfileData = {
  user: AuthUser & { isActive?: boolean };
  visitorProfile: VisitorProfile;
};

export type VisitorProfileResponse = ApiResponse<VisitorProfileData>;

export type UpdateVisitorProfileInput = {
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | '';
};

export type ProfileImageData = {
  profileImageUrl: string | null;
};
