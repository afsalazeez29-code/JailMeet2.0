import { ParoleStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const createParoleRequestSchema = z
  .object({
    relativeName: z
      .string()
      .trim()
      .min(2, 'Relative name must be at least 2 characters')
      .max(100, 'Relative name is too long'),
    relationship: z
      .string()
      .trim()
      .min(2, 'Relationship must be at least 2 characters')
      .max(100, 'Relationship is too long'),
    purpose: z
      .string()
      .trim()
      .min(10, 'Purpose must be at least 10 characters')
      .max(1000, 'Purpose is too long'),
    message: z.string().trim().max(1000, 'Message is too long').optional(),
    fromDate: z.string().datetime('Valid from date is required'),
    toDate: z.string().datetime('Valid to date is required'),
  })
  .strict();

export const paroleStatusFilterSchema = z
  .object({
    status: z.nativeEnum(ParoleStatus).optional(),
  })
  .strict();

export const reviewParoleRequestSchema = z
  .object({
    status: z.enum([ParoleStatus.ACCEPTED, ParoleStatus.REJECTED]),
    replyMessage: z
      .string()
      .trim()
      .max(1000, 'Reply message is too long')
      .optional(),
  })
  .strict();

export const paroleParamsSchema = z.object({
  paroleRequestId: z.string().trim().min(1, 'Parole request ID is required'),
});

export type CreateParoleRequestInput = z.infer<
  typeof createParoleRequestSchema
>;
export type ParoleStatusFilterInput = z.infer<
  typeof paroleStatusFilterSchema
>;
export type ReviewParoleRequestInput = z.infer<
  typeof reviewParoleRequestSchema
>;

const validate =
  (
    schema: z.ZodType,
    source: 'body' | 'query' | 'params',
    message: string,
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message,
      });
      return;
    }

    if (source !== 'query') {
      req[source] = parsed.data as never;
    }

    next();
  };

export const validateCreateParoleRequest = validate(
  createParoleRequestSchema,
  'body',
  'Invalid parole request data',
);

export const validateParoleStatusFilter = validate(
  paroleStatusFilterSchema,
  'query',
  'Invalid parole status',
);

export const validateReviewParoleRequest = validate(
  reviewParoleRequestSchema,
  'body',
  'Invalid parole review data',
);

export const validateParoleParams = validate(
  paroleParamsSchema,
  'params',
  'Invalid parole request data',
);
