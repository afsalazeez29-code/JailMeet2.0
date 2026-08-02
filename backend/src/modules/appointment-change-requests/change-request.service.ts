import {
  AppointmentChangeRequestStatus,
  AppointmentChangeRequestType,
  AppointmentStatus,
  Prisma,
  VisitPassStatus,
} from '@prisma/client';

import prisma from '../../config/prisma';
import { createNotification } from '../notifications';
import { issueOrRotateVisitPass } from '../visit-passes';

export class ChangeRequestError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ChangeRequestError';
  }
}

const safeSelect = {
  id: true,
  requestType: true,
  requestedDate: true,
  reason: true,
  status: true,
  officerReply: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
  appointment: {
    select: {
      requestedDate: true,
      status: true,
      prisoner: { select: { publicId: true, name: true } },
    },
  },
} as const;

const officerSelect = {
  ...safeSelect,
  visitor: { select: { publicId: true, name: true } },
} as const;

const mapRequest = (item: {
  id: string;
  requestType: AppointmentChangeRequestType;
  requestedDate: Date | null;
  reason: string;
  status: AppointmentChangeRequestStatus;
  officerReply: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  appointment: {
    requestedDate: Date;
    status: AppointmentStatus;
    prisoner: { publicId: string | null; name: string };
  };
  visitor?: { publicId: string | null; name: string };
}) => ({
  id: item.id,
  requestType: item.requestType,
  requestedAt: item.requestedDate?.toISOString() ?? null,
  reason: item.reason,
  status: item.status,
  officerReply: item.officerReply,
  reviewedAt: item.reviewedAt?.toISOString() ?? null,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
  appointment: {
    appointmentAt: item.appointment.requestedDate.toISOString(),
    status: item.appointment.status,
    prisoner: {
      publicId: item.appointment.prisoner.publicId ?? 'PRN-UNKNOWN',
      name: item.appointment.prisoner.name,
    },
  },
  ...(item.visitor ? { visitor: item.visitor } : {}),
});

const createRequest = async (
  userId: string,
  appointmentId: string,
  requestType: AppointmentChangeRequestType,
  reason: string,
  requestedDate?: Date,
) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, visitor: { userId } },
    select: { id: true, visitorId: true, requestedDate: true, status: true },
  });
  if (!appointment) throw new ChangeRequestError(404, 'Appointment not found');
  if (appointment.requestedDate <= new Date()) throw new ChangeRequestError(409, 'Only future appointments can be changed');
  if (
    appointment.status !== AppointmentStatus.PENDING &&
    appointment.status !== AppointmentStatus.ACCEPTED
  ) {
    throw new ChangeRequestError(409, 'This appointment is not eligible for changes');
  }
  if (requestType === AppointmentChangeRequestType.RESCHEDULE) {
    if (!requestedDate || requestedDate <= new Date()) throw new ChangeRequestError(400, 'Requested date must be in the future');
    if (requestedDate.getTime() === appointment.requestedDate.getTime()) throw new ChangeRequestError(400, 'Choose a different appointment date');
  }

  try {
    const created = await prisma.appointmentChangeRequest.create({
      data: {
        appointmentId,
        visitorId: appointment.visitorId,
        requestType,
        requestedDate,
        reason,
        pendingKey: appointmentId,
      },
      select: safeSelect,
    });
    return mapRequest(created);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ChangeRequestError(409, 'A change request is already pending for this appointment');
    }
    throw error;
  }
};

export const requestCancellation = (userId: string, appointmentId: string, reason: string) =>
  createRequest(userId, appointmentId, AppointmentChangeRequestType.CANCEL, reason);

export const requestReschedule = (userId: string, appointmentId: string, requestedAt: string, reason: string) =>
  createRequest(userId, appointmentId, AppointmentChangeRequestType.RESCHEDULE, reason, new Date(requestedAt));

export const listVisitorChangeRequests = async (userId: string, status?: AppointmentChangeRequestStatus) => {
  const items = await prisma.appointmentChangeRequest.findMany({
    where: { visitor: { userId }, ...(status ? { status } : {}) },
    orderBy: { createdAt: 'desc' },
    select: safeSelect,
  });
  return items.map(mapRequest);
};

export const listOfficerChangeRequests = async (
  status: AppointmentChangeRequestStatus,
  requestType?: AppointmentChangeRequestType,
) => {
  const items = await prisma.appointmentChangeRequest.findMany({
    where: { status, ...(requestType ? { requestType } : {}) },
    orderBy: { createdAt: 'asc' },
    select: officerSelect,
  });
  return items.map(mapRequest);
};

