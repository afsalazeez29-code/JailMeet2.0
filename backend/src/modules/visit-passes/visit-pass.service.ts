import { randomBytes } from 'crypto';
import { AppointmentStatus, Prisma, VisitPassStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import { createNotification } from '../notifications';

export class VisitPassError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'VisitPassError';
  }
}

const passSelect = {
  appointmentId: true,
  passCode: true,
  status: true,
  issuedAt: true,
  expiresAt: true,
  checkedInAt: true,
  appointment: {
    select: {
      requestedDate: true,
      message: true,
      relationship: true,
      status: true,
      replyMessage: true,
      createdAt: true,
      visitor: {
        select: {
          publicId: true,
          name: true,
          userId: true,
        },
      },
      prisoner: {
        select: {
          publicId: true,
          name: true,
          userId: true,
          profilePic: true,
          jailName: true,
        },
      },
    },
  },
} as const;

export const generatePassCode = (): string =>
  `JMP-${randomBytes(24).toString('base64url')}`;

export const calculatePassExpiry = (appointmentAt: Date): Date =>
  new Date(appointmentAt.getTime() + 2 * 60 * 60 * 1000);

export const issueOrRotateVisitPass = async (
  tx: Prisma.TransactionClient,
  appointmentId: string,
  appointmentAt: Date,
) => tx.visitPass.upsert({
  where: { appointmentId },
  create: {
    appointmentId,
    passCode: generatePassCode(),
    status: VisitPassStatus.ACTIVE,
    expiresAt: calculatePassExpiry(appointmentAt),
  },
  update: {
    passCode: generatePassCode(),
    status: VisitPassStatus.ACTIVE,
    issuedAt: new Date(),
    expiresAt: calculatePassExpiry(appointmentAt),
    checkedInAt: null,
  },
  select: { passCode: true, expiresAt: true },
});

const displayPassStatus = (
  status: VisitPassStatus,
  expiresAt: Date,
): VisitPassStatus =>
  status === VisitPassStatus.ACTIVE && expiresAt <= new Date()
    ? VisitPassStatus.EXPIRED
    : status;

const safePassDto = (pass: Awaited<ReturnType<typeof findPassByCode>>) => {
  if (!pass) return null;
  return {
    appointmentReference: `APT-${pass.passCode.slice(-10).toUpperCase()}`,
    passCode: pass.passCode,
    passStatus: displayPassStatus(pass.status, pass.expiresAt),
    issuedAt: pass.issuedAt.toISOString(),
    expiresAt: pass.expiresAt.toISOString(),
    checkedInAt: pass.checkedInAt?.toISOString() ?? null,
    appointmentAt: pass.appointment.requestedDate.toISOString(),
    purpose: pass.appointment.message ?? pass.appointment.relationship,
    appointmentStatus: pass.appointment.status,
    officerNote: pass.appointment.replyMessage,
    bookedAt: pass.appointment.createdAt.toISOString(),
    reportingInstructions: 'Arrive 30 minutes early with valid identification for security screening.',
    visitor: {
      publicId: pass.appointment.visitor.publicId,
      name: pass.appointment.visitor.name,
    },
    prisoner: {
      publicId: pass.appointment.prisoner.publicId ?? 'PRN-UNKNOWN',
      name: pass.appointment.prisoner.name,
      profilePic: pass.appointment.prisoner.profilePic,
      jailName: pass.appointment.prisoner.jailName,
    },
  };
};

const findPassByCode = (passCode: string) => prisma.visitPass.findUnique({
  where: { passCode },
  select: passSelect,
});

export const listVisitorPasses = async (userId: string) => {
  const passes = await prisma.visitPass.findMany({
    where: {
      appointment: {
        visitor: { userId },
        status: AppointmentStatus.ACCEPTED,
        requestedDate: { gte: new Date() },
      },
    },
    orderBy: { appointment: { requestedDate: 'asc' } },
    select: passSelect,
  });
  return passes.map((pass) => safePassDto(pass));
};

export const verifyVisitPass = async (passCode: string) => {
  const pass = await findPassByCode(passCode);
  if (!pass) throw new VisitPassError(404, 'Visit pass not found');
  if (pass.status !== VisitPassStatus.ACTIVE) {
    throw new VisitPassError(409, `Visit pass is ${pass.status.toLowerCase()}`);
  }
  if (pass.appointment.status !== AppointmentStatus.ACCEPTED) {
    throw new VisitPassError(409, 'Appointment is not approved');
  }
  if (pass.expiresAt <= new Date()) {
    await prisma.visitPass.updateMany({
      where: { passCode, status: VisitPassStatus.ACTIVE },
      data: { status: VisitPassStatus.EXPIRED },
    });
    throw new VisitPassError(410, 'Visit pass has expired');
  }
  return safePassDto(pass);
};

