import { requestWithAuth } from '@features/auth/services/auth.service';

const queryString = (values: Record<string, string | number | boolean | undefined>) => {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  return params.toString() ? `?${params}` : '';
};

export type Page<T> = { items: T[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } };
export type SearchItem = { type: string; reference: string; title: string; subtitle: string | null; href: string };
export type SearchData = { groups: Array<{ type: string; items: SearchItem[] }>; pagination: Page<never>['pagination'] };
export type IntegrityIssue = { key: string; type: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; identity: string; role?: string; summary: string; repairTypes: string[] };
export type IntegrityData = { scannedAt: string; counts: { total: number; high: number; medium: number; low: number }; issues: IntegrityIssue[]; migration: { expected: string; deploymentRequired: boolean } };

export const getAdminProfile = () => requestWithAuth<Record<string, unknown>>('/admin/profile');
export const searchAdmin = (q: string, page = 1, limit = 20) => requestWithAuth<SearchData>(`/admin/search${queryString({ q, page, limit })}`);
export const getIntegrity = () => requestWithAuth<IntegrityData>('/admin/system-integrity');
export const getSecurityEvents = (page = 1) => requestWithAuth<Page<Record<string, unknown>>>(`/admin/system-integrity/security${queryString({ page, limit: 20 })}`);
export const previewRepair = (payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>('/admin/system-integrity/repairs/preview', undefined, { method: 'POST', body: JSON.stringify(payload) });
export const applyRepair = (payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>('/admin/system-integrity/repairs/apply', undefined, { method: 'POST', body: JSON.stringify(payload) });
export const getAuditLogs = (filters: Record<string, string | number | undefined>) => requestWithAuth<Page<Record<string, unknown>>>(`/admin/audit-logs${queryString(filters)}`);
export const getReports = (from?: string, to?: string) => requestWithAuth<Record<string, unknown>>(`/admin/reports${queryString({ from, to })}`);
export const getFirRecords = (filters: Record<string, string | number | boolean | undefined>) => requestWithAuth<Page<Record<string, unknown>>>(`/admin/fir-records${queryString(filters)}`);
export const getFirRecord = (reference: string) => requestWithAuth<Record<string, unknown>>(`/admin/fir-records/${encodeURIComponent(reference)}`);
export const updateFirRecord = (reference: string, payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>(`/admin/fir-records/${encodeURIComponent(reference)}`, undefined, { method: 'PATCH', body: JSON.stringify(payload) });
export const getHealthRecords = (filters: Record<string, string | number | boolean | undefined>) => requestWithAuth<Page<Record<string, unknown>>>(`/admin/health-records${queryString(filters)}`);
export const getHealthRecord = (reference: string) => requestWithAuth<Record<string, unknown>>(`/admin/health-records/${encodeURIComponent(reference)}`);
export const updateHealthRecord = (reference: string, payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>(`/admin/health-records/${encodeURIComponent(reference)}`, undefined, { method: 'PATCH', body: JSON.stringify(payload) });
export const getAnnouncements = (page = 1) => requestWithAuth<Page<Record<string, unknown>>>(`/admin/announcements${queryString({ page, limit: 20 })}`);
export const previewAnnouncement = (payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>('/admin/announcements/preview', undefined, { method: 'POST', body: JSON.stringify(payload) });
export const publishAnnouncement = (payload: Record<string, unknown>) => requestWithAuth<Record<string, unknown>>('/admin/announcements', undefined, { method: 'POST', body: JSON.stringify(payload) });
