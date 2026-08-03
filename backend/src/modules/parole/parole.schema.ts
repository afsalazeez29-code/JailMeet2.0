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
    status: z.union([z.nativeEnum(ParoleStatus), z.literal('ALL')]).default(ParoleStatus.PENDING),
    search: z.string().trim().max(100).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strict()
  .refine((value) => !value.dateFrom || !value.dateTo || new Date(value.dateFrom) <= new Date(value.dateTo), { message: 'dateFrom must be before dateTo' });

export const reviewParoleRequestSchema = z
  .object({
    status: z.enum([ParoleStatus.ACCEPTED, ParoleStatus.REJECTED]),
    replyMessage: z.string().trim().max(1000, 'Reply message is too long').optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.status === ParoleStatus.REJECTED && !value.replyMessage) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['replyMessage'], message: 'A reply is required when rejecting parole' });
    }
  });

export const paroleParamsSchema = z.object({
  paroleReference: z.string().trim().regex(/^PAR-[A-F0-9]{24,32}$/i).transform((value) => value.toUpperCase()),
});


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

    if (source === 'query') res.locals.validatedQuery = parsed.data;
    else req[source] = parsed.data as never;

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
