import { Role } from '@prisma/client';
import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles } from '../../middlewares/role.middleware';
import { registerOfficerRoutes } from './officer.controller';

const officerRoutes = Router();

officerRoutes.use(authenticate, authorizeRoles([Role.OFFICER]));

registerOfficerRoutes(officerRoutes);

export default officerRoutes;
