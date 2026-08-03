import { Router } from 'express';

import { registerOfficerAppointmentRoutes } from '../appointments';
import { registerOfficerChangeRequestRoutes } from '../appointment-change-requests';
import { registerOfficerVisitPassRoutes } from '../visit-passes';
import * as operations from './officer.operations.controller';
import * as validation from './officer.schema';

export const registerOfficerRoutes = (router: Router): void => {
  registerOfficerAppointmentRoutes(router);
  registerOfficerVisitPassRoutes(router);
  registerOfficerChangeRequestRoutes(router);
  router.get('/profile', operations.profile);
  router.get('/prisoners', validation.validatePrisonerQuery, operations.listPrisoners);
  router.get('/prisoners/:publicId', validation.validatePublicId, operations.prisonerDetail);
  router.get('/fir-records', validation.validateRecordQuery, operations.listFir);
  router.get('/fir-records/:recordReference', validation.validateRecordRef, operations.firDetail);
  router.post('/prisoners/:publicId/fir-records', validation.validatePublicId, validation.validateFirCreate, operations.createFir);
  router.patch('/fir-records/:recordReference', validation.validateRecordRef, validation.validateFirUpdate, operations.updateFir);
  router.post('/fir-records/:recordReference/archive', validation.validateRecordRef, validation.validateArchive, operations.archiveFir);
  router.get('/fir-records/:recordReference/history', validation.validateRecordRef, operations.firHistory);
  router.get('/health-records', validation.validateRecordQuery, operations.listHealth);
  router.get('/prisoners/:publicId/health-summary', validation.validatePublicId, operations.healthSummary);
  router.get('/health-records/:recordReference', validation.validateRecordRef, operations.healthDetail);
  router.post('/prisoners/:publicId/health-records', validation.validatePublicId, validation.validateMedicalCreate, operations.createHealth);
  router.patch('/health-records/:recordReference', validation.validateRecordRef, validation.validateMedicalUpdate, operations.updateHealth);
  router.post('/health-records/:recordReference/archive', validation.validateRecordRef, validation.validateArchive, operations.archiveHealth);
  router.get('/search', validation.validateSearchQuery, operations.search);
  router.get('/activity', validation.validateActivityQuery, operations.activity);
  router.get('/support-escalations', operations.support);
  router.patch('/support-escalations/:requestId', validation.validateSupportId, validation.validateSupportResponse, operations.supportResponse);
  router.get('/reports', validation.validateReportQuery, operations.reports);
};
