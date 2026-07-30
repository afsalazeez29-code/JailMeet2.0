import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  adminDashboard,
  officerDashboard,
  prisonerDashboard,
  visitorDashboard,
} from './dashboard.controller';

const dashboardRoutes = Router();

dashboardRoutes.get(
  '/admin',
  authenticate,
  authorizeRoles([Role.ADMIN]),
  adminDashboard,
);

dashboardRoutes.get(
  '/officer',
  authenticate,
  authorizeRoles([Role.OFFICER]),
  officerDashboard,
);

dashboardRoutes.get(
  '/visitor',
  authenticate,
  authorizeRoles([Role.VISITOR]),
  visitorDashboard,
);

dashboardRoutes.get(
  '/prisoner',
  authenticate,
  authorizeRoles([Role.PRISONER]),
  prisonerDashboard,
);

export default dashboardRoutes;
