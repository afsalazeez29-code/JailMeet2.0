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
  status?: ParoleStatus,
): Promise<OfficerParoleRequest[]> => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';

  return requestWithAuth<OfficerParoleRequest[]>(`/officer/parole${query}`);
};

export const reviewParoleRequest = async (
  paroleRequestId: string,
  payload: ReviewParoleRequestInput,
): Promise<OfficerParoleRequest> =>
  requestWithAuth<OfficerParoleRequest>(
    `/officer/parole/${paroleRequestId}/status`,
    undefined,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );

export const getAdminParoleRequests = async (
  filters?: ParoleListFilters,
): Promise<PaginatedResponse<AdminParoleRequest>> =>
  requestWithAuth<PaginatedResponse<AdminParoleRequest>>(
    `/admin/parole${buildQuery(filters)}`,
  );