export const reviewChangeRequest = async (
  officerUserId: string,
  requestId: string,
  decision: 'APPROVED' | 'REJECTED',
  officerReply?: string,
) => prisma.$transaction(async (tx) => {
  const [officer, request] = await Promise.all([
    tx.officerProfile.findUnique({ where: { userId: officerUserId }, select: { id: true } }),
    tx.appointmentChangeRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        status: true,
        requestType: true,
        requestedDate: true,
        appointment: {
          select: {
            id: true,
            status: true,
            requestedDate: true,
            visitor: { select: { userId: true, publicId: true, name: true } },
            prisoner: { select: { name: true, userId: true } },
          },
        },
      },
    }),
  ]);
  if (!officer) throw new ChangeRequestError(404, 'Officer profile not found');
  if (!request) throw new ChangeRequestError(404, 'Change request not found');
  if (request.status !== AppointmentChangeRequestStatus.PENDING) throw new ChangeRequestError(409, 'Change request has already been reviewed');

  await tx.appointmentChangeRequest.update({
    where: { id: requestId },
    data: {
      status: decision,
      pendingKey: null,
      officerReply,
      reviewedByOfficerId: officer.id,
      reviewedAt: new Date(),
    },
  });

  const isApproved = decision === AppointmentChangeRequestStatus.APPROVED;
  if (isApproved && request.requestType === AppointmentChangeRequestType.CANCEL) {
    await tx.appointment.update({ where: { id: request.appointment.id }, data: { status: AppointmentStatus.CANCELLED } });
    const revoked = await tx.visitPass.updateMany({
      where: { appointmentId: request.appointment.id, status: VisitPassStatus.ACTIVE },
      data: { status: VisitPassStatus.REVOKED },
    });
    if (revoked.count) {
      await createNotification({
        userId: request.appointment.visitor.userId,
        type: 'VISIT_PASS_REVOKED',
        title: 'Visit pass revoked',
        message: `The visit pass for ${request.appointment.prisoner.name} is no longer valid.`,
        link: '/visitor/visit-history',
      }, tx);
      await createNotification({
        userId: request.appointment.prisoner.userId,
        type: 'PRISONER_VISIT_PASS_REVOKED',
        title: 'Visit authorization revoked',
        message: `The authorization for the scheduled visit with ${request.appointment.visitor.name} (${request.appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was revoked.`,
        link: '/prisoner/visits/history',
      }, tx);
    }
    if (request.appointment.status === AppointmentStatus.ACCEPTED) {
      await createNotification({
        userId: request.appointment.prisoner.userId,
        type: 'PRISONER_VISIT_CANCELLED',
        title: 'Upcoming visit cancelled',
        message: `The scheduled visit with ${request.appointment.visitor.name} (${request.appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was cancelled.`,
        link: '/prisoner/visits/history',
      }, tx);
    }
  }

  if (isApproved && request.requestType === AppointmentChangeRequestType.RESCHEDULE) {
    if (!request.requestedDate) throw new ChangeRequestError(409, 'Requested date is missing');
    await tx.appointment.update({ where: { id: request.appointment.id }, data: { requestedDate: request.requestedDate } });
    if (request.appointment.status === AppointmentStatus.ACCEPTED) {
      await issueOrRotateVisitPass(tx, request.appointment.id, request.requestedDate);
      await createNotification({
        userId: request.appointment.prisoner.userId,
        type: 'PRISONER_VISIT_RESCHEDULED',
        title: 'Upcoming visit rescheduled',
        message: `The visit with ${request.appointment.visitor.name} (${request.appointment.visitor.publicId ?? 'Visitor ID unavailable'}) has a new scheduled date.`,
        link: '/prisoner/upcoming-visits',
      }, tx);
    }
  }

  const action = request.requestType === AppointmentChangeRequestType.CANCEL ? 'Cancellation' : 'Reschedule';
  await createNotification({
    userId: request.appointment.visitor.userId,
    type: `${request.requestType}_${decision}`,
    title: `${action} request ${decision.toLowerCase()}`,
    message: `Your ${action.toLowerCase()} request for ${request.appointment.prisoner.name} was ${decision.toLowerCase()}.`,
    link: isApproved && request.requestType === AppointmentChangeRequestType.CANCEL
      ? '/visitor/visit-history'
      : '/visitor/appointments',
  }, tx);

  const updated = await tx.appointmentChangeRequest.findUniqueOrThrow({ where: { id: requestId }, select: officerSelect });
  return mapRequest(updated);
});
