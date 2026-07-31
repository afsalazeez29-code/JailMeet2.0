import { Request, Response } from 'express';

import {
  AppointmentError,
  createVisitorAppointment,
  getOfficerAppointments,
  getPublicPrisoner,
  getPrisonerOptions,
  getVisitorAppointments,
  reviewAppointment,
} from './appointment.service';
import {
  AppointmentStatusFilterInput,
  ReviewAppointmentInput,
} from './appointment.types';

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

export const getPrisoner = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const prisoner = await getPublicPrisoner(req.params.prisonerPublicId);
    res.status(200).json({
      success: true,
      message: 'Prisoner fetched successfully',
      data: prisoner,
    });
  } catch (error) {
    if (error instanceof AppointmentError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }

    console.error('[VisitorController] Fetch prisoner failed:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch prisoner' });
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

export const listOfficerAppointments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const appointments = await getOfficerAppointments(
      req.query as AppointmentStatusFilterInput,
    );

    res.status(200).json({
      success: true,
      message: 'Officer appointments fetched successfully',
      data: appointments,
    });
  } catch (error) {
    console.error('[OfficerController] Fetch appointments failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch officer appointments',
    });
  }
};

export const reviewOfficerAppointment = async (
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
    const { appointmentId } = req.params as { appointmentId: string };
    const appointment = await reviewAppointment(
      req.user.id,
      appointmentId,
      req.body as ReviewAppointmentInput,
    );

    res.status(200).json({
      success: true,
      message: 'Appointment reviewed successfully',
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

    console.error('[OfficerController] Review appointment failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review appointment',
    });
  }
};
