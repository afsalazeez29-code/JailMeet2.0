import {
  ActionType,
  AppointmentChangeRequestStatus,
  AppointmentChangeRequestType,
  AppointmentStatus,
  Prisma,
  VisitPassStatus,
} from '@prisma/client';

import prisma from '../../config/prisma';
import { appointmentPendingKey, createPublicReference } from '../../utils/public-reference';
import { recordAudit } from '../audit';
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
  reference: true,
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
      reference: true,
      status: true,
      prisoner: { select: { publicId: true, name: true } },
    },
  },
} as const;

const officerSelect = {
  ...safeSelect,
  visitor: { select: { publicId: true, name: true } },
  reviewedByOfficer: { select: { publicId: true, name: true } },
} as const;

const mapRequest = (item: {
  id: string;
  reference: string;
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
    reference: string;
    status: AppointmentStatus;
    prisoner: { publicId: string | null; name: string };
  };
  visitor?: { publicId: string | null; name: string };
  reviewedByOfficer?: { publicId: string | null; name: string } | null;
}) => ({
  id: item.id,
  reference: item.reference,
  requestType: item.requestType,
  requestedAt: item.requestedDate?.toISOString() ?? null,
  reason: item.reason,
  status: item.status,
  officerReply: item.officerReply,
  reviewedAt: item.reviewedAt?.toISOString() ?? null,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
  appointment: {
    reference: item.appointment.reference,
    appointmentAt: item.appointment.requestedDate.toISOString(),
    status: item.appointment.status,
    prisoner: {
      publicId: item.appointment.prisoner.publicId ?? 'PRN-UNKNOWN',
      name: item.appointment.prisoner.name,
    },
  },
  ...(item.visitor ? { visitor: item.visitor } : {}),
  ...('reviewedByOfficer' in item ? { reviewer: item.reviewedByOfficer ?? null } : {}),
});

const mapOfficerRequest = (item: Parameters<typeof mapRequest>[0]) => {
  const { id: _privateId, ...safe } = mapRequest(item);
  return safe;
};

const createRequest = async (
  userId: string,
  appointmentId: string,
  requestType: AppointmentChangeRequestType,
  reason: string,
  requestedDate?: Date,
) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, visitor: { userId } },
    select: {
      id: true,
      reference: true,
      visitorId: true,
      requestedDate: true,
      status: true,
      prisoner: {
        select: {
          name: true,
          assignedOfficer: { select: { userId: true } },
        },
      },
    },
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
    const reference = createPublicReference('CHG');
    const created = await prisma.$transaction(async (tx) => {
      const item = await tx.appointmentChangeRequest.create({
      data: {
        reference,
        appointmentId,
        visitorId: appointment.visitorId,
        requestType,
        requestedDate,
        reason,
        pendingKey: appointmentId,
      },
      select: safeSelect,
      });
      if (appointment.prisoner.assignedOfficer) {
        await createNotification({
          userId: appointment.prisoner.assignedOfficer.userId,
          type: 'CHANGE_REQUEST_PENDING',
          title: 'Appointment change requires review',
          message: `A ${requestType.toLowerCase()} request requires review for ${appointment.prisoner.name}.`,
          link: '/officer/change-requests?status=PENDING',
          dedupeKey: `CHANGE_REQUEST_PENDING:${reference}`,
        }, tx);
      }
      return item;
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
  officerUserId: string,
  query: {
    status: AppointmentChangeRequestStatus | 'ALL';
    requestType?: AppointmentChangeRequestType;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    limit: number;
  },
) => {
  const where: Prisma.AppointmentChangeRequestWhereInput = {
    appointment: { prisoner: { assignedOfficer: { userId: officerUserId } } },
    ...(query.status !== 'ALL' ? { status: query.status } : {}),
    ...(query.requestType ? { requestType: query.requestType } : {}),
    ...(query.dateFrom || query.dateTo ? { createdAt: { ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}), ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}) } } : {}),
    ...(query.search ? { OR: [
      { reference: { contains: query.search, mode: 'insensitive' } },
      { appointment: { reference: { contains: query.search, mode: 'insensitive' } } },
      { appointment: { prisoner: { publicId: { contains: query.search, mode: 'insensitive' } } } },
      { visitor: { publicId: { contains: query.search, mode: 'insensitive' } } },
    ] } : {}),
  };
  const [items, totalItems] = await prisma.$transaction([
    prisma.appointmentChangeRequest.findMany({ where, orderBy: { createdAt: 'asc' }, skip: (query.page - 1) * query.limit, take: query.limit, select: officerSelect }),
    prisma.appointmentChangeRequest.count({ where }),
  ]);
  return { items: items.map(mapOfficerRequest), pagination: { page: query.page, limit: query.limit, totalItems, totalPages: Math.max(1, Math.ceil(totalItems / query.limit)) } };
};

