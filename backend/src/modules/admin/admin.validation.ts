import { AppointmentStatus, ParoleStatus, Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { newPasswordSchema } from '../../utils/password-policy';

const paginationFields = {
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};

export const userListQuerySchema = z
  .object({
    ...paginationFields,
    role: z.nativeEnum(Role).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  })
  .strict();

export const profileListQuerySchema = z.object(paginationFields).strict();

export const userIdParamSchema = z
  .object({
    userId: z.string().uuid('Valid user ID is required'),
  })
  .strict();

export const visitorIdParamSchema = z
  .object({
    visitorId: z.string().uuid('Valid visitor ID is required'),
  })
  .strict();

export const officerIdParamSchema = z
  .object({
    officerId: z.string().uuid('Valid officer ID is required'),
  })
  .strict();

export const prisonerIdParamSchema = z
  .object({
    prisonerId: z.string().uuid('Valid prisoner ID is required'),
  })
  .strict();

export const updateUserStatusSchema = z
  .object({
    isActive: z.boolean(),
  })
  .strict();

export const createOfficerSchema = z
  .object({
    email: z.string().trim().email('Valid email is required'),
    password: newPasswordSchema,
    name: z.string().trim().min(1, 'Name is required').max(100),
    phone: z.string().trim().max(20).optional(),
  })
  .strict();

export const updateOfficerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').max(100).optional(),
    phone: z.string().trim().max(20).nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export const createPrisonerSchema = z
  .object({
    email: z.string().trim().email('Valid email is required'),
    password: newPasswordSchema,
    name: z.string().trim().min(1, 'Name is required').max(100),
    age: z.coerce.number().int().min(1).max(120),
    gender: z.string().trim().min(1, 'Gender is required').max(50),
    admissionDate: z.string().datetime('Valid admission date is required'),
    caseDetails: z.string().trim().max(1000).nullable().optional(),
    sentencePeriod: z.string().trim().max(100).nullable().optional(),
    jailType: z.string().trim().max(100).nullable().optional(),
    jailName: z.string().trim().max(100).nullable().optional(),
    cellNumber: z.string().trim().max(50).nullable().optional(),
    profilePic: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

export const updatePrisonerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').max(100).optional(),
    age: z.coerce.number().int().min(1).max(120).optional(),
    gender: z.string().trim().min(1, 'Gender cannot be empty').max(50).optional(),
    admissionDate: z.string().datetime('Valid admission date is required').optional(),
    caseDetails: z.string().trim().max(1000).nullable().optional(),
    sentencePeriod: z.string().trim().max(100).nullable().optional(),
    jailType: z.string().trim().max(100).nullable().optional(),
    jailName: z.string().trim().max(100).nullable().optional(),
    cellNumber: z.string().trim().max(50).nullable().optional(),
    profilePic: z.string().trim().max(500).nullable().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  });

export const appointmentListQuerySchema = z
  .object({
    ...paginationFields,
    status: z.nativeEnum(AppointmentStatus).optional(),
  })
  .strict();

export const paroleListQuerySchema = z
  .object({
    ...paginationFields,
    status: z.nativeEnum(ParoleStatus).optional(),
  })
  .strict();


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
    } else {
      res.locals.validatedQuery = parsed.data;
    }

    next();
  };

export const validateUserListQuery = validate(
  userListQuerySchema,
  'query',
  'Invalid user filters',
);

export const validateProfileListQuery = validate(
  profileListQuerySchema,
  'query',
  'Invalid list filters',
);

export const validateUserIdParam = validate(
  userIdParamSchema,
  'params',
  'Invalid user ID',
);

export const validateVisitorIdParam = validate(
  visitorIdParamSchema,
  'params',
  'Invalid visitor ID',
);

export const validateOfficerIdParam = validate(
  officerIdParamSchema,
  'params',
  'Invalid officer ID',
);

export const validatePrisonerIdParam = validate(
  prisonerIdParamSchema,
  'params',
  'Invalid prisoner ID',
);

export const validateUpdateUserStatus = validate(
  updateUserStatusSchema,
  'body',
  'Invalid user status data',
);

export const validateCreateOfficer = validate(
  createOfficerSchema,
  'body',
  'Invalid officer data',
);

export const validateUpdateOfficer = validate(
  updateOfficerSchema,
  'body',
  'Invalid officer data',
);

export const validateCreatePrisoner = validate(
  createPrisonerSchema,
  'body',
  'Invalid prisoner data',
);

export const validateUpdatePrisoner = validate(
  updatePrisonerSchema,
  'body',
  'Invalid prisoner data',
);

export const validateAppointmentListQuery = validate(
  appointmentListQuerySchema,
  'query',
  'Invalid appointment filters',
);

export const validateParoleListQuery = validate(
  paroleListQuerySchema,
  'query',
  'Invalid parole filters',
);
