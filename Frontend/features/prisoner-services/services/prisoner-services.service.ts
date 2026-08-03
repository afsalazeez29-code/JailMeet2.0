import { requestWithAuth } from '@features/auth/services/auth.service';
import type {
  PrisonerCaseSummary,
  PrisonerSupportCategory,
  PrisonerSupportPage,
  PrisonerSupportRequest,
  PrisonerVisit,
  PrisonerVisitHistoryPage,
  SupportStatus,
} from '@features/prisoner-services/types';
import type { JailRule } from '@features/visitor-services/types';

const query = (values: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const value = params.toString();
  return value ? `?${value}` : '';
};

export const getPrisonerUpcomingVisits = () =>
  requestWithAuth<PrisonerVisit[]>('/prisoner/upcoming-visits');

export const getPrisonerVisitHistory = (
  status?: 'COMPLETED' | 'CANCELLED' | 'EXPIRED',
  page = 1,
) => requestWithAuth<PrisonerVisitHistoryPage>(
  `/prisoner/visits/history${query({ status, page, limit: 10 })}`,
);

export const getPrisonerCaseSummary = () =>
  requestWithAuth<PrisonerCaseSummary>('/prisoner/case-summary');

export const getPrisonerRules = () =>
  requestWithAuth<JailRule[]>('/prisoner/jail-rules');

export const createPrisonerSupportRequest = (payload: {
  category: PrisonerSupportCategory;
  subject: string;
  message: string;
}) => requestWithAuth<PrisonerSupportRequest>('/prisoner/support-requests', undefined, {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const getPrisonerSupportRequests = (page = 1) =>
  requestWithAuth<PrisonerSupportPage>(
    `/prisoner/support-requests${query({ page, limit: 10 })}`,
  );

export const getAdminPrisonerSupportRequests = (filters: {
  status?: SupportStatus;
  category?: PrisonerSupportCategory;
  page?: number;
} = {}) => requestWithAuth<PrisonerSupportPage>(
  `/admin/prisoner-support-requests${query({ ...filters, limit: 20 })}`,
);

export const updateAdminPrisonerSupportRequest = (
  requestId: string,
  payload: {
    status: Exclude<SupportStatus, 'OPEN'>;
    adminReply?: string;
  },
) => requestWithAuth<PrisonerSupportRequest>(
  `/admin/prisoner-support-requests/${encodeURIComponent(requestId)}`,
  undefined,
  { method: 'PATCH', body: JSON.stringify(payload) },
);

export const escalateAdminPrisonerSupportRequest = (reference: string, officerPublicId: string) =>
  requestWithAuth<void>(`/admin/prisoner-support/${encodeURIComponent(reference)}/escalate`, undefined, { method: 'PATCH', body: JSON.stringify({ officerPublicId }) });
