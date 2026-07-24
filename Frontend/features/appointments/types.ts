import type { PaginatedData } from '@/types/api';

export type AppointmentStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type AppointmentListFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
};

export type PaginatedResponse<T> = PaginatedData<T>;


export type PrisonerOption = {
  id: string;
  name: string;
};

export type CreateAppointmentInput = {
  prisonerId: string;
  appointmentAt: string;
  reason: string;
};

export type VisitorAppointment = {
  id: string;
  appointmentAt: string;
  reason: string;
  status: AppointmentStatus;
  officerNote: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner: PrisonerOption;
};

export type OfficerAppointment = VisitorAppointment & {
  visitor: {
    id: string;
    name: string;
    phone: string;
  };
};

export type AdminAppointment = {
  id: string;
  relationship: string;
  message: string | null;
  requestedDate: string;
  status: AppointmentStatus;
  replyMessage: string | null;
  createdAt: string;
  updatedAt: string;
  visitor: { id: string; name: string; phone: string };
  prisoner: { id: string; name: string };
  officer: { id: string; name: string } | null;
};

export type ReviewAppointmentInput = {
  status: 'ACCEPTED' | 'REJECTED';
  officerNote?: string;
};
