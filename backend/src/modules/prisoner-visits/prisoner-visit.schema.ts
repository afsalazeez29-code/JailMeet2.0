import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

export const prisonerVisitHistoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['COMPLETED', 'CANCELLED', 'EXPIRED']).optional(),
}).strict();

export const validatePrisonerVisitHistoryQuery = validateRequest(
  prisonerVisitHistoryQuerySchema,
  'query',
  'Invalid visit-history filters',
);
