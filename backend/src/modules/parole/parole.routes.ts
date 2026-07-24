import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerPrisonerRoutes } from '../prisoner';
import {
  listOfficerParoleRequests,
  reviewOfficerParoleRequest,
} from './parole.controller';
import {
  validateParoleParams,
  validateParoleStatusFilter,
  validateReviewParoleRequest,
} from './parole.schema';

const paroleRoutes = Router();
const prisonerParoleRoutes = Router();

prisonerParoleRoutes.use(authenticate, authorizeRoles([Role.PRISONER]));
registerPrisonerRoutes(prisonerParoleRoutes);
paroleRoutes.use('/prisoner', prisonerParoleRoutes);

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