import { Role } from '@prisma/client';
import { NextFunction, Request, Response, Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  adminDashboard,
  officerDashboard,
  prisonerDashboard,
  visitorDashboard,
} from './dashboard.controller';

const dashboardRoutes = Router();

const requireDashboardRole =
  (role: Role) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({
        success: false,
        message: 'Forbidden',
      });
      return;
    }

    next();
  };

dashboardRoutes.get(
  '/admin',
  authenticate,
  requireDashboardRole(Role.ADMIN),
  authorizeRoles([Role.ADMIN]),
  adminDashboard,
);

dashboardRoutes.get(
  '/officer',
  authenticate,
  requireDashboardRole(Role.OFFICER),
  authorizeRoles([Role.OFFICER]),
  officerDashboard,
);

dashboardRoutes.get(
  '/visitor',
  authenticate,
  requireDashboardRole(Role.VISITOR),
  authorizeRoles([Role.VISITOR]),
  visitorDashboard,
);

dashboardRoutes.get(
  '/prisoner',
  authenticate,
  requireDashboardRole(Role.PRISONER),
  authorizeRoles([Role.PRISONER]),
  prisonerDashboard,
);

export default dashboardRoutes;
