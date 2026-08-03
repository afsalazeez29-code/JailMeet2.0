import { requestWithAuth } from '@features/auth/services/auth.service';
import {
  AdminParoleRequest,
  CreateParoleRequestInput,
  OfficerParoleRequest,
  PaginatedResponse,
  ParoleListFilters,
  ParoleStatus,
  PrisonerParoleRequest,
  ReviewParoleRequestInput,
} from '@features/parole/types';

const buildQuery = (filters: ParoleListFilters = {}): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  return query ? `?${query}` : '';
};

export const createParoleRequest = async (
  payload: CreateParoleRequestInput,
): Promise<PrisonerParoleRequest> =>
  requestWithAuth<PrisonerParoleRequest>('/prisoner/parole', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getPrisonerParoleRequests = async (): Promise<
  PrisonerParoleRequest[]
> => requestWithAuth<PrisonerParoleRequest[]>('/prisoner/parole');

export const getOfficerParoleRequests = async (
  status: ParoleStatus | 'ALL' = 'PENDING',
): Promise<PaginatedResponse<OfficerParoleRequest>> => {
  const query = `?status=${encodeURIComponent(status)}&page=1&limit=50`;

  return requestWithAuth<PaginatedResponse<OfficerParoleRequest>>(`/officer/parole${query}`);
};

export const reviewParoleRequest = async (
  paroleReference: string,
  payload: ReviewParoleRequestInput,
): Promise<OfficerParoleRequest> => {
  const request = await requestWithAuth<OfficerParoleRequest>(
    `/officer/parole/${paroleReference}/status`,
    undefined,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jailmeet:notifications-refresh'));
    window.dispatchEvent(new Event('jailmeet:officer-dashboard-refresh'));
  }
  return request;
};

export const getAdminParoleRequests = async (
  filters?: ParoleListFilters,
): Promise<PaginatedResponse<AdminParoleRequest>> =>
  requestWithAuth<PaginatedResponse<AdminParoleRequest>>(
    `/admin/parole${buildQuery(filters)}`,
  );
