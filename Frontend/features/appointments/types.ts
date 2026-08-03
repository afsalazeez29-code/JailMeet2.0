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

export type OfficerAppointment = Omit<VisitorAppointment, 'id'> & {
  reference: string;
  reviewedAt: string | null;
  passStatus: string | null;
  reviewer: { publicId: string | null; name: string } | null;
  visitor: {
    publicId: string | null;
    name: string;
  };
};

export type AdminAppointment = {
  reference: string;
  relationship: string;
  message: string | null;
  requestedDate: string;
  status: AppointmentStatus;
  replyMessage: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  visitor: { publicId: string | null; name: string };
  prisoner: { publicId: string | null; name: string };
  officer: { publicId: string | null; name: string } | null;
  visitPass: { status: string; checkedInAt: string | null; checkedInByOfficer: { publicId: string | null; name: string } | null } | null;
  changeRequests: Array<{ reference: string; status: string; reviewedAt: string | null }>;
};

export type ReviewAppointmentInput = {
  status: 'ACCEPTED' | 'REJECTED';
  officerNote?: string;
};
