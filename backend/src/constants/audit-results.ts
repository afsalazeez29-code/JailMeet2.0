export const AUDIT_RESULTS = [
  'SUCCESS',
  'FAILURE',
  'FAILED',
  'DENIED',
  'FORBIDDEN',
  'BLOCKED',
  'CONFLICT',
  'ASSIGNED',
  'UNASSIGNED',
  'VALID',
  'INVALID',
  'INVALID_APPOINTMENT',
  'NOT_FOUND',
  'EXPIRED',
  'ACTIVE',
  'USED',
  'REVOKED',
  'RESTRICTED_VIEW',
  'HANDLED',
  'COMPLETED',
] as const;

export type AuditResult = (typeof AUDIT_RESULTS)[number];

export const isAuditResult = (value: unknown): value is AuditResult =>
  typeof value === 'string' &&
  (AUDIT_RESULTS as readonly string[]).includes(value);
