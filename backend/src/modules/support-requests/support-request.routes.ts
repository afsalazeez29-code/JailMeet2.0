import { Router } from 'express';

import {
  createVisitorRequest,
  getAdminRequest,
  getAdminRequests,
  getVisitorRequest,
  getVisitorRequests,
  updateAdminRequest,
} from './support-request.controller';
import {
  validateAdminSupportQuery,
  validateCreateSupportRequest,
  validateSupportParams,
  validateUpdateSupportRequest,
  validateVisitorSupportQuery,
} from './support-request.schema';

export const registerVisitorSupportRoutes = (router: Router): void => {
  router.post('/support-requests', validateCreateSupportRequest, createVisitorRequest);
  router.get('/support-requests', validateVisitorSupportQuery, getVisitorRequests);
  router.get('/support-requests/:requestId', validateSupportParams, getVisitorRequest);
};

export const registerAdminSupportRoutes = (router: Router): void => {
  router.get('/support-requests', validateAdminSupportQuery, getAdminRequests);
  router.get('/support-requests/:requestId', validateSupportParams, getAdminRequest);
  router.patch('/support-requests/:requestId', validateSupportParams, validateUpdateSupportRequest, updateAdminRequest);
};
