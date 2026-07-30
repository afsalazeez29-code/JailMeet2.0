import { AppointmentStatus, ParoleStatus, Role } from '@prisma/client';
import { z } from 'zod';

import {
  appointmentListQuerySchema,
  createOfficerSchema,
  createPrisonerSchema,
  officerIdParamSchema,
  paroleListQuerySchema,
  prisonerIdParamSchema,
  profileListQuerySchema,
  updateOfficerSchema,
  updatePrisonerSchema,
  updateUserStatusSchema,
  userIdParamSchema,
  userListQuerySchema,
  visitorIdParamSchema,
} from './admin.validation';

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
  publicId: string | null;
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
  visitor: {
    id: string;
    publicId: string | null;
    name: string;
    phone: string;
  };
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

export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type ProfileListQuery = z.infer<typeof profileListQuerySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type VisitorIdParam = z.infer<typeof visitorIdParamSchema>;
export type OfficerIdParam = z.infer<typeof officerIdParamSchema>;
export type PrisonerIdParam = z.infer<typeof prisonerIdParamSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type CreateOfficerInput = z.infer<typeof createOfficerSchema>;
export type UpdateOfficerInput = z.infer<typeof updateOfficerSchema>;
export type CreatePrisonerInput = z.infer<typeof createPrisonerSchema>;
export type UpdatePrisonerInput = z.infer<typeof updatePrisonerSchema>;
export type AppointmentListQuery = z.infer<typeof appointmentListQuerySchema>;
export type ParoleListQuery = z.infer<typeof paroleListQuerySchema>;
