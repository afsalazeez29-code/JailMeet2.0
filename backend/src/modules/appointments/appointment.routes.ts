import { Router } from 'express';

import {
  createAppointment,
  getPrisoner,
  listAppointments,
  listOfficerAppointments,
  listPrisoners,
  reviewOfficerAppointment,
} from './appointment.controller';
import {
  validateAppointmentParams,
  validateAppointmentStatusFilter,
  validateCreateAppointment,
  validatePrisonerPublicIdParams,
  validateReviewAppointment,
} from './appointment.schema';

export const registerVisitorAppointmentRoutes = (router: Router): void => {
  router.get('/prisoners', listPrisoners);
  router.get(
    '/prisoners/:prisonerPublicId',
    validatePrisonerPublicIdParams,
    getPrisoner,
  );
  router.post('/appointments', validateCreateAppointment, createAppointment);
  router.get('/appointments', listAppointments);
};

export const registerOfficerAppointmentRoutes = (router: Router): void => {
  router.get(
    '/appointments',
    validateAppointmentStatusFilter,
    listOfficerAppointments,
  );
  router.patch(
    '/appointments/:appointmentId/status',
    validateAppointmentParams,
    validateReviewAppointment,
    reviewOfficerAppointment,
  );
};
