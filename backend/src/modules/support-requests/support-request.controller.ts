import { Request, Response } from 'express';

import {
  createVisitorSupportRequest,
  getAdminSupportRequest,
  getVisitorSupportRequest,
  listAdminSupportRequests,
  listVisitorSupportRequests,
  SupportRequestError,
  updateAdminSupportRequest,
} from './support-request.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof SupportRequestError) return void res.status(error.statusCode).json({ success: false, message: error.message });
  console.error('[SupportRequestController]', error);
  res.status(500).json({ success: false, message: fallback });
};

const userId = (req: Request, res: Response) => {
  if (!req.user) { res.status(401).json({ success: false, message: 'Authentication required' }); return null; }
  return req.user.id;
};

export const createVisitorRequest = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { res.status(201).json({ success: true, message: 'Support request submitted', data: await createVisitorSupportRequest(id, req.body) }); }
  catch (error) { handle(error, res, 'Failed to submit support request'); }
};

export const getVisitorRequests = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { const { page, limit } = res.locals.validatedQuery; res.status(200).json({ success: true, message: 'Support requests fetched', data: await listVisitorSupportRequests(id, page, limit) }); }
  catch (error) { handle(error, res, 'Failed to fetch support requests'); }
};

export const getVisitorRequest = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { res.status(200).json({ success: true, message: 'Support request fetched', data: await getVisitorSupportRequest(id, req.params.requestId) }); }
  catch (error) { handle(error, res, 'Failed to fetch support request'); }
};

export const getAdminRequests = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { res.status(200).json({ success: true, message: 'Support requests fetched', data: await listAdminSupportRequests(id, res.locals.validatedQuery) }); }
  catch (error) { handle(error, res, 'Failed to fetch support requests'); }
};

export const getAdminRequest = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { res.status(200).json({ success: true, message: 'Support request fetched', data: await getAdminSupportRequest(id, req.params.requestId) }); }
  catch (error) { handle(error, res, 'Failed to fetch support request'); }
};

export const updateAdminRequest = async (req: Request, res: Response) => {
  const id = userId(req, res); if (!id) return;
  try { res.status(200).json({ success: true, message: 'Support request updated', data: await updateAdminSupportRequest(id, req.params.requestId, req.body) }); }
  catch (error) { handle(error, res, 'Failed to update support request'); }
};
