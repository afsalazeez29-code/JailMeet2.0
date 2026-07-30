import type { PaginatedData } from '@/types/api';
import type { AccountStatus, UserRole } from '@/types/user';

export type AdminUserRole = UserRole;
export type AdminAccountStatus = AccountStatus;

export type AdminUsersPaginatedResponse<T> = PaginatedData<T>;

export type PaginatedResponse<T> = AdminUsersPaginatedResponse<T>;

export type AdminUserListFilters = {
  search?: string;
  page?: number;
  limit?: number;
  role?: AdminUserRole;
  status?: AdminAccountStatus;
};

export type AdminUser = {
  id: string;
  publicId?: string | null;
  name: string;
  email: string | null;
  role: AdminUserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDetail = {
  user: AdminUser;
  profile: unknown;
};

export type UpdateUserStatusInput = {
  isActive: boolean;
};

export type AdminVisitor = {
  id: string;
  publicId: string | null;
  name: string;
  phone: string;
  state: string | null;
  address: string | null;
  zip: string | null;
  profilePic: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string | null; isActive: boolean };
};

export type AdminOfficer = {
  id: string;
  name: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string | null; isActive: boolean };
};

export type AdminOfficerDetails = AdminOfficer & {
  user: {
    id: string;
    email: string | null;
    role: AdminUserRole;
    isActive: boolean;
  };
};

export type CreateOfficerInput = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export type UpdateOfficerInput = {
  name?: string;
  phone?: string | null;
};

export type CreateOfficerResponse = {
  user: {
    id: string;
    email: string | null;
    role: 'OFFICER';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  officerProfile: {
    id: string;
    name: string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type AdminPrisoner = {
  id: string;
  name: string;
  age: number;
  gender: string;
  caseDetails: string | null;
  admissionDate: string;
  sentencePeriod: string | null;
  jailType: string | null;
  jailName: string | null;
  cellNumber: string | null;
  profilePic: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string | null; isActive: boolean };
};

export type AdminPrisonerDetails = AdminPrisoner & {
  user: {
    id: string;
    email: string | null;
    role: AdminUserRole;
    isActive: boolean;
  };
};

export type CreatePrisonerInput = {
  email: string;
  password: string;
  name: string;
  age: number;
  gender: string;
  admissionDate: string;
  caseDetails?: string | null;
  sentencePeriod?: string | null;
  jailType?: string | null;
  jailName?: string | null;
  cellNumber?: string | null;
  profilePic?: string | null;
};

export type UpdatePrisonerInput = Partial<
  Omit<CreatePrisonerInput, 'email' | 'password'>
>;

export type CreatePrisonerResponse = {
  user: {
    id: string;
    email: string | null;
    role: 'PRISONER';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  prisonerProfile: Omit<AdminPrisoner, 'user'>;
};
