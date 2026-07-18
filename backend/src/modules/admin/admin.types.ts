import { AppointmentStatus, ParoleStatus, Role } from '@prisma/client';

export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: Pagination;
};

export type SafeAdminUser = {
  id: string;
  name: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDetail = {
  user: SafeAdminUser;
  profile: unknown;
};

export type AdminAppointmentOverview = {
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

export type AdminParoleOverview = {
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
