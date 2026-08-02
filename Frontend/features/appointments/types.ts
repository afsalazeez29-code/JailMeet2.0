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
  publicId: string;
  name: string;
  profilePic: string | null;
  caseDetails: string | null;
  jailType: string | null;
  jailName: string | null;
};

export type PublicPrisonerDetail = PrisonerOption & {
  age: number;
  gender: string;
  admissionDate: string;
  sentencePeriod: string | null;
};

export type CreateAppointmentInput = {
  prisonerPublicId: string;
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
  prisoner: Pick<PrisonerOption, 'publicId' | 'name' | 'profilePic'>;
  hasPendingChangeRequest: boolean;
};

export type OfficerAppointment = VisitorAppointment & {
  visitor: {
    publicId: string | null;
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
  visitor: { id: string; publicId: string | null; name: string; phone: string };
  prisoner: { id: string; name: string };
  officer: { id: string; name: string } | null;
};

export type ReviewAppointmentInput = {
  status: 'ACCEPTED' | 'REJECTED';
  officerNote?: string;
};
