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
  id: string;
  name: string;
};

export type VisitorAppointmentResult = {
  id: string;
  appointmentAt: string;
  reason: string;
  status: AppointmentStatus;
  officerNote: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner: PrisonerOption;
};

export type OfficerAppointmentResult = VisitorAppointmentResult & {
  visitor: {
    id: string;
    name: string;
    phone: string;
  };
};