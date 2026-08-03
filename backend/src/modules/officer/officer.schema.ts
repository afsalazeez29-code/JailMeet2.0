import { FirStatus, MedicalTreatmentStatus } from '@prisma/client';
import { z } from 'zod';
import { validateRequest } from '../../utils/validate';

const pageQuery = {
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
};
export const publicIdParams = z.object({ publicId: z.string().trim().regex(/^PRN-\d+$/i).transform((v) => v.toUpperCase()) });
export const recordParams = z.object({ recordReference: z.string().trim().regex(/^(FIR|MED)-[A-F0-9]{24,32}$/i).transform((v) => v.toUpperCase()) });
export const supportParams = z.object({ requestId: z.string().regex(/^PSR-[A-Z0-9]+$/) });
export const prisonerQuery = z.object({ ...pageQuery, active: z.enum(['true', 'false', 'all']).default('all') }).strict();
export const recordQuery = z.object({ ...pageQuery, prisonerPublicId: z.string().regex(/^PRN-\d+$/i).optional(), status: z.string().trim().max(40).optional() }).strict();
export const activityQuery = z.object({ ...pageQuery, action: z.string().trim().max(40).optional(), dateFrom: z.string().datetime().optional(), dateTo: z.string().datetime().optional() }).strict();
export const searchQuery = z.object({ q: z.string().trim().min(2).max(100), limit: z.coerce.number().int().min(1).max(20).default(10) }).strict();
export const reportQuery = z.object({ dateFrom: z.string().datetime().optional(), dateTo: z.string().datetime().optional() }).strict().refine((v) => !v.dateFrom || !v.dateTo || new Date(v.dateFrom) <= new Date(v.dateTo), { message: 'dateFrom must be before dateTo' });
export const firCreate = z.object({ firNumber: z.string().trim().min(3).max(60).regex(/^[A-Za-z0-9/_-]+$/), description: z.string().trim().max(4000).optional(), dateFiled: z.string().datetime(), status: z.nativeEnum(FirStatus).default(FirStatus.OPEN) }).strict();
export const firUpdate = z.object({ firNumber: z.string().trim().min(3).max(60).regex(/^[A-Za-z0-9/_-]+$/).optional(), description: z.string().trim().max(4000).optional(), dateFiled: z.string().datetime().optional(), status: z.enum([FirStatus.OPEN, FirStatus.UNDER_REVIEW, FirStatus.CLOSED]).optional(), changeReason: z.string().trim().min(5).max(500) }).strict();
export const archiveBody = z.object({ reason: z.string().trim().min(5).max(500) }).strict();
export const medicalCreate = z.object({ bloodGroup: z.string().trim().max(10).optional(), allergies: z.string().trim().max(1000).optional(), checkupDetails: z.string().trim().max(4000).optional(), checkupDate: z.string().datetime().optional(), medicalProfessional: z.string().trim().max(150).optional(), diagnosis: z.string().trim().max(2000).optional(), medication: z.string().trim().max(2000).optional(), treatmentStatus: z.nativeEnum(MedicalTreatmentStatus).default(MedicalTreatmentStatus.OBSERVATION), followUpDate: z.string().datetime().optional(), operationalInstructions: z.string().trim().max(1000).optional(), restrictedNotes: z.string().trim().max(4000).optional() }).strict();
export const medicalUpdate = medicalCreate.partial().extend({ changeReason: z.string().trim().min(5).max(500) }).strict();
export const supportResponse = z.object({ response: z.string().trim().min(5).max(2000), handled: z.boolean().default(true) }).strict();

export const validatePublicId = validateRequest(publicIdParams, 'params', 'Invalid prisoner public ID');
export const validateRecordRef = validateRequest(recordParams, 'params', 'Invalid record reference');
export const validateSupportId = validateRequest(supportParams, 'params', 'Invalid support request reference');
export const validatePrisonerQuery = validateRequest(prisonerQuery, 'query', 'Invalid prisoner filters');
export const validateRecordQuery = validateRequest(recordQuery, 'query', 'Invalid record filters');
export const validateActivityQuery = validateRequest(activityQuery, 'query', 'Invalid activity filters');
export const validateSearchQuery = validateRequest(searchQuery, 'query', 'Invalid search');
export const validateReportQuery = validateRequest(reportQuery, 'query', 'Invalid report range');
export const validateFirCreate = validateRequest(firCreate, 'body', 'Invalid FIR record');
export const validateFirUpdate = validateRequest(firUpdate, 'body', 'Invalid FIR update');
export const validateArchive = validateRequest(archiveBody, 'body', 'Invalid archive reason');
export const validateMedicalCreate = validateRequest(medicalCreate, 'body', 'Invalid health record');
export const validateMedicalUpdate = validateRequest(medicalUpdate, 'body', 'Invalid health-record update');
export const validateSupportResponse = validateRequest(supportResponse, 'body', 'Invalid Officer response');
