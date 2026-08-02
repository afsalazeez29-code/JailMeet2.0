import type { AppointmentStatus } from '@prisma/client';

export type PrisonerVisitResult = {
  appointmentReference: string;
  appointmentAt: string;
  purpose: string;
  status: AppointmentStatus | 'EXPIRED';
  officerNote: string | null;
  createdAt: string;
  updatedAt: string;
  visitor: {
    publicId: string | null;
    name: string;
  };
};
