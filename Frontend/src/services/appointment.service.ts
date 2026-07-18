import { requestWithAuth } from '@/services/auth.service';
import {
  AppointmentStatus,
  CreateAppointmentInput,
  OfficerAppointment,
  PrisonerOption,
  ReviewAppointmentInput,
  VisitorAppointment,
} from '@/types/appointment';

export const getAvailablePrisoners = async (): Promise<PrisonerOption[]> =>
  requestWithAuth<PrisonerOption[]>('/visitor/prisoners');

export const createVisitorAppointment = async (
  payload: CreateAppointmentInput,
): Promise<VisitorAppointment> =>
  requestWithAuth<VisitorAppointment>('/visitor/appointments', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getVisitorAppointments = async (): Promise<
  VisitorAppointment[]
> => requestWithAuth<VisitorAppointment[]>('/visitor/appointments');

export const getOfficerAppointments = async (
  status?: AppointmentStatus,
): Promise<OfficerAppointment[]> => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';

  return requestWithAuth<OfficerAppointment[]>(
    `/officer/appointments${query}`,
  );
};

export const reviewAppointment = async (
  appointmentId: string,
  payload: ReviewAppointmentInput,
): Promise<OfficerAppointment> =>
  requestWithAuth<OfficerAppointment>(
    `/officer/appointments/${appointmentId}/status`,
    undefined,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
