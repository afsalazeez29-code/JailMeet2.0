import { createHash } from 'crypto';
import { AppointmentStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma';
import type { PrisonerVisitResult } from './prisoner-visit.types';

export class PrisonerVisitError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'PrisonerVisitError';
  }
}

const visitSelect = {
  id: true,
  requestedDate: true,
  message: true,
  relationship: true,
  status: true,
  replyMessage: true,
  createdAt: true,
  updatedAt: true,
  visitor: { select: { publicId: true, name: true } },
} as const;

const appointmentReference = (id: string): string =>
  `APT-${createHash('sha256').update(id).digest('hex').slice(0, 10).toUpperCase()}`;

const mapVisit = (appointment: {
  id: string;
  requestedDate: Date;
  message: string | null;
  relationship: string;
  status: AppointmentStatus;
  replyMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  visitor: { publicId: string | null; name: string };
}, markPastAcceptedExpired = false): PrisonerVisitResult => ({
  appointmentReference: appointmentReference(appointment.id),
  appointmentAt: appointment.requestedDate.toISOString(),
  purpose: appointment.message ?? appointment.relationship,
  status:
    markPastAcceptedExpired &&
    appointment.status === AppointmentStatus.ACCEPTED &&
    appointment.requestedDate < new Date()
      ? 'EXPIRED'
      : appointment.status,
  officerNote: appointment.replyMessage,
  createdAt: appointment.createdAt.toISOString(),
  updatedAt: appointment.updatedAt.toISOString(),
  visitor: appointment.visitor,
});

export const listPrisonerUpcomingVisits = async (
  userId: string,
): Promise<PrisonerVisitResult[]> => {
  const profile = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: { publicId: true },
  });
  if (!profile) throw new PrisonerVisitError(404, 'Prisoner profile not found');

  const visits = await prisma.appointment.findMany({
    where: {
      prisoner: { userId },
      status: AppointmentStatus.ACCEPTED,
      requestedDate: { gte: new Date() },
    },
    orderBy: { requestedDate: 'asc' },
    select: visitSelect,
  });
  return visits.map((visit) => mapVisit(visit));
};

export const listPrisonerVisitHistory = async (
  userId: string,
  query: {
    page: number;
    limit: number;
    status?: 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  },
) => {
  const now = new Date();
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: { publicId: true },
  });
  if (!prisoner) throw new PrisonerVisitError(404, 'Prisoner profile not found');

  const statusWhere: Prisma.AppointmentWhereInput =
    query.status === 'EXPIRED'
      ? { status: AppointmentStatus.ACCEPTED, requestedDate: { lt: now } }
      : query.status
        ? { status: query.status }
        : {
            OR: [
              { status: { in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED] } },
              { status: AppointmentStatus.ACCEPTED, requestedDate: { lt: now } },
            ],
          };
  const where: Prisma.AppointmentWhereInput = {
    prisoner: { userId },
    ...statusWhere,
  };
  const [items, totalItems] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: visitSelect,
    }),
    prisma.appointment.count({ where }),
  ]);
  return {
    items: items.map((item) => mapVisit(item, true)),
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.limit)),
    },
  };
};
