import { randomBytes } from 'crypto';
import { ActionType, AppointmentStatus, Prisma, VisitPassStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import { getPermanentAdminRecipient } from '../../utils/permanent-admin';
import { recordAudit } from '../audit';
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
      reference: true,
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
          assignedOfficerId: true,
        },
      },
    },
  },
} as const;

export const generatePassCode = (): string =>
  `JMP-${randomBytes(24).toString('base64url')}`;

export const calculatePassExpiry = (appointmentAt: Date): Date =>
  new Date(appointmentAt.getTime() + 2 * 60 * 60 * 1000);

const notifyAdminOfKnownPassWarning = async (
  appointmentReference: string,
  warning: string,
) => {
  const admin = await getPermanentAdminRecipient();
  if (!admin) return;
  await createNotification({
    userId: admin.id,
    type: 'VISIT_PASS_SECURITY_WARNING',
    title: 'VisitPass security warning',
    message: `A known pass for ${appointmentReference} produced a ${warning} warning.`,
    link: `/admin/appointments?reference=${encodeURIComponent(appointmentReference)}`,
    dedupeKey: `ADMIN_VISIT_PASS_WARNING:${appointmentReference}:${warning}`,
  });
};

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
    checkedInByOfficerId: null,
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
    appointmentReference: pass.appointment.reference,
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

const getOfficer = async (userId: string) => {
  const officer = await prisma.officerProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!officer) throw new VisitPassError(404, 'Officer profile not found');
  return officer;
};

export const verifyVisitPass = async (officerUserId: string, passCode: string) => {
  const officer = await getOfficer(officerUserId);
  const pass = await findPassByCode(passCode);
  if (!pass) {
    await recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: 'UNRESOLVED', result: 'NOT_FOUND', summary: 'Visit pass verification failed.' });
    throw new VisitPassError(404, 'Visit pass not found');
  }
  if (pass.appointment.prisoner.assignedOfficerId !== officer.id) {
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: pass.appointment.reference, result: 'FORBIDDEN', summary: 'Visit pass belongs to a prisoner outside Officer assignment.' }),
      notifyAdminOfKnownPassWarning(pass.appointment.reference, 'cross-assignment'),
    ]);
    throw new VisitPassError(403, 'This visit is outside your assigned prisoners');
  }
  if (pass.status !== VisitPassStatus.ACTIVE) {
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: pass.appointment.reference, result: pass.status, summary: 'Visit pass was not active.' }),
      createNotification({ userId: officerUserId, type: 'VISIT_PASS_INVALID_STATE', title: `Visit pass is ${pass.status.toLowerCase()}`, message: `The known pass for ${pass.appointment.reference} cannot be used.`, link: '/officer/visit-verification', dedupeKey: `VISIT_PASS_INVALID:${pass.appointment.reference}:${pass.status}:${officerUserId}` }),
      notifyAdminOfKnownPassWarning(pass.appointment.reference, pass.status.toLowerCase()),
    ]);
    throw new VisitPassError(409, `Visit pass is ${pass.status.toLowerCase()}`);
  }
  if (pass.appointment.status !== AppointmentStatus.ACCEPTED) {
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: pass.appointment.reference, result: 'INVALID_APPOINTMENT', summary: 'Appointment was not approved.' }),
      notifyAdminOfKnownPassWarning(pass.appointment.reference, 'invalid-appointment'),
    ]);
    throw new VisitPassError(409, 'Appointment is not approved');
  }
  if (pass.expiresAt <= new Date()) {
    await prisma.visitPass.updateMany({
      where: { passCode, status: VisitPassStatus.ACTIVE },
      data: { status: VisitPassStatus.EXPIRED },
    });
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: pass.appointment.reference, result: 'EXPIRED', summary: 'Visit pass expired.' }),
      createNotification({ userId: officerUserId, type: 'VISIT_PASS_INVALID_STATE', title: 'Visit pass expired', message: `The known pass for ${pass.appointment.reference} has expired.`, link: '/officer/visit-verification', dedupeKey: `VISIT_PASS_INVALID:${pass.appointment.reference}:EXPIRED:${officerUserId}` }),
      notifyAdminOfKnownPassWarning(pass.appointment.reference, 'expired'),
    ]);
    throw new VisitPassError(410, 'Visit pass has expired');
  }
  await recordAudit({ userId: officerUserId, action: ActionType.VERIFY, entity: 'VisitPass', entityReference: pass.appointment.reference, result: 'VALID', summary: 'Visit pass verified successfully.' });
  return safePassDto(pass);
};

export const useVisitPass = async (officerUserId: string, passCode: string) => {
  const officer = await getOfficer(officerUserId);
  await verifyVisitPass(officerUserId, passCode);

  return prisma.$transaction(async (tx) => {
  const pass = await tx.visitPass.findUnique({
    where: { passCode },
    select: passSelect,
  });
  if (!pass) throw new VisitPassError(404, 'Visit pass not found');
  if (pass.appointment.prisoner.assignedOfficerId !== officer.id) throw new VisitPassError(403, 'This visit is outside your assigned prisoners');
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
    data: { status: VisitPassStatus.USED, checkedInAt, checkedInByOfficerId: officer.id },
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
    dedupeKey: `VISIT_PASS_USED:${pass.appointment.reference}`,
  }, tx);
  await createNotification({
    userId: pass.appointment.prisoner.userId,
    type: 'PRISONER_VISIT_COMPLETED',
    title: 'Visit completed',
    message: `The visit with ${pass.appointment.visitor.name} (${pass.appointment.visitor.publicId ?? 'Visitor ID unavailable'}) was completed.`,
    link: '/prisoner/visits/history',
    dedupeKey: `PRISONER_VISIT_COMPLETED:${pass.appointment.reference}`,
  }, tx);
  await recordAudit({ userId: officerUserId, action: ActionType.COMPLETE, entity: 'VisitPass', entityReference: pass.appointment.reference, result: 'SUCCESS', summary: 'Visit pass checked in and appointment completed.' }, tx);

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
        reference: true,
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
      appointmentReference: item.reference,
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
