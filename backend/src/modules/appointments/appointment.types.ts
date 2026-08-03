import { AppointmentStatus } from '@prisma/client';
import { z } from 'zod';

import {
  appointmentStatusFilterSchema,
  createAppointmentSchema,
  reviewAppointmentSchema,
} from './appointment.schema';

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type AppointmentStatusFilterInput = z.infer<
  typeof appointmentStatusFilterSchema
>;
export type ReviewAppointmentInput = z.infer<typeof reviewAppointmentSchema>;

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

export type VisitorAppointmentResult = {
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

export type OfficerAppointmentResult = Omit<VisitorAppointmentResult, 'id'> & {
  reference: string;
  reviewedAt: string | null;
  passStatus: string | null;
  reviewer: { publicId: string | null; name: string } | null;
  visitor: {
    publicId: string | null;
    name: string;
  };
};
