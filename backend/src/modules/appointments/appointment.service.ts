import { ActionType, AppointmentStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma';
import { appointmentPendingKey, createPublicReference } from '../../utils/public-reference';
import { recordAudit } from '../audit';
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
  reference: string;
  reviewedAt: Date | null;
  visitPass: { status: string } | null;
  officer: { publicId: string | null; name: string } | null;
  visitor: {
    publicId: string | null;
    name: string;
  };
}): OfficerAppointmentResult => {
  const { id: _privateId, ...safeAppointment } = mapVisitorAppointment(appointment);
  return {
    ...safeAppointment,
    reference: appointment.reference,
    reviewedAt: appointment.reviewedAt?.toISOString() ?? null,
    passStatus: appointment.visitPass?.status ?? null,
    reviewer: appointment.officer,
    visitor: {
      publicId: appointment.visitor.publicId,
      name: appointment.visitor.name,
    },
  };
};

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
  reference: true,
  reviewedAt: true,
  visitPass: { select: { status: true } },
  officer: { select: { publicId: true, name: true } },
  visitor: {
    select: {
      publicId: true,
      name: true,
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
      select: {
        id: true,
        assignedOfficer: { select: { userId: true } },
      },
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

  try {
    const reference = createPublicReference('APT');
    const appointment = await prisma.$transaction(async (tx) => {
      const created = await tx.appointment.create({
        data: {
          reference,
          pendingKey: appointmentPendingKey(visitor.id, prisoner.id, requestedDate),
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
        dedupeKey: `APPOINTMENT_SUBMITTED:${reference}`,
      }, tx);
      if (prisoner.assignedOfficer) {
        await createNotification({
          userId: prisoner.assignedOfficer.userId,
          type: 'APPOINTMENT_PENDING',
          title: 'New assigned appointment',
          message: `A new appointment request requires review for ${created.prisoner.name}.`,
          link: '/officer/appointments?status=PENDING',
          dedupeKey: `APPOINTMENT_PENDING:${reference}`,
        }, tx);
      }
      return created;
    });

    return mapVisitorAppointment(appointment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppointmentError(409, 'A matching pending appointment already exists');
    }
    throw error;
  }
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
  userId: string,
  filter: AppointmentStatusFilterInput,
): Promise<{ items: OfficerAppointmentResult[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> => {
  const where: Prisma.AppointmentWhereInput = {
    prisoner: { assignedOfficer: { userId } },
    ...(filter.status && filter.status !== 'ALL' ? { status: filter.status } : {}),
    ...(filter.prisonerPublicId ? { prisoner: { assignedOfficer: { userId }, publicId: filter.prisonerPublicId } } : {}),
    ...(filter.visitorPublicId ? { visitor: { publicId: filter.visitorPublicId } } : {}),
    ...(filter.dateFrom || filter.dateTo
      ? { requestedDate: { ...(filter.dateFrom ? { gte: new Date(filter.dateFrom) } : {}), ...(filter.dateTo ? { lte: new Date(filter.dateTo) } : {}) } }
      : {}),
    ...(filter.search
      ? {
          OR: [
            { reference: { contains: filter.search, mode: 'insensitive' } },
            { prisoner: { publicId: { contains: filter.search, mode: 'insensitive' } } },
            { prisoner: { name: { contains: filter.search, mode: 'insensitive' } } },
            { visitor: { publicId: { contains: filter.search, mode: 'insensitive' } } },
            { visitor: { name: { contains: filter.search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };
  const [appointments, totalItems] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      orderBy: { requestedDate: 'asc' },
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
      select: officerAppointmentSelect,
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    items: appointments.map(mapOfficerAppointment),
    pagination: {
      page: filter.page,
      limit: filter.limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / filter.limit)),
    },
  };
};

export const reviewAppointment = async (
  userId: string,
  appointmentReference: string,
  input: ReviewAppointmentInput,
): Promise<OfficerAppointmentResult> => {
  const officer = await prisma.officerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!officer) {
    throw new AppointmentError(404, 'Officer profile not found');
  }

  const updatedAppointment = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findFirst({
      where: { reference: appointmentReference, prisoner: { assignedOfficerId: officer.id } },
      select: {
        id: true,
        status: true,
        requestedDate: true,
        visitor: { select: { userId: true, publicId: true, name: true } },
        prisoner: { select: { name: true, userId: true } },
      },
    });
    if (!appointment) throw new AppointmentError(404, 'Assigned appointment not found');

    const claimed = await tx.appointment.updateMany({
      where: { id: appointment.id, status: AppointmentStatus.PENDING },
      data: {
        status: input.status,
        pendingKey: null,
        replyMessage: input.officerNote,
        officerId: officer.id,
        reviewedAt: new Date(),
      },
    });
    if (claimed.count !== 1) return null;

    if (input.status === AppointmentStatus.ACCEPTED) {
      await issueOrRotateVisitPass(tx, appointment.id, appointment.requestedDate);
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'APPOINTMENT_APPROVED',
        title: 'Appointment approved',
        message: `Your appointment with ${appointment.prisoner.name} was approved.`,
        link: '/visitor/visit-passes',
        dedupeKey: `APPOINTMENT_ACCEPTED:${appointmentReference}`,
      }, tx);
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'VISIT_PASS_ISSUED',
        title: 'Visit pass issued',
        message: 'Your secure visit pass is ready.',
        link: '/visitor/visit-passes',
        dedupeKey: `VISIT_PASS_ISSUED:${appointmentReference}`,
      }, tx);
      await createNotification({
        userId: appointment.prisoner.userId,
        type: 'PRISONER_VISIT_APPROVED',
        title: 'Upcoming visit approved',
        message: `An upcoming visit with ${appointment.visitor.name} (${appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was approved.`,
        link: '/prisoner/upcoming-visits',
        dedupeKey: `PRISONER_APPOINTMENT_ACCEPTED:${appointmentReference}`,
      }, tx);
    } else {
      await tx.visitPass.updateMany({
        where: { appointmentId: appointment.id, status: 'ACTIVE' },
        data: { status: 'REVOKED' },
      });
      await createNotification({
        userId: appointment.visitor.userId,
        type: 'APPOINTMENT_REJECTED',
        title: 'Appointment rejected',
        message: `Your appointment with ${appointment.prisoner.name} was rejected.`,
        link: '/visitor/appointments',
        dedupeKey: `APPOINTMENT_REJECTED:${appointmentReference}`,
      }, tx);
    }

    await recordAudit({
      userId,
      action: input.status === AppointmentStatus.ACCEPTED ? ActionType.APPROVE : ActionType.REJECT,
      entity: 'Appointment',
      entityReference: appointmentReference,
      result: 'SUCCESS',
      summary: `Appointment ${input.status.toLowerCase()}.`,
    }, tx);

    return tx.appointment.findUniqueOrThrow({ where: { id: appointment.id }, select: officerAppointmentSelect });
  });

  if (!updatedAppointment) {
    await Promise.all([
      recordAudit({ userId, action: ActionType.CONFLICT, entity: 'Appointment', entityReference: appointmentReference, result: 'CONFLICT', summary: 'Appointment was already processed.' }),
      createNotification({ userId, type: 'OFFICER_ACTION_CONFLICT', title: 'Appointment already processed', message: 'Another Officer already processed this appointment.', link: '/officer/appointments?status=PENDING', dedupeKey: `OFFICER_APPOINTMENT_CONFLICT:${appointmentReference}:${userId}` }),
    ]);
    throw new AppointmentError(409, 'Another Officer already processed this appointment');
  }

  return mapOfficerAppointment(updatedAppointment);
};
