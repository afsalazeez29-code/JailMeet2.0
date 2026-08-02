import { AppointmentStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import { createNotification } from '../notifications';
import { issueOrRotateVisitPass } from '../visit-passes';
import {
  AppointmentStatusFilterInput,
  CreateAppointmentInput,
  OfficerAppointmentResult,
  PublicPrisonerDetail,
  PrisonerOption,
  ReviewAppointmentInput,
  VisitorAppointmentResult,
} from './appointment.types';

export class AppointmentError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AppointmentError';
    this.statusCode = statusCode;
  }
}

const toIso = (date: Date): string => date.toISOString();

const mapVisitorAppointment = (appointment: {
  id: string;
  requestedDate: Date;
  message: string | null;
  relationship: string;
  status: AppointmentStatus;
  replyMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  prisoner: { publicId: string | null; name: string; profilePic: string | null };
  changeRequests?: Array<{ id: string }>;
}): VisitorAppointmentResult => ({
  id: appointment.id,
  appointmentAt: toIso(appointment.requestedDate),
  reason: appointment.message ?? appointment.relationship,
  status: appointment.status,
  officerNote: appointment.replyMessage,
  createdAt: toIso(appointment.createdAt),
  updatedAt: toIso(appointment.updatedAt),
  prisoner: {
    publicId: appointment.prisoner.publicId ?? 'PRN-UNKNOWN',
    name: appointment.prisoner.name,
    profilePic: appointment.prisoner.profilePic,
  },
  hasPendingChangeRequest: Boolean(appointment.changeRequests?.length),
});

const mapOfficerAppointment = (appointment: Parameters<typeof mapVisitorAppointment>[0] & {
  visitor: {
    publicId: string | null;
    name: string;
    phone: string;
  };
}): OfficerAppointmentResult => ({
  ...mapVisitorAppointment(appointment),
  visitor: {
    publicId: appointment.visitor.publicId,
    name: appointment.visitor.name,
    phone: appointment.visitor.phone,
  },
});

const appointmentSelect = {
  id: true,
  requestedDate: true,
  message: true,
  relationship: true,
  status: true,
  replyMessage: true,
  createdAt: true,
  updatedAt: true,
  prisoner: {
    select: {
      publicId: true,
      name: true,
      profilePic: true,
    },
  },
};

const officerAppointmentSelect = {
  ...appointmentSelect,
  visitor: {
    select: {
      publicId: true,
      name: true,
      phone: true,
    },
  },
};

const visitorAppointmentSelect = {
  ...appointmentSelect,
  changeRequests: {
    where: { status: 'PENDING' as const },
    take: 1,
    select: { id: true },
  },
};

export const getPrisonerOptions = async (): Promise<PrisonerOption[]> => {
  const prisoners = await prisma.prisonerProfile.findMany({
    where: {
      publicId: { not: null },
      user: { isActive: true, role: 'PRISONER' },
    },
    orderBy: { name: 'asc' },
    select: {
      publicId: true,
      name: true,
      profilePic: true,
      caseDetails: true,
      jailType: true,
      jailName: true,
    },
  });

  return prisoners.map((prisoner) => ({
    ...prisoner,
    publicId: prisoner.publicId as string,
  }));
};

export const getPublicPrisoner = async (
  publicId: string,
): Promise<PublicPrisonerDetail> => {
  const prisoner = await prisma.prisonerProfile.findFirst({
    where: {
      publicId,
      user: { isActive: true, role: 'PRISONER' },
    },
    select: {
      publicId: true,
      name: true,
      profilePic: true,
      age: true,
      gender: true,
      admissionDate: true,
      caseDetails: true,
      sentencePeriod: true,
      jailType: true,
      jailName: true,
    },
  });

  if (!prisoner?.publicId) {
    throw new AppointmentError(404, 'Prisoner not found');
  }

  return {
    ...prisoner,
    publicId: prisoner.publicId,
    admissionDate: toIso(prisoner.admissionDate),
  };
};

