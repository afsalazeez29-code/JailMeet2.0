import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  listOfficerParoleRequests,
  listPrisonerParoleRequests,
  reviewOfficerParoleRequest,
  submitParoleRequest,
} from './parole.controller';
import {
  validateCreateParoleRequest,
  validateParoleParams,
  validateParoleStatusFilter,
  validateReviewParoleRequest,
} from './parole.validation';

const paroleRoutes = Router();

paroleRoutes.post(
  '/prisoner/parole',
  authenticate,
  authorizeRoles([Role.PRISONER]),
  validateCreateParoleRequest,
  submitParoleRequest,
);

paroleRoutes.get(
  '/prisoner/parole',
  authenticate,
  authorizeRoles([Role.PRISONER]),
  listPrisonerParoleRequests,
);

paroleRoutes.get(
  '/officer/parole',
  authenticate,
  authorizeRoles([Role.OFFICER]),
  validateParoleStatusFilter,
  listOfficerParoleRequests,
);

paroleRoutes.patch(
  '/officer/parole/:paroleRequestId/status',
  authenticate,
  authorizeRoles([Role.OFFICER]),
  validateParoleParams,
  validateReviewParoleRequest,
  reviewOfficerParoleRequest,
);

export default paroleRoutes;
