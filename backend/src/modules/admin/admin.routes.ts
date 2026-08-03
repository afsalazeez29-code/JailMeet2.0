import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerAdminJailRuleRoutes } from '../jail-rules';
import { registerAdminPrisonerSupportRoutes } from '../prisoner-support';
import { registerAdminSupportRoutes } from '../support-requests';
import * as adminController from './admin.controller';
import * as officerOperations from './admin.officer-operations';
import * as operations from './admin-operations.controller';
import {
  announcementSchema,
  auditQuery,
  correctionSchema,
  firQuery,
  healthCorrectionSchema,
  healthQuery,
  pageQuery,
  publicReferenceParams,
  repairSchema,
  reportQuery,
  searchQuery,
} from './admin-operations.validation';
import { validateRequest } from '../../utils/validate';
import { z } from 'zod';
import {
  validateAppointmentListQuery,
  validateCreateOfficer,
  validateCreatePrisoner,
  validateOfficerIdParam,
  validateParoleListQuery,
  validatePrisonerIdParam,
  validateProfileListQuery,
  validateUpdateUserStatus,
  validateUpdateOfficer,
  validateUpdatePrisoner,
  validateUserIdParam,
  validateUserListQuery,
  validateVisitorIdParam,
} from './admin.validation';

const adminRoutes = Router();

adminRoutes.use(authenticate, authorizeRoles([Role.ADMIN]));

adminRoutes.get('/profile', operations.profile);
adminRoutes.get('/search', validateRequest(searchQuery, 'query', 'Invalid search query'), operations.search);
adminRoutes.get('/system-integrity', operations.integrity);
adminRoutes.get('/system-integrity/security', validateRequest(pageQuery, 'query', 'Invalid security filters'), operations.security);
adminRoutes.post('/system-integrity/repairs/preview', validateRequest(repairSchema, 'body', 'Invalid repair request'), operations.previewRepair);
adminRoutes.post('/system-integrity/repairs/apply', validateRequest(repairSchema, 'body', 'Invalid repair request'), operations.applyRepair);
adminRoutes.get('/audit-logs', validateRequest(auditQuery, 'query', 'Invalid audit filters'), operations.auditLogs);
adminRoutes.get('/reports', validateRequest(reportQuery, 'query', 'Invalid report filters'), operations.reports);
adminRoutes.get('/fir-records', validateRequest(firQuery, 'query', 'Invalid FIR filters'), operations.firRecords);
adminRoutes.get('/fir-records/:reference/history', validateRequest(publicReferenceParams, 'params', 'Invalid FIR reference'), validateRequest(pageQuery, 'query', 'Invalid history filters'), operations.recordHistory);
adminRoutes.get('/fir-records/:reference', validateRequest(publicReferenceParams, 'params', 'Invalid FIR reference'), operations.firRecord);
adminRoutes.patch('/fir-records/:reference', validateRequest(publicReferenceParams, 'params', 'Invalid FIR reference'), validateRequest(correctionSchema, 'body', 'Invalid FIR correction'), operations.correctFir);
adminRoutes.get('/health-records', validateRequest(healthQuery, 'query', 'Invalid health-record filters'), operations.healthRecords);
adminRoutes.get('/health-records/:reference/history', validateRequest(publicReferenceParams, 'params', 'Invalid medical reference'), validateRequest(pageQuery, 'query', 'Invalid history filters'), operations.recordHistory);
adminRoutes.get('/health-records/:reference', validateRequest(publicReferenceParams, 'params', 'Invalid medical reference'), operations.healthRecord);
adminRoutes.patch('/health-records/:reference', validateRequest(publicReferenceParams, 'params', 'Invalid medical reference'), validateRequest(healthCorrectionSchema, 'body', 'Invalid health-record correction'), operations.correctHealth);
adminRoutes.get('/announcements', validateRequest(pageQuery, 'query', 'Invalid announcement filters'), operations.announcements);
adminRoutes.post('/announcements/preview', validateRequest(announcementSchema, 'body', 'Invalid announcement'), operations.announcementPreview);
adminRoutes.post('/announcements', validateRequest(announcementSchema, 'body', 'Invalid announcement'), operations.publishAnnouncement);

