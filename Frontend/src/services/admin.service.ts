import { requestWithAuth } from '@/services/auth.service';
import {
  AdminAppointment,
  AdminOfficerDetails,
  AdminListFilters,
  AdminOfficer,
  AdminParoleRequest,
  AdminPrisoner,
  AdminPrisonerDetails,
  AdminUser,
  AdminUserDetail,
  AdminVisitor,
  CreateOfficerInput,
  CreateOfficerResponse,
  CreatePrisonerInput,
  CreatePrisonerResponse,
  PaginatedResponse,
  UpdateOfficerInput,
  UpdatePrisonerInput,
  UpdateUserStatusInput,
} from '@/types/admin';

const buildQuery = (filters: AdminListFilters = {}): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  return query ? `?${query}` : '';
};

export const getAdminUsers = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminUser>> =>
  requestWithAuth<PaginatedResponse<AdminUser>>(
    `/admin/users${buildQuery(filters)}`,
  );

export const getAdminUserById = async (
  userId: string,
): Promise<AdminUserDetail> =>
  requestWithAuth<AdminUserDetail>(`/admin/users/${userId}`);

export const updateAdminUserStatus = async (
  userId: string,
  payload: UpdateUserStatusInput,
): Promise<AdminUser> =>
  requestWithAuth<AdminUser>(`/admin/users/${userId}/status`, undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const getAdminVisitors = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminVisitor>> =>
  requestWithAuth<PaginatedResponse<AdminVisitor>>(
    `/admin/visitors${buildQuery(filters)}`,
  );

export const getAdminVisitorById = async (
  visitorId: string,
): Promise<AdminVisitor> =>
  requestWithAuth<AdminVisitor>(`/admin/visitors/${visitorId}`);

export const getAdminOfficers = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminOfficer>> =>
  requestWithAuth<PaginatedResponse<AdminOfficer>>(
    `/admin/officers${buildQuery(filters)}`,
  );

export const getAdminOfficerById = async (
  officerId: string,
): Promise<AdminOfficerDetails> =>
  requestWithAuth<AdminOfficerDetails>(`/admin/officers/${officerId}`);

export const createAdminOfficer = async (
  payload: CreateOfficerInput,
): Promise<CreateOfficerResponse> =>
  requestWithAuth<CreateOfficerResponse>('/admin/officers', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateAdminOfficer = async (
  officerId: string,
  payload: UpdateOfficerInput,
): Promise<AdminOfficerDetails> =>
  requestWithAuth<AdminOfficerDetails>(`/admin/officers/${officerId}`, undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const getAdminPrisoners = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminPrisoner>> =>
  requestWithAuth<PaginatedResponse<AdminPrisoner>>(
    `/admin/prisoners${buildQuery(filters)}`,
  );

export const getAdminPrisonerById = async (
  prisonerId: string,
): Promise<AdminPrisonerDetails> =>
  requestWithAuth<AdminPrisonerDetails>(`/admin/prisoners/${prisonerId}`);

export const createAdminPrisoner = async (
  payload: CreatePrisonerInput,
): Promise<CreatePrisonerResponse> =>
  requestWithAuth<CreatePrisonerResponse>('/admin/prisoners', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateAdminPrisoner = async (
  prisonerId: string,
  payload: UpdatePrisonerInput,
): Promise<AdminPrisonerDetails> =>
  requestWithAuth<AdminPrisonerDetails>(`/admin/prisoners/${prisonerId}`, undefined, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const getAdminAppointments = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminAppointment>> =>
  requestWithAuth<PaginatedResponse<AdminAppointment>>(
    `/admin/appointments${buildQuery(filters)}`,
  );

export const getAdminParoleRequests = async (
  filters?: AdminListFilters,
): Promise<PaginatedResponse<AdminParoleRequest>> =>
  requestWithAuth<PaginatedResponse<AdminParoleRequest>>(
    `/admin/parole${buildQuery(filters)}`,
  );
