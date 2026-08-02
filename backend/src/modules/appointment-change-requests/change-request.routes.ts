import { Router } from 'express';

import {
  createCancelRequest,
  createRescheduleRequest,
  getOfficerRequests,
  getVisitorRequests,
  reviewOfficerRequest,
} from './change-request.controller';
import {
  validateAppointmentParams,
  validateCancelRequest,
  validateOfficerRequestQuery,
  validateRequestParams,
  validateRescheduleRequest,
  validateReviewRequest,
  validateVisitorRequestQuery,
} from './change-request.schema';

export const registerVisitorChangeRequestRoutes = (router: Router): void => {
  router.post('/appointments/:appointmentId/cancel-request', validateAppointmentParams, validateCancelRequest, createCancelRequest);
  router.post('/appointments/:appointmentId/reschedule-request', validateAppointmentParams, validateRescheduleRequest, createRescheduleRequest);
  router.get('/appointment-change-requests', validateVisitorRequestQuery, getVisitorRequests);
};

export const registerOfficerChangeRequestRoutes = (router: Router): void => {
  router.get('/appointment-change-requests', validateOfficerRequestQuery, getOfficerRequests);
  router.patch('/appointment-change-requests/:requestId', validateRequestParams, validateReviewRequest, reviewOfficerRequest);
};
