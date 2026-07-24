import { Request, Response } from 'express';

import * as adminService from './admin.service';
import { AdminError } from './admin.service';
import {
  AppointmentListQuery,
  CreateOfficerInput,
  CreatePrisonerInput,
  OfficerIdParam,
  ParoleListQuery,
  PrisonerIdParam,
  ProfileListQuery,
  UpdateOfficerInput,
  UpdatePrisonerInput,
  UpdateUserStatusInput,
  UserIdParam,
  UserListQuery,
  VisitorIdParam,
} from './admin.types';

const handleAdminError = (
  error: unknown,
  res: Response,
  fallbackMessage: string,
): void => {
  if (error instanceof AdminError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error('[AdminController]', error);
  res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

const query = <T>(res: Response): T => res.locals.validatedQuery as T;

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await adminService.listUsers(query<UserListQuery>(res));
    res.status(200).json({ success: true, message: 'Users fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch users');
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params as UserIdParam;
    const data = await adminService.getUserDetail(userId);
    res.status(200).json({ success: true, message: 'User fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch user');
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const { userId } = req.params as UserIdParam;
    const data = await adminService.updateUserStatus(
      req.user.id,
      userId,
      req.body as UpdateUserStatusInput,
    );
    res.status(200).json({ success: true, message: 'User status updated successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to update user status');
  }
};

export const listVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await adminService.listVisitors(query<ProfileListQuery>(res));
    res.status(200).json({ success: true, message: 'Visitors fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch visitors');
  }
};

export const getVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { visitorId } = req.params as VisitorIdParam;
    const data = await adminService.getVisitorDetail(visitorId);
    res.status(200).json({ success: true, message: 'Visitor fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch visitor');
  }
};

export const listOfficers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await adminService.listOfficers(query<ProfileListQuery>(res));
    res.status(200).json({ success: true, message: 'Officers fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch officers');
  }
};

export const getOfficer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { officerId } = req.params as OfficerIdParam;
    const data = await adminService.getOfficerDetail(officerId);
    res.status(200).json({ success: true, message: 'Officer fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch officer');
  }
};

export const createOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await adminService.createOfficer(
      req.body as CreateOfficerInput,
    );
    res.status(201).json({ success: true, message: 'Officer created successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to create officer');
  }
};

export const updateOfficer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { officerId } = req.params as OfficerIdParam;
    const data = await adminService.updateOfficer(
      officerId,
      req.body as UpdateOfficerInput,
    );
    res.status(200).json({ success: true, message: 'Officer updated successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to update officer');
  }
};

export const listPrisoners = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await adminService.listPrisoners(query<ProfileListQuery>(res));
    res.status(200).json({ success: true, message: 'Prisoners fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch prisoners');
  }
};

export const getPrisoner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prisonerId } = req.params as PrisonerIdParam;
    const data = await adminService.getPrisonerDetail(prisonerId);
    res.status(200).json({ success: true, message: 'Prisoner fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch prisoner');
  }
};

export const createPrisoner = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await adminService.createPrisoner(
      req.body as CreatePrisonerInput,
    );
    res.status(201).json({ success: true, message: 'Prisoner created successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to create prisoner');
  }
};

export const updatePrisoner = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { prisonerId } = req.params as PrisonerIdParam;
    const data = await adminService.updatePrisoner(
      prisonerId,
      req.body as UpdatePrisonerInput,
    );
    res.status(200).json({ success: true, message: 'Prisoner updated successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to update prisoner');
  }
};

export const listAppointments = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await adminService.listAppointments(
      query<AppointmentListQuery>(res),
    );
    res.status(200).json({ success: true, message: 'Appointments fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch appointments');
  }
};

export const listParoleRequests = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = await adminService.listParoleRequests(
      query<ParoleListQuery>(res),
    );
    res.status(200).json({ success: true, message: 'Parole requests fetched successfully', data });
  } catch (error) {
    handleAdminError(error, res, 'Failed to fetch parole requests');
  }
};
