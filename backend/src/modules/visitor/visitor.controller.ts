import { Request, Response } from 'express';

import {
  AppointmentError,
  createVisitorAppointment,
  getPrisonerOptions,
  getVisitorAppointments,
} from '../appointment';
import {
  getVisitorProfile,
  updateVisitorProfile,
} from './visitor.service';
import { UpdateVisitorProfileInput } from './visitor.validation';

export const getProfile = async (
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

  try {
    const profile = await getVisitorProfile(req.user.id);

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Visitor profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Visitor profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    console.error('[VisitorController] Fetch profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor profile',
    });
  }
};

export const updateProfile = async (
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

  try {
    const profile = await updateVisitorProfile(
      req.user.id,
      req.body as UpdateVisitorProfileInput,
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Visitor profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Visitor profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('[VisitorController] Update profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor profile',
    });
  }
};

export const listPrisoners = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const prisoners = await getPrisonerOptions();

    res.status(200).json({
      success: true,
      message: 'Prisoners fetched successfully',
      data: prisoners,
    });
  } catch (error) {
    console.error('[VisitorController] Fetch prisoners failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prisoners',
    });
  }
};

export const createAppointment = async (
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

  try {
    const appointment = await createVisitorAppointment(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    if (error instanceof AppointmentError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error('[VisitorController] Create appointment failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
    });
  }
};

export const listAppointments = async (
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

  try {
    const appointments = await getVisitorAppointments(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Appointments fetched successfully',
      data: appointments,
    });
  } catch (error) {
    if (error instanceof AppointmentError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error('[VisitorController] Fetch appointments failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
    });
  }
};
