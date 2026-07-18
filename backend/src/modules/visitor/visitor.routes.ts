import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import {
  createAppointment,
  getProfile,
  listAppointments,
  listPrisoners,
  updateProfile,
} from './visitor.controller';
import { validateCreateAppointment } from '../appointment';
import { validateUpdateVisitorProfile } from './visitor.validation';

const visitorRoutes = Router();

visitorRoutes.use(authenticate, authorizeRoles([Role.VISITOR]));

visitorRoutes.get('/profile', getProfile);
visitorRoutes.patch('/profile', validateUpdateVisitorProfile, updateProfile);
visitorRoutes.get('/prisoners', listPrisoners);
visitorRoutes.post('/appointments', validateCreateAppointment, createAppointment);
visitorRoutes.get('/appointments', listAppointments);

export default visitorRoutes;
