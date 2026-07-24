import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerPrisonerRoutes } from './prisoner.controller';

const prisonerRoutes = Router();

prisonerRoutes.use(authenticate, authorizeRoles([Role.PRISONER]));

registerPrisonerRoutes(prisonerRoutes);

export default prisonerRoutes;