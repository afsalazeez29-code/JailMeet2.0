import { Router } from 'express';

import {
  createAppointment,
  listAppointments,
  listOfficerAppointments,
  listPrisoners,
  reviewOfficerAppointment,
} from './appointment.controller';
import {
  validateAppointmentParams,
  validateAppointmentStatusFilter,
  validateCreateAppointment,
  validateReviewAppointment,
} from './appointment.schema';

export const registerVisitorAppointmentRoutes = (router: Router): void => {
  router.get('/prisoners', listPrisoners);
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