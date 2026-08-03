import { randomBytes } from 'crypto';

export type PublicReferencePrefix =
  | 'APT'
  | 'CHG'
  | 'FIR'
  | 'MED'
  | 'PAR'
  | 'SUP'
  | 'PSR'
  | 'RUL'
  | 'ANN';

export const createPublicReference = (prefix: PublicReferencePrefix): string =>
  `${prefix}-${randomBytes(12).toString('hex').toUpperCase()}`;

export const appointmentPendingKey = (
  visitorId: string,
  prisonerId: string,
  requestedDate: Date,
): string => `${visitorId}:${prisonerId}:${requestedDate.toISOString()}`;
