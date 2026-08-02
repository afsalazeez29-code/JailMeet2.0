import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerVisitorAppointmentRoutes } from '../appointments';
import { registerVisitorChangeRequestRoutes } from '../appointment-change-requests';
import { registerVisitorJailRuleRoutes } from '../jail-rules';
import { registerVisitorSupportRoutes } from '../support-requests';
import { registerVisitorVisitPassRoutes } from '../visit-passes';
import {
  deleteProfileImage,
  getProfile,
  updateProfileImage,
  updateProfile,
} from './visitor.controller';
import { acceptVisitorProfileImage } from './visitor-image.middleware';
import { validateUpdateVisitorProfile } from './visitor.schema';

const visitorRoutes = Router();

visitorRoutes.use(authenticate, authorizeRoles([Role.VISITOR]));

visitorRoutes.get('/profile', getProfile);
visitorRoutes.patch('/profile', validateUpdateVisitorProfile, updateProfile);
visitorRoutes.put('/profile/image', acceptVisitorProfileImage, updateProfileImage);
visitorRoutes.delete('/profile/image', deleteProfileImage);
registerVisitorAppointmentRoutes(visitorRoutes);
registerVisitorVisitPassRoutes(visitorRoutes);
registerVisitorChangeRequestRoutes(visitorRoutes);
registerVisitorJailRuleRoutes(visitorRoutes);
registerVisitorSupportRoutes(visitorRoutes);

export default visitorRoutes;
