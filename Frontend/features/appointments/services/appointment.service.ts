import { requestWithAuth } from '@features/auth/services/auth.service';
import {
  AdminAppointment,
  AppointmentStatus,
  AppointmentListFilters,
  CreateAppointmentInput,
  OfficerAppointment,
  PaginatedResponse,
  PublicPrisonerDetail,
  PrisonerOption,
  ReviewAppointmentInput,
  VisitorAppointment,
} from '@features/appointments/types';

const buildQuery = (filters: AppointmentListFilters = {}): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  return query ? `?${query}` : '';
};

export const getAvailablePrisoners = async (): Promise<PrisonerOption[]> =>
  requestWithAuth<PrisonerOption[]>('/visitor/prisoners');

export const getPublicPrisoner = async (
  publicId: string,
): Promise<PublicPrisonerDetail> =>
  requestWithAuth<PublicPrisonerDetail>(
    `/visitor/prisoners/${encodeURIComponent(publicId)}`,
  );

export const createVisitorAppointment = async (
  payload: CreateAppointmentInput,
): Promise<VisitorAppointment> => {
  const appointment = await requestWithAuth<VisitorAppointment>('/visitor/appointments', undefined, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('jailmeet:notifications-refresh'));
  }
  return appointment;
};

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

export const getAdminAppointments = async (
  filters?: AppointmentListFilters,
): Promise<PaginatedResponse<AdminAppointment>> =>
  requestWithAuth<PaginatedResponse<AdminAppointment>>(
    `/admin/appointments${buildQuery(filters)}`,
  );
