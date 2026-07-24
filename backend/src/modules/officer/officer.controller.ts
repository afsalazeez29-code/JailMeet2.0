import { Router } from 'express';

import { registerOfficerAppointmentRoutes } from '../appointments';

export const registerOfficerRoutes = (router: Router): void => {
  registerOfficerAppointmentRoutes(router);
};