import { AppointmentStatus } from '@/types/appointment';
import { ParoleStatus } from '@/types/parole';

export type AdminUserRole = 'ADMIN' | 'OFFICER' | 'VISITOR' | 'PRISONER';
export type AdminAccountStatus = 'ACTIVE' | 'INACTIVE';

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type AdminListFilters = {
  search?: string;
  page?: number;
  limit?: number;
  role?: AdminUserRole;
  status?: AdminAccountStatus | AppointmentStatus | ParoleStatus;
};

export type AdminUser = {
  id: string;
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
  user: { id: string; email: string | null; role: AdminUserRole; isActive: boolean };
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
  user: { id: string; email: string | null; role: AdminUserRole; isActive: boolean };
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

export type AdminAppointment = {
  id: string;
  relationship: string;
  message: string | null;
  requestedDate: string;
  status: AppointmentStatus;
  replyMessage: string | null;
  createdAt: string;
  updatedAt: string;
  visitor: { id: string; name: string; phone: string };
  prisoner: { id: string; name: string };
  officer: { id: string; name: string } | null;
};

export type AdminParoleRequest = {
  id: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: string;
  toDate: string;
  status: ParoleStatus;
  officerReply: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner: { id: string; name: string };
  officer: { id: string; name: string } | null;
};