adminRoutes.get('/users', validateUserListQuery, adminController.listUsers);
adminRoutes.get('/users/:userId', validateUserIdParam, adminController.getUser);
adminRoutes.get('/users/:userId/deactivation-impact', validateUserIdParam, adminController.getDeactivationImpact);
adminRoutes.patch(
  '/users/:userId/status',
  validateUserIdParam,
  validateUpdateUserStatus,
  adminController.updateUserStatus,
);

adminRoutes.get('/visitors', validateProfileListQuery, adminController.listVisitors);
adminRoutes.get(
  '/visitors/:visitorId',
  validateVisitorIdParam,
  adminController.getVisitor,
);
adminRoutes.get('/officers', validateProfileListQuery, adminController.listOfficers);
adminRoutes.post('/officers', validateCreateOfficer, adminController.createOfficer);
adminRoutes.get(
  '/officers/:officerId',
  validateOfficerIdParam,
  adminController.getOfficer,
);
adminRoutes.patch(
  '/officers/:officerId',
  validateOfficerIdParam,
  validateUpdateOfficer,
  adminController.updateOfficer,
);
adminRoutes.get('/prisoners', validateProfileListQuery, adminController.listPrisoners);
adminRoutes.post('/prisoners', validateCreatePrisoner, adminController.createPrisoner);
adminRoutes.get(
  '/prisoners/:prisonerId',
  validatePrisonerIdParam,
  adminController.getPrisoner,
);
adminRoutes.patch(
  '/prisoners/:prisonerId',
  validatePrisonerIdParam,
  validateUpdatePrisoner,
  adminController.updatePrisoner,
);

adminRoutes.get(
  '/appointments',
  validateAppointmentListQuery,
  adminController.listAppointments,
);
adminRoutes.get(
  '/parole',
  validateParoleListQuery,
  adminController.listParoleRequests,
);

registerAdminJailRuleRoutes(adminRoutes);
registerAdminSupportRoutes(adminRoutes);
registerAdminPrisonerSupportRoutes(adminRoutes);

const prisonerPublic = validateRequest(z.object({ prisonerPublicId: z.string().regex(/^PRN-\d+$/i).transform((v) => v.toUpperCase()) }), 'params', 'Invalid prisoner public ID');
const officerPublic = validateRequest(z.object({ officerPublicId: z.string().regex(/^OFR-\d+$/i).transform((v) => v.toUpperCase()) }), 'params', 'Invalid Officer public ID');
const supportId = validateRequest(z.object({ requestId: z.string().regex(/^PSR-[A-Z0-9]+$/) }), 'params', 'Invalid support request reference');
adminRoutes.patch('/prisoners/:prisonerPublicId/assignment', prisonerPublic, validateRequest(z.object({ officerPublicId: z.string().regex(/^OFR-\d+$/i).nullable(), reason: z.string().trim().min(10).max(500) }).strict(), 'body', 'Invalid assignment'), officerOperations.assignPrisoner);
adminRoutes.patch('/officers/:officerPublicId/medical-access', officerPublic, validateRequest(z.object({ medicalAccessLevel: z.enum(['NONE', 'SUMMARY', 'MANAGE']), reason: z.string().trim().min(10).max(500) }).strict(), 'body', 'Invalid medical access'), officerOperations.setMedicalAccess);
adminRoutes.post('/officer-announcements', validateRequest(z.object({ title: z.string().trim().min(3).max(120), message: z.string().trim().min(3).max(500), link: z.string().regex(/^\/officer\/[a-z0-9?=&/_-]*$/i).optional(), priority: z.enum(['NORMAL', 'HIGH']).default('NORMAL') }).strict(), 'body', 'Invalid announcement'), officerOperations.announceOfficers);
adminRoutes.patch('/prisoner-support/:requestId/escalate', supportId, validateRequest(z.object({ officerPublicId: z.string().regex(/^OFR-\d+$/i) }).strict(), 'body', 'Invalid escalation'), officerOperations.escalateSupport);

export default adminRoutes;
