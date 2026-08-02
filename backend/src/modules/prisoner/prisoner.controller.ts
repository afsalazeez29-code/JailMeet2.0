import { Request, Response, Router } from 'express';

import {
  listPrisonerParoleRequests,
  submitParoleRequest,
} from '../parole/parole.controller';
import { validateCreateParoleRequest } from '../parole/parole.schema';
import { registerPrisonerSupportRoutes } from '../prisoner-support';
import { registerPrisonerVisitRoutes } from '../prisoner-visits';
import { registerPrisonerJailRuleRoutes } from '../jail-rules';
import {
  getPrisonerCaseSummary,
  getPrisonerProfile,
} from './prisoner.service';

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const profile = await getPrisonerProfile(req.user.id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Prisoner profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Prisoner profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    console.error('[PrisonerController] Fetch profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prisoner profile',
    });
  }
};

export const getCaseSummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const summary = await getPrisonerCaseSummary(req.user.id);
    if (!summary) {
      res.status(404).json({ success: false, message: 'Prisoner profile not found' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Case and sentence summary fetched successfully',
      data: summary,
    });
  } catch (error) {
    console.error('[PrisonerController] Fetch case summary failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case and sentence summary',
    });
  }
};

export const registerPrisonerRoutes = (router: Router): void => {
  router.get('/profile', getProfile);
  router.get('/case-summary', getCaseSummary);
  router.post('/parole', validateCreateParoleRequest, submitParoleRequest);
  router.get('/parole', listPrisonerParoleRequests);
  registerPrisonerVisitRoutes(router);
  registerPrisonerSupportRoutes(router);
  registerPrisonerJailRuleRoutes(router);
};
