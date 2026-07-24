import { ApiResponse } from '@/types/api';
import type { UserRole } from '@/types/user';

export type Role = UserRole;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type LoginData = {
  user: AuthUser;
  accessToken: string;
};

export type CurrentUserData = {
  user: AuthUser;
};

export type VisitorRegistrationPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  state?: string;
  zip?: string;
};

export type VisitorProfile = {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  state: string | null;
  zip: string | null;
};

export type VisitorRegistrationData = {
  user: AuthUser;
  visitorProfile: VisitorProfile;
};

export type LoginResponse = ApiResponse<LoginData>;

export type VisitorRegistrationResponse =
  ApiResponse<VisitorRegistrationData>;

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordResponse = ApiResponse<null>;
