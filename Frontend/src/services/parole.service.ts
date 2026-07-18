import { requestWithAuth } from '@/services/auth.service';
import {
  CreateParoleRequestInput,
  OfficerParoleRequest,
  ParoleStatus,
  PrisonerParoleRequest,
  ReviewParoleRequestInput,
} from '@/types/parole';

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
