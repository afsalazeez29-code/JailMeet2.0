import {
  ActionType,
  FirStatus,
  MedicalTreatmentStatus,
  Role,
} from '@prisma/client';
import { z } from 'zod';

import { AUDIT_RESULTS } from '../../constants/audit-results';

export const pageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export const searchQuery = z.object({
  q: z.string().trim().min(2).max(100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();

export const auditQuery = pageQuery.extend({
  actor: z.string().trim().max(100).optional(),
  role: z.nativeEnum(Role).optional(),
  action: z.nativeEnum(ActionType).optional(),
  entity: z.string().trim().max(80).optional(),
  result: z.enum(AUDIT_RESULTS).optional(),
  reference: z.string().trim().max(100).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).strict().refine((value) => !value.from || !value.to || value.from <= value.to, {
  message: 'From date must not be after to date',
});

export const reportQuery = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
}).strict().refine((value) => {
  if (!value.from || !value.to) return true;
  return value.from <= value.to && value.to.getTime() - value.from.getTime() <= 366 * 86400000;
}, { message: 'Report range must be valid and no longer than 366 days' });

export const repairSchema = z.object({
  repairType: z.enum([
    'GENERATE_VISITOR_PUBLIC_ID',
    'GENERATE_OFFICER_PUBLIC_ID',
    'GENERATE_PRISONER_PUBLIC_ID',
    'DEACTIVATE_ORPHAN_LOGIN',
    'REMOVE_INVALID_ASSIGNMENT',
    'REASSIGN_PRISONER',
  ]),
  reason: z.string().trim().min(10).max(500),
  confirmation: z.string().trim().max(100),
  email: z.string().email().optional(),
  prisonerPublicId: z.string().regex(/^PRN-\d+$/).optional(),
  officerPublicId: z.string().regex(/^OFR-\d+$/).optional(),
}).strict();

export const publicReferenceParams = z.object({
  reference: z.string().trim().regex(/^[A-Z]{3}-[A-Z0-9]+$/).max(80),
}).strict();

export const firQuery = pageQuery.extend({
  search: z.string().trim().max(100).optional(),
  status: z.nativeEnum(FirStatus).optional(),
  requiresAttention: z.coerce.boolean().optional(),
}).strict();

export const healthQuery = pageQuery.extend({
  search: z.string().trim().max(100).optional(),
  status: z.nativeEnum(MedicalTreatmentStatus).optional(),
  requiresAttention: z.coerce.boolean().optional(),
  followUpFrom: z.coerce.date().optional(),
  followUpTo: z.coerce.date().optional(),
}).strict();

export const correctionSchema = z.object({
  reason: z.string().trim().min(10).max(500),
  status: z.nativeEnum(FirStatus).optional(),
  firNumber: z.string().trim().min(2).max(100).optional(),
  dateFiled: z.coerce.date().optional(),
  archive: z.boolean().optional(),
}).strict().refine((value) => value.status || value.firNumber || value.dateFiled || value.archive, {
  message: 'At least one correction is required',
});

export const healthCorrectionSchema = z.object({
  reason: z.string().trim().min(10).max(500),
  treatmentStatus: z.nativeEnum(MedicalTreatmentStatus).optional(),
  followUpDate: z.coerce.date().nullable().optional(),
  medicalProfessional: z.string().trim().max(120).nullable().optional(),
  operationalInstructions: z.string().trim().max(1000).nullable().optional(),
  archive: z.boolean().optional(),
}).strict().refine((value) => value.treatmentStatus || value.followUpDate !== undefined || value.medicalProfessional !== undefined || value.operationalInstructions !== undefined || value.archive, {
  message: 'At least one correction is required',
});

export const announcementSchema = z.object({
  targetRole: z.enum([Role.OFFICER, Role.VISITOR, Role.PRISONER]),
  title: z.string().trim().min(3).max(120),
  message: z.string().trim().min(3).max(500),
  priority: z.enum(['NORMAL', 'HIGH']).default('NORMAL'),
  link: z.string().regex(/^\/(admin|officer|visitor|prisoner)\/[a-z0-9?=&/_-]*$/i).optional(),
  activeFrom: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
}).strict().refine((value) => !value.expiresAt || !value.activeFrom || value.expiresAt > value.activeFrom, {
  message: 'Expiration must be after the active date',
});

export const statusTargetSchema = z.object({
  role: z.nativeEnum(Role),
  email: z.string().email().optional(),
  publicId: z.string().regex(/^(VIS|OFR|PRN)-\d+$/).optional(),
  isActive: z.boolean().optional(),
  reason: z.string().trim().min(10).max(500).optional(),
  confirmation: z.string().trim().max(100).optional(),
}).strict().refine((value) => Boolean(value.email || value.publicId), {
  message: 'A safe account identity is required',
});