export const createVisitorAppointment = async (
  userId: string,
  input: CreateAppointmentInput,
): Promise<VisitorAppointmentResult> => {
  const requestedDate = new Date(input.appointmentAt);

  if (Number.isNaN(requestedDate.getTime()) || requestedDate <= new Date()) {
    throw new AppointmentError(400, 'Appointment date must be in the future');
  }

  const [visitor, prisoner] = await prisma.$transaction([
    prisma.visitorProfile.findUnique({
      where: { userId },
      select: { id: true },
    }),
    prisma.prisonerProfile.findFirst({
      where: {
        publicId: input.prisonerPublicId,
        user: { isActive: true, role: 'PRISONER' },
      },
      select: { id: true },
    }),
  ]);

  if (!visitor) {
    throw new AppointmentError(404, 'Visitor profile not found');
  }

  if (!prisoner) {
    throw new AppointmentError(404, 'Prisoner not found');
  }

  const duplicateAppointment = await prisma.appointment.findFirst({
    where: {
      visitorId: visitor.id,
      prisonerId: prisoner.id,
      requestedDate,
      status: AppointmentStatus.PENDING,
    },
    select: { id: true },
  });

  if (duplicateAppointment) {
    throw new AppointmentError(409, 'Appointment already exists');
  }

  const appointment = await prisma.$transaction(async (tx) => {
    const created = await tx.appointment.create({
      data: {
        visitorId: visitor.id,
        prisonerId: prisoner.id,
        requestedDate,
        relationship: 'Visitor',
        message: input.reason,
        status: AppointmentStatus.PENDING,
      },
      select: appointmentSelect,
    });
    await createNotification({
      userId,
      type: 'APPOINTMENT_SUBMITTED',
      title: 'Appointment submitted',
      message: `Your appointment request for ${created.prisoner.name} was submitted for review.`,
      link: '/visitor/appointments',
    }, tx);
    return created;
  });

  return mapVisitorAppointment(appointment);
};

export const getVisitorAppointments = async (
  userId: string,
): Promise<VisitorAppointmentResult[]> => {
  const visitor = await prisma.visitorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!visitor) {
    throw new AppointmentError(404, 'Visitor profile not found');
  }

  const appointments = await prisma.appointment.findMany({
    where: { visitorId: visitor.id },
    orderBy: { requestedDate: 'desc' },
    select: visitorAppointmentSelect,
  });

  return appointments.map(mapVisitorAppointment);
};

export const getOfficerAppointments = async (
  filter: AppointmentStatusFilterInput,
): Promise<OfficerAppointmentResult[]> => {
  const appointments = await prisma.appointment.findMany({
    where: filter.status ? { status: filter.status } : undefined,
    orderBy: { requestedDate: 'asc' },
    select: officerAppointmentSelect,
  });

  return appointments.map(mapOfficerAppointment);
};

export const reviewAppointment = async (
  userId: string,
  appointmentId: string,
  input: ReviewAppointmentInput,
): Promise<OfficerAppointmentResult> => {
  const officer = await prisma.officerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!officer) {
    throw new AppointmentError(404, 'Officer profile not found');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      status: true,
      requestedDate: true,
      visitor: { select: { userId: true, publicId: true, name: true } },
      prisoner: { select: { name: true, userId: true } },
    },
  });

  if (!appointment) {
    throw new AppointmentError(404, 'Appointment not found');
  }

  if (appointment.status !== AppointmentStatus.PENDING) {
    throw new AppointmentError(409, 'Only pending appointments can be reviewed');
  }

  const updatedAppointment = await prisma.$transaction(async (tx) => {
    const updated = await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        status: input.status,
        replyMessage: input.officerNote,
        officerId: officer.id,
      },
      select: officerAppointmentSelect,
    });

    if (input.status === AppointmentStatus.ACCEPTED) {
      await issueOrRotateVisitPass(tx, appointmentId, appointment.requestedDate);
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'APPOINTMENT_APPROVED',
        title: 'Appointment approved',
        message: `Your appointment with ${appointment.prisoner.name} was approved.`,
        link: '/visitor/visit-passes',
      }, tx);
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'VISIT_PASS_ISSUED',
        title: 'Visit pass issued',
        message: 'Your secure visit pass is ready.',
        link: '/visitor/visit-passes',
      }, tx);
      await createNotification({
        userId: appointment.prisoner.userId,
        type: 'PRISONER_VISIT_APPROVED',
        title: 'Upcoming visit approved',
        message: `An upcoming visit with ${appointment.visitor.name} (${appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was approved.`,
        link: '/prisoner/upcoming-visits',
      }, tx);
    } else {
      await tx.visitPass.updateMany({
        where: { appointmentId, status: 'ACTIVE' },
        data: { status: 'REVOKED' },
      });
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'APPOINTMENT_REJECTED',
        title: 'Appointment rejected',
        message: `Your appointment with ${appointment.prisoner.name} was rejected.`,
        link: '/visitor/appointments',
      }, tx);
    }

    return updated;
  });

  return mapOfficerAppointment(updatedAppointment);
};
