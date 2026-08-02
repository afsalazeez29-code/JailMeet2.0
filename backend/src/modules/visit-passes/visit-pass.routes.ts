import { Router } from 'express';

import {
  getVisitorHistory,
  getVisitorPasses,
  useOfficerPass,
  verifyOfficerPass,
} from './visit-pass.controller';
import {
  validateHistoryQuery,
  validatePassCodeParams,
  validateVerifyPass,
} from './visit-pass.schema';

export const registerVisitorVisitPassRoutes = (router: Router): void => {
  router.get('/visit-passes', getVisitorPasses);
  router.get('/visit-history', validateHistoryQuery, getVisitorHistory);
};

export const registerOfficerVisitPassRoutes = (router: Router): void => {
  router.post('/visit-passes/verify', validateVerifyPass, verifyOfficerPass);
  router.patch('/visit-passes/:passCode/use', validatePassCodeParams, useOfficerPass);
};
