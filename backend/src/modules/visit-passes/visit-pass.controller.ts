import { Request, Response } from 'express';

import {
  listVisitorHistory,
  listVisitorPasses,
  useVisitPass,
  verifyVisitPass,
  VisitPassError,
} from './visit-pass.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof VisitPassError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  console.error('[VisitPassController]', error);
  res.status(500).json({ success: false, message: fallback });
};

export const getVisitorPasses = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await listVisitorPasses(req.user.id);
    res.status(200).json({ success: true, message: 'Visit passes fetched', data });
  } catch (error) { handle(error, res, 'Failed to fetch visit passes'); }
};

export const getVisitorHistory = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await listVisitorHistory(req.user.id, res.locals.validatedQuery);
    res.status(200).json({ success: true, message: 'Visit history fetched', data });
  } catch (error) { handle(error, res, 'Failed to fetch visit history'); }
};

export const verifyOfficerPass = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await verifyVisitPass(req.user.id, req.body.passCode);
    res.status(200).json({ success: true, message: 'Visit pass is valid', data });
  } catch (error) { handle(error, res, 'Failed to verify visit pass'); }
};

export const useOfficerPass = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const data = await useVisitPass(req.user.id, req.params.passCode);
    res.status(200).json({ success: true, message: 'Visit completed', data });
  } catch (error) { handle(error, res, 'Failed to complete visit'); }
};
