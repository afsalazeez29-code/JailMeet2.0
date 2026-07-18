import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  validateAppointmentParams,
  validateAppointmentStatusFilter,
  validateReviewAppointment,
} from '../appointment';
import {
  listOfficerAppointments,
  reviewOfficerAppointment,
} from './officer.controller';

const officerRoutes = Router();

officerRoutes.use(authenticate, authorizeRoles([Role.OFFICER]));

officerRoutes.get(
  '/appointments',
  validateAppointmentStatusFilter,
  listOfficerAppointments,
);
officerRoutes.patch(
  '/appointments/:appointmentId/status',
  validateAppointmentParams,
  validateReviewAppointment,
  reviewOfficerAppointment,
);

export default officerRoutes;
