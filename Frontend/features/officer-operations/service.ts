import { requestWithAuth } from '@features/auth/services/auth.service';

export type Paginated<T = Record<string, unknown>> = { items: T[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } };
export const officerGet = <T>(path: string) => requestWithAuth<T>(path);
export const officerMutation = <T>(path: string, method: 'POST' | 'PATCH', body?: unknown) => requestWithAuth<T>(path, undefined, { method, body: body === undefined ? undefined : JSON.stringify(body) });
export const refreshOfficerEvents = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jailmeet:notifications-refresh'));
    window.dispatchEvent(new Event('jailmeet:officer-dashboard-refresh'));
  }
};
