import { Request, Response } from 'express';

import {
  ChangeRequestError,
  listOfficerChangeRequests,
  listVisitorChangeRequests,
  requestCancellation,
  requestReschedule,
  reviewChangeRequest,
} from './change-request.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof ChangeRequestError) return void res.status(error.statusCode).json({ success: false, message: error.message });
  console.error('[ChangeRequestController]', error);
  res.status(500).json({ success: false, message: fallback });
};

export const createCancelRequest = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await requestCancellation(req.user.id, req.params.appointmentId, req.body.reason);
    res.status(201).json({ success: true, message: 'Cancellation request submitted', data });
  } catch (error) { handle(error, res, 'Failed to submit cancellation request'); }
};

export const createRescheduleRequest = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await requestReschedule(req.user.id, req.params.appointmentId, req.body.requestedAt, req.body.reason);
    res.status(201).json({ success: true, message: 'Reschedule request submitted', data });
  } catch (error) { handle(error, res, 'Failed to submit reschedule request'); }
};

export const getVisitorRequests = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await listVisitorChangeRequests(req.user.id, res.locals.validatedQuery.status);
    res.status(200).json({ success: true, message: 'Change requests fetched', data });
  } catch (error) { handle(error, res, 'Failed to fetch change requests'); }
};

export const getOfficerRequests = async (_req: Request, res: Response) => {
  try {
    const data = await listOfficerChangeRequests(res.locals.validatedQuery.status, res.locals.validatedQuery.requestType);
    res.status(200).json({ success: true, message: 'Change requests fetched', data });
  } catch (error) { handle(error, res, 'Failed to fetch change requests'); }
};

export const reviewOfficerRequest = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await reviewChangeRequest(req.user.id, req.params.requestId, req.body.status, req.body.officerReply);
    res.status(200).json({ success: true, message: 'Change request reviewed', data });
  } catch (error) { handle(error, res, 'Failed to review change request'); }
};
