import { requestWithAuth } from '@features/auth/services/auth.service';
import {
  ChangeRequest,
  JailRule,
  NotificationPage,
  SupportCategory,
  SupportRequest,
  SupportRequestPage,
  SupportStatus,
  VisitHistoryPage,
  VisitPass,
} from '../types';

const query = (values: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const result = params.toString();
  return result ? `?${result}` : '';
};

export const getNotifications = (page = 1, limit = 10) =>
  requestWithAuth<NotificationPage>(`/notifications${query({ page, limit })}`);

export const markNotificationRead = (notificationId: string) =>
  requestWithAuth<{ notificationId: string }>(`/notifications/${encodeURIComponent(notificationId)}/read`, undefined, { method: 'PATCH' });

export const markAllNotificationsRead = () =>
  requestWithAuth<{ updatedCount: number }>('/notifications/read-all', undefined, { method: 'PATCH' });

export const getVisitPasses = () => requestWithAuth<VisitPass[]>('/visitor/visit-passes');

export const getVisitHistory = (status?: string, page = 1) =>
  requestWithAuth<VisitHistoryPage>(`/visitor/visit-history${query({ status, page, limit: 10 })}`);

export const submitCancellationRequest = (appointmentId: string, reason: string) =>
  requestWithAuth<ChangeRequest>(`/visitor/appointments/${encodeURIComponent(appointmentId)}/cancel-request`, undefined, {
    method: 'POST',
    body: JSON.stringify({ reason, confirmed: true }),
  });

export const submitRescheduleRequest = (appointmentId: string, requestedAt: string, reason: string) =>
  requestWithAuth<ChangeRequest>(`/visitor/appointments/${encodeURIComponent(appointmentId)}/reschedule-request`, undefined, {
    method: 'POST',
    body: JSON.stringify({ requestedAt, reason }),
  });

export const getVisitorChangeRequests = () =>
  requestWithAuth<ChangeRequest[]>('/visitor/appointment-change-requests');

export const getOfficerChangeRequests = (status = 'PENDING') =>
  requestWithAuth<ChangeRequest[]>(`/officer/appointment-change-requests${query({ status })}`);

export const reviewChangeRequest = (requestId: string, status: 'APPROVED' | 'REJECTED', officerReply?: string) =>
  requestWithAuth<ChangeRequest>(`/officer/appointment-change-requests/${encodeURIComponent(requestId)}`, undefined, {
    method: 'PATCH',
    body: JSON.stringify({ status, officerReply: officerReply || undefined }),
  });

export const verifyVisitPass = (passCode: string) =>
  requestWithAuth<VisitPass>('/officer/visit-passes/verify', undefined, {
    method: 'POST',
    body: JSON.stringify({ passCode }),
  });

export const useVisitPass = (passCode: string) =>
  requestWithAuth<VisitPass>(`/officer/visit-passes/${encodeURIComponent(passCode)}/use`, undefined, { method: 'PATCH' });

export const getVisitorJailRules = () => requestWithAuth<JailRule[]>('/visitor/jail-rules');
export const getAdminJailRules = (audience?: JailRule['audience']) =>
  requestWithAuth<JailRule[]>(`/admin/jail-rules${query({ audience })}`);

export const createJailRule = (payload: Pick<JailRule, 'title' | 'content' | 'category' | 'sortOrder' | 'isActive' | 'audience'>) =>
  requestWithAuth<JailRule>('/admin/jail-rules', undefined, { method: 'POST', body: JSON.stringify(payload) });

export const updateJailRule = (ruleId: string, payload: Partial<Pick<JailRule, 'title' | 'content' | 'category' | 'sortOrder' | 'isActive' | 'audience'>>) =>
  requestWithAuth<JailRule>(`/admin/jail-rules/${encodeURIComponent(ruleId)}`, undefined, { method: 'PATCH', body: JSON.stringify(payload) });

export const createSupportRequest = (payload: { category: SupportCategory; subject: string; message: string }) =>
  requestWithAuth<SupportRequest>('/visitor/support-requests', undefined, { method: 'POST', body: JSON.stringify(payload) });

export const getVisitorSupportRequests = (page = 1) =>
  requestWithAuth<SupportRequestPage>(`/visitor/support-requests${query({ page, limit: 10 })}`);

export const getAdminSupportRequests = (filters: { status?: SupportStatus; category?: SupportCategory; page?: number } = {}) =>
  requestWithAuth<SupportRequestPage>(`/admin/support-requests${query({ ...filters, limit: 20 })}`);

export const updateSupportRequest = (requestId: string, payload: { status: Exclude<SupportStatus, 'OPEN'>; adminReply?: string }) =>
  requestWithAuth<SupportRequest>(`/admin/support-requests/${encodeURIComponent(requestId)}`, undefined, { method: 'PATCH', body: JSON.stringify(payload) });
