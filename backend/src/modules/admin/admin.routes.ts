import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerAdminJailRuleRoutes } from '../jail-rules';
import { registerAdminPrisonerSupportRoutes } from '../prisoner-support';
import { registerAdminSupportRoutes } from '../support-requests';
import * as adminController from './admin.controller';
import {
  validateAppointmentListQuery,
  validateCreateOfficer,
  validateCreatePrisoner,
  validateOfficerIdParam,
  validateParoleListQuery,
  validatePrisonerIdParam,
  validateProfileListQuery,
  validateUpdateUserStatus,
  validateUpdateOfficer,
  validateUpdatePrisoner,
  validateUserIdParam,
  validateUserListQuery,
  validateVisitorIdParam,
} from './admin.validation';

const adminRoutes = Router();

adminRoutes.use(authenticate, authorizeRoles([Role.ADMIN]));

adminRoutes.get('/users', validateUserListQuery, adminController.listUsers);
adminRoutes.get('/users/:userId', validateUserIdParam, adminController.getUser);
adminRoutes.patch(
  '/users/:userId/status',
  validateUserIdParam,
  validateUpdateUserStatus,
  adminController.updateUserStatus,
);

adminRoutes.get('/visitors', validateProfileListQuery, adminController.listVisitors);
adminRoutes.get(
  '/visitors/:visitorId',
  validateVisitorIdParam,
  adminController.getVisitor,
);
adminRoutes.get('/officers', validateProfileListQuery, adminController.listOfficers);
adminRoutes.post('/officers', validateCreateOfficer, adminController.createOfficer);
adminRoutes.get(
  '/officers/:officerId',
  validateOfficerIdParam,
  adminController.getOfficer,
);
adminRoutes.patch(
  '/officers/:officerId',
  validateOfficerIdParam,
  validateUpdateOfficer,
  adminController.updateOfficer,
);
adminRoutes.get('/prisoners', validateProfileListQuery, adminController.listPrisoners);
adminRoutes.post('/prisoners', validateCreatePrisoner, adminController.createPrisoner);
adminRoutes.get(
  '/prisoners/:prisonerId',
  validatePrisonerIdParam,
  adminController.getPrisoner,
);
adminRoutes.patch(
  '/prisoners/:prisonerId',
  validatePrisonerIdParam,
  validateUpdatePrisoner,
  adminController.updatePrisoner,
);

adminRoutes.get(
  '/appointments',
  validateAppointmentListQuery,
  adminController.listAppointments,
);
adminRoutes.get(
  '/parole',
  validateParoleListQuery,
  adminController.listParoleRequests,
);

registerAdminJailRuleRoutes(adminRoutes);
registerAdminSupportRoutes(adminRoutes);
registerAdminPrisonerSupportRoutes(adminRoutes);

export default adminRoutes;
