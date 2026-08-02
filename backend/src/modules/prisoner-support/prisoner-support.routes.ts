import { Router } from 'express';

import {
  createPrisonerRequest,
  getAdminPrisonerRequest,
  getAdminPrisonerRequests,
  getPrisonerRequest,
  getPrisonerRequests,
  updateAdminPrisonerRequest,
} from './prisoner-support.controller';
import {
  validateAdminPrisonerSupportQuery,
  validateCreatePrisonerSupport,
  validatePrisonerSupportParams,
  validatePrisonerSupportQuery,
  validateUpdatePrisonerSupport,
} from './prisoner-support.schema';

export const registerPrisonerSupportRoutes = (router: Router): void => {
  router.post('/support-requests', validateCreatePrisonerSupport, createPrisonerRequest);
  router.get('/support-requests', validatePrisonerSupportQuery, getPrisonerRequests);
  router.get('/support-requests/:requestId', validatePrisonerSupportParams, getPrisonerRequest);
};

export const registerAdminPrisonerSupportRoutes = (router: Router): void => {
  router.get('/prisoner-support-requests', validateAdminPrisonerSupportQuery, getAdminPrisonerRequests);
  router.get('/prisoner-support-requests/:requestId', validatePrisonerSupportParams, getAdminPrisonerRequest);
  router.patch('/prisoner-support-requests/:requestId', validatePrisonerSupportParams, validateUpdatePrisonerSupport, updateAdminPrisonerRequest);
};
