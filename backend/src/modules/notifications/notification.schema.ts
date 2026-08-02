import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

export const notificationListSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export const notificationParamsSchema = z.object({
  notificationId: z.string().uuid('Valid notification ID is required'),
});

export const validateNotificationList = validateRequest(
  notificationListSchema,
  'query',
  'Invalid notification filters',
);

export const validateNotificationParams = validateRequest(
  notificationParamsSchema,
  'params',
  'Invalid notification ID',
);
