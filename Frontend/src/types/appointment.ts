export type AppointmentStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

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

export type ReviewAppointmentInput = {
  status: 'ACCEPTED' | 'REJECTED';
  officerNote?: string;
};
