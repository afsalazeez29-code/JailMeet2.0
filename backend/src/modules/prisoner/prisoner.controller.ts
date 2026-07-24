import { Router } from 'express';

import {
  listPrisonerParoleRequests,
  submitParoleRequest,
} from '../parole/parole.controller';
import { validateCreateParoleRequest } from '../parole/parole.schema';

export const registerPrisonerRoutes = (router: Router): void => {
  router.post('/parole', validateCreateParoleRequest, submitParoleRequest);
  router.get('/parole', listPrisonerParoleRequests);
};