export const reviewChangeRequest = async (
  officerUserId: string,
  requestReference: string,
  decision: 'APPROVED' | 'REJECTED',
  officerReply?: string,
) => {
  const result = await prisma.$transaction(async (tx) => {
    const officer = await tx.officerProfile.findUnique({ where: { userId: officerUserId }, select: { id: true } });
    if (!officer) throw new ChangeRequestError(404, 'Officer profile not found');

    const claimed = await tx.appointmentChangeRequest.updateMany({
      where: {
        reference: requestReference,
        status: AppointmentChangeRequestStatus.PENDING,
        appointment: { prisoner: { assignedOfficerId: officer.id } },
      },
      data: { status: decision, pendingKey: null, officerReply, reviewedByOfficerId: officer.id, reviewedAt: new Date() },
    });
    if (claimed.count !== 1) return null;

    const request = await tx.appointmentChangeRequest.findUniqueOrThrow({
      where: { reference: requestReference },
      select: {
        id: true,
        requestType: true,
        requestedDate: true,
        appointment: {
          select: {
            id: true,
            reference: true,
            visitorId: true,
            prisonerId: true,
            status: true,
            requestedDate: true,
            visitor: { select: { userId: true, publicId: true, name: true } },
            prisoner: { select: { name: true, userId: true } },
          },
        },
      },
    });

    const now = new Date();
    if (request.appointment.requestedDate <= now || ![AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED].includes(request.appointment.status)) {
      throw new ChangeRequestError(409, 'The appointment is no longer eligible for this change');
    }
    if (request.requestType === AppointmentChangeRequestType.RESCHEDULE && (!request.requestedDate || request.requestedDate <= now || request.requestedDate.getTime() === request.appointment.requestedDate.getTime())) {
      throw new ChangeRequestError(409, 'The requested reschedule date is no longer valid');
    }

    const isApproved = decision === AppointmentChangeRequestStatus.APPROVED;
    if (isApproved && request.requestType === AppointmentChangeRequestType.CANCEL) {
      await tx.appointment.update({ where: { id: request.appointment.id }, data: { status: AppointmentStatus.CANCELLED, pendingKey: null } });
      await tx.visitPass.updateMany({ where: { appointmentId: request.appointment.id, status: VisitPassStatus.ACTIVE }, data: { status: VisitPassStatus.REVOKED } });
    }
    if (isApproved && request.requestType === AppointmentChangeRequestType.RESCHEDULE && request.requestedDate) {
      await tx.appointment.update({
        where: { id: request.appointment.id },
        data: {
          requestedDate: request.requestedDate,
          ...(request.appointment.status === AppointmentStatus.PENDING
            ? { pendingKey: appointmentPendingKey(request.appointment.visitorId, request.appointment.prisonerId, request.requestedDate) }
            : {}),
        },
      });
      if (request.appointment.status === AppointmentStatus.ACCEPTED) await issueOrRotateVisitPass(tx, request.appointment.id, request.requestedDate);
    }

    const actionLabel = request.requestType === AppointmentChangeRequestType.CANCEL ? 'Cancellation' : 'Reschedule';
    await createNotification({
      userId: request.appointment.visitor.userId,
      type: `${request.requestType}_${decision}`,
      title: `${actionLabel} request ${decision.toLowerCase()}`,
      message: `Your ${actionLabel.toLowerCase()} request for ${request.appointment.prisoner.name} was ${decision.toLowerCase()}.`,
      link: isApproved && request.requestType === AppointmentChangeRequestType.CANCEL ? '/visitor/visit-history' : '/visitor/appointments',
      dedupeKey: `CHANGE_REQUEST_${decision}:${requestReference}`,
    }, tx);
    if (isApproved && request.requestType === AppointmentChangeRequestType.CANCEL && request.appointment.status === AppointmentStatus.ACCEPTED) {
      await createNotification({ userId: request.appointment.prisoner.userId, type: 'PRISONER_VISIT_CANCELLED', title: 'Upcoming visit cancelled', message: `The scheduled visit with ${request.appointment.visitor.name} was cancelled.`, link: '/prisoner/visits/history', dedupeKey: `PRISONER_VISIT_CANCELLED:${requestReference}` }, tx);
    }
    if (isApproved && request.requestType === AppointmentChangeRequestType.RESCHEDULE && request.appointment.status === AppointmentStatus.ACCEPTED) {
      await createNotification({ userId: request.appointment.prisoner.userId, type: 'PRISONER_VISIT_RESCHEDULED', title: 'Upcoming visit rescheduled', message: `The visit with ${request.appointment.visitor.name} has a new scheduled date.`, link: '/prisoner/upcoming-visits', dedupeKey: `PRISONER_VISIT_RESCHEDULED:${requestReference}` }, tx);
    }
    await recordAudit({ userId: officerUserId, action: decision === 'APPROVED' ? ActionType.APPROVE : ActionType.REJECT, entity: 'AppointmentChangeRequest', entityReference: requestReference, result: 'SUCCESS', summary: `${actionLabel} request ${decision.toLowerCase()}.` }, tx);

    const updated = await tx.appointmentChangeRequest.findUniqueOrThrow({ where: { reference: requestReference }, select: officerSelect });
    return mapOfficerRequest(updated);
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  if (!result) {
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.CONFLICT, entity: 'AppointmentChangeRequest', entityReference: requestReference, result: 'CONFLICT', summary: 'Change request was already processed or outside assignment.' }),
      createNotification({ userId: officerUserId, type: 'OFFICER_ACTION_CONFLICT', title: 'Change request already processed', message: 'Another Officer already processed this change request.', link: '/officer/change-requests?status=PENDING', dedupeKey: `OFFICER_CHANGE_CONFLICT:${requestReference}:${officerUserId}` }),
    ]);
    throw new ChangeRequestError(409, 'Another Officer already processed this change request');
  }
  return result;
};
