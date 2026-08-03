import { Request, Response } from 'express';

import {
  getAdminDashboard,
  getOfficerDashboard,
  getPrisonerDashboard,
  getVisitorDashboard,
} from './dashboard.service';

export const adminDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  const data = await getAdminDashboard(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Admin dashboard retrieved successfully',
    data,
  });
};

export const officerDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  const data = await getOfficerDashboard(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Officer dashboard retrieved successfully',
    data,
  });
};

export const visitorDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const data = await getVisitorDashboard(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Visitor dashboard retrieved successfully',
    data,
  });
};

export const prisonerDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const data = await getPrisonerDashboard(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Prisoner dashboard retrieved successfully',
    data,
  });
};
