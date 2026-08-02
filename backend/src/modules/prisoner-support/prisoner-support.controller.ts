import { Request, Response } from 'express';

import {
  createPrisonerSupportRequest,
  getAdminPrisonerSupportRequest,
  getPrisonerSupportRequest,
  listAdminPrisonerSupportRequests,
  listPrisonerSupportRequests,
  PrisonerSupportError,
  updateAdminPrisonerSupportRequest,
} from './prisoner-support.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof PrisonerSupportError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  console.error('[PrisonerSupportController]', error);
  res.status(500).json({ success: false, message: fallback });
};

const requireUser = (req: Request, res: Response): string | null => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return null;
  }
  return req.user.id;
};

export const createPrisonerRequest = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(201).json({
      success: true,
      message: 'Support request submitted',
      data: await createPrisonerSupportRequest(userId, req.body),
    });
  } catch (error) {
    handle(error, res, 'Failed to submit support request');
  }
};

export const getPrisonerRequests = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    const { page, limit } = res.locals.validatedQuery;
    res.status(200).json({
      success: true,
      message: 'Support requests fetched',
      data: await listPrisonerSupportRequests(userId, page, limit),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch support requests');
  }
};

export const getPrisonerRequest = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Support request fetched',
      data: await getPrisonerSupportRequest(userId, req.params.requestId as string),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch support request');
  }
};

export const getAdminPrisonerRequests = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Prisoner support requests fetched',
      data: await listAdminPrisonerSupportRequests(userId, res.locals.validatedQuery),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch Prisoner support requests');
  }
};

export const getAdminPrisonerRequest = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Prisoner support request fetched',
      data: await getAdminPrisonerSupportRequest(userId, req.params.requestId as string),
    });
  } catch (error) {
    handle(error, res, 'Failed to fetch Prisoner support request');
  }
};

export const updateAdminPrisonerRequest = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  try {
    res.status(200).json({
      success: true,
      message: 'Prisoner support request updated',
      data: await updateAdminPrisonerSupportRequest(userId, req.params.requestId as string, req.body),
    });
  } catch (error) {
    handle(error, res, 'Failed to update Prisoner support request');
  }
};
