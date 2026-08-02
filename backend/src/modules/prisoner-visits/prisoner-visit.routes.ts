import { Router } from 'express';

import { getUpcomingVisits, getVisitHistory } from './prisoner-visit.controller';
import { validatePrisonerVisitHistoryQuery } from './prisoner-visit.schema';

export const registerPrisonerVisitRoutes = (router: Router): void => {
  router.get('/upcoming-visits', getUpcomingVisits);
  router.get('/visits/history', validatePrisonerVisitHistoryQuery, getVisitHistory);
};
