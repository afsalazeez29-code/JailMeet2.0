import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerVisitorAppointmentRoutes } from '../appointments';
import {
  getProfile,
  updateProfile,
} from './visitor.controller';
import { validateUpdateVisitorProfile } from './visitor.schema';

const visitorRoutes = Router();

visitorRoutes.use(authenticate, authorizeRoles([Role.VISITOR]));

visitorRoutes.get('/profile', getProfile);
visitorRoutes.patch('/profile', validateUpdateVisitorProfile, updateProfile);
registerVisitorAppointmentRoutes(visitorRoutes);

export default visitorRoutes;