export const useVisitPass = async (passCode: string) => {
  const preflight = await prisma.visitPass.findUnique({
    where: { passCode },
    select: { status: true, expiresAt: true },
  });
  if (!preflight) throw new VisitPassError(404, 'Visit pass not found');
  if (preflight.status !== VisitPassStatus.ACTIVE) {
    throw new VisitPassError(409, `Visit pass is ${preflight.status.toLowerCase()}`);
  }
  if (preflight.expiresAt <= new Date()) {
    await prisma.visitPass.updateMany({
      where: { passCode, status: VisitPassStatus.ACTIVE },
      data: { status: VisitPassStatus.EXPIRED },
    });
    throw new VisitPassError(410, 'Visit pass has expired');
  }

  return prisma.$transaction(async (tx) => {
  const pass = await tx.visitPass.findUnique({
    where: { passCode },
    select: passSelect,
  });
  if (!pass) throw new VisitPassError(404, 'Visit pass not found');
  if (pass.status !== VisitPassStatus.ACTIVE) {
    throw new VisitPassError(409, `Visit pass is ${pass.status.toLowerCase()}`);
  }
  if (pass.appointment.status !== AppointmentStatus.ACCEPTED) {
    throw new VisitPassError(409, 'Appointment is not approved');
  }
  if (pass.expiresAt <= new Date()) {
    throw new VisitPassError(410, 'Visit pass has expired');
  }

  const checkedInAt = new Date();
  const claimed = await tx.visitPass.updateMany({
    where: { passCode, status: VisitPassStatus.ACTIVE },
    data: { status: VisitPassStatus.USED, checkedInAt },
  });
  if (claimed.count !== 1) throw new VisitPassError(409, 'Visit pass has already been used');

  await tx.appointment.update({
    where: { id: pass.appointmentId },
    data: { status: AppointmentStatus.COMPLETED },
  });
  await createNotification({
    userId: pass.appointment.visitor.userId,
    type: 'VISIT_PASS_USED',
    title: 'Visit completed',
    message: `Your visit with ${pass.appointment.prisoner.name} was checked in successfully.`,
    link: '/visitor/visit-history',
  }, tx);
  await createNotification({
    userId: pass.appointment.prisoner.userId,
    type: 'PRISONER_VISIT_COMPLETED',
    title: 'Visit completed',
    message: `The visit with ${pass.appointment.visitor.name} (${pass.appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was completed.`,
    link: '/prisoner/visits/history',
  }, tx);

  const usedPass = safePassDto({ ...pass, status: VisitPassStatus.USED, checkedInAt });
  if (!usedPass) throw new VisitPassError(500, 'Unable to return completed visit');
  return {
    ...usedPass,
    appointmentStatus: AppointmentStatus.COMPLETED,
    checkedInAt: checkedInAt.toISOString(),
  };
  });
};

export const listVisitorHistory = async (
  userId: string,
  query: { status?: 'COMPLETED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED'; page: number; limit: number },
) => {
  const now = new Date();
  const where: Prisma.AppointmentWhereInput = {
    visitor: { userId },
    ...(query.status === 'EXPIRED'
      ? {
          status: AppointmentStatus.ACCEPTED,
          requestedDate: { lt: now },
          visitPass: {
            status: {
              in: [VisitPassStatus.ACTIVE, VisitPassStatus.EXPIRED],
            },
          },
        }
      : query.status
        ? { status: query.status as AppointmentStatus }
        : {
            OR: [
              { status: { in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED] } },
              { status: AppointmentStatus.ACCEPTED, requestedDate: { lt: now } },
            ],
          }),
  };
  const [items, totalItems] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        requestedDate: true,
        message: true,
        relationship: true,
        status: true,
        replyMessage: true,
        createdAt: true,
        updatedAt: true,
        prisoner: { select: { publicId: true, name: true, profilePic: true } },
        visitPass: { select: { passCode: true, status: true, expiresAt: true, checkedInAt: true } },
        changeRequests: {
          where: { status: { in: ['APPROVED', 'REJECTED'] } },
          orderBy: { reviewedAt: 'desc' },
          take: 1,
          select: { requestType: true, status: true, officerReply: true },
        },
      },
    }),
    prisma.appointment.count({ where }),
  ]);
  return {
    items: items.map((item) => ({
      appointmentReference: item.visitPass ? `APT-${item.visitPass.passCode.slice(-10).toUpperCase()}` : null,
      appointmentAt: item.requestedDate.toISOString(),
      purpose: item.message ?? item.relationship,
      appointmentStatus: item.status,
      officerNote: item.replyMessage,
      bookedAt: item.createdAt.toISOString(),
      closedAt: item.updatedAt.toISOString(),
      prisoner: { ...item.prisoner, publicId: item.prisoner.publicId ?? 'PRN-UNKNOWN' },
      passStatus: item.visitPass ? displayPassStatus(item.visitPass.status, item.visitPass.expiresAt) : null,
      checkedInAt: item.visitPass?.checkedInAt?.toISOString() ?? null,
      changeOutcome: item.changeRequests[0] ?? null,
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / query.limit)),
    },
  };
};
