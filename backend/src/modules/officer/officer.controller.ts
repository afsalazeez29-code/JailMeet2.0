import { Request, Response } from 'express';

import {
  AppointmentError,
  getOfficerAppointments,
  reviewAppointment,
} from '../appointment';
import {
  AppointmentStatusFilterInput,
  ReviewAppointmentInput,
} from '../appointment/appointment.validation';

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
