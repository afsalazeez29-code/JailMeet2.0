import { Router } from 'express';

import { registerOfficerAppointmentRoutes } from '../appointments';
import { registerOfficerChangeRequestRoutes } from '../appointment-change-requests';
import { registerOfficerVisitPassRoutes } from '../visit-passes';

export const registerOfficerRoutes = (router: Router): void => {
  registerOfficerAppointmentRoutes(router);
  registerOfficerVisitPassRoutes(router);
  registerOfficerChangeRequestRoutes(router);
};
