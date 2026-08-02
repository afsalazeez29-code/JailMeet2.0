import { Request, Response } from 'express';

import {
  listPrisonerUpcomingVisits,
  listPrisonerVisitHistory,
  PrisonerVisitError,
} from './prisoner-visit.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof PrisonerVisitError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  console.error('[PrisonerVisitController]', error);
  res.status(500).json({ success: false, message: fallback });
};

const requireUser = (req: Request, res: Response): string | null => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return null;
  }
  return req.user.id;
};

export const getUpcomingVisits = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Upcoming visits fetched',
      data: await listPrisonerUpcomingVisits(userId),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch upcoming visits');
  }
};

export const getVisitHistory = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Visitor history fetched',
      data: await listPrisonerVisitHistory(userId, res.locals.validatedQuery),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch visitor history');
  }
};
