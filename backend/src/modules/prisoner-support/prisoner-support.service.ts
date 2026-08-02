import {
  Prisma,
  PrisonerSupportCategory,
  SupportRequestStatus,
} from '@prisma/client';

import prisma from '../../config/prisma';
import {
  getPermanentAdminProfile,
  getPermanentAdminRecipient,
} from '../../utils/permanent-admin';
import { createNotification } from '../notifications';

export class PrisonerSupportError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'PrisonerSupportError';
  }
}

const prisonerSelect = {
  id: true,
  category: true,
  subject: true,
  message: true,
  status: true,
  adminReply: true,
  resolvedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const adminSelect = {
  ...prisonerSelect,
  prisoner: { select: { publicId: true, name: true } },
} as const;

const mapRequest = (item: {
  id: string;
  category: PrisonerSupportCategory;
  subject: string;
  message: string;
  status: SupportRequestStatus;
  adminReply: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  prisoner?: { publicId: string | null; name: string };
}) => ({
  ...item,
  resolvedAt: item.resolvedAt?.toISOString() ?? null,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

const pagination = (page: number, limit: number, totalItems: number) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
});

export const createPrisonerSupportRequest = async (
  userId: string,
  input: {
    category: PrisonerSupportCategory;
    subject: string;
    message: string;
  },
) => prisma.$transaction(async (tx) => {
  const prisoner = await tx.prisonerProfile.findUnique({
    where: { userId },
    select: { id: true, publicId: true, name: true },
  });
  if (!prisoner) throw new PrisonerSupportError(404, 'Prisoner profile not found');
  const admin = await getPermanentAdminRecipient(tx);
  if (!admin?.adminProfile) throw new PrisonerSupportError(503, 'Permanent Admin is unavailable');

  const request = await tx.prisonerSupportRequest.create({
    data: { ...input, prisonerProfileId: prisoner.id },
    select: prisonerSelect,
  });

  await Promise.all([
    createNotification({
      userId,
      type: 'PRISONER_SUPPORT_SUBMITTED',
      title: 'Support request submitted',
      message: 'Your Support / Grievance request was sent to the Admin.',
      link: '/prisoner/support',
    }, tx),
    createNotification({
      userId: admin.id,
      type: 'PRISONER_SUPPORT_RECEIVED',
      title: 'New Prisoner support request',
      message: `A new request was submitted by ${prisoner.name} (${prisoner.publicId ?? 'Prisoner ID unavailable'}).`,
      link: '/admin/prisoner-support-requests',
    }, tx),
  ]);

  return mapRequest(request);
});

export const listPrisonerSupportRequests = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const where = { prisoner: { userId } };
  const [items, totalItems] = await prisma.$transaction([
    prisma.prisonerSupportRequest.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: prisonerSelect,
    }),
    prisma.prisonerSupportRequest.count({ where }),
  ]);
  return {
    items: items.map(mapRequest),
    pagination: pagination(page, limit, totalItems),
  };
};

export const getPrisonerSupportRequest = async (
  userId: string,
  requestId: string,
) => {
  const item = await prisma.prisonerSupportRequest.findFirst({
    where: { id: requestId, prisoner: { userId } },
    select: prisonerSelect,
  });
  if (!item) throw new PrisonerSupportError(404, 'Support request not found');
  return mapRequest(item);
};

export const listAdminPrisonerSupportRequests = async (
  userId: string,
  query: {
    page: number;
    limit: number;
    category?: PrisonerSupportCategory;
    status?: SupportRequestStatus;
  },
) => {
  if (!(await getPermanentAdminProfile(userId))) {
    throw new PrisonerSupportError(403, 'Permanent Admin access required');
  }
  const where: Prisma.PrisonerSupportRequestWhereInput = {
    ...(query.category ? { category: query.category } : {}),
    ...(query.status ? { status: query.status } : {}),
  };
  const [items, totalItems] = await prisma.$transaction([
    prisma.prisonerSupportRequest.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: adminSelect,
    }),
    prisma.prisonerSupportRequest.count({ where }),
  ]);
  return {
    items: items.map(mapRequest),
    pagination: pagination(query.page, query.limit, totalItems),
  };
};

export const getAdminPrisonerSupportRequest = async (
  userId: string,
  requestId: string,
) => {
  if (!(await getPermanentAdminProfile(userId))) {
    throw new PrisonerSupportError(403, 'Permanent Admin access required');
  }
  const item = await prisma.prisonerSupportRequest.findUnique({
    where: { id: requestId },
    select: adminSelect,
  });
  if (!item) throw new PrisonerSupportError(404, 'Support request not found');
  return mapRequest(item);
};

export const updateAdminPrisonerSupportRequest = async (
  userId: string,
  requestId: string,
  input: { status: SupportRequestStatus; adminReply?: string },
) => prisma.$transaction(async (tx) => {
  const admin = await getPermanentAdminProfile(userId, tx);
  if (!admin) throw new PrisonerSupportError(403, 'Permanent Admin access required');
  const request = await tx.prisonerSupportRequest.findUnique({
    where: { id: requestId },
    select: {
      status: true,
      adminReply: true,
      prisoner: { select: { userId: true } },
    },
  });
  if (!request) throw new PrisonerSupportError(404, 'Support request not found');

  const replyChanged = input.adminReply !== undefined && input.adminReply !== request.adminReply;
  const statusChanged = input.status !== request.status;
  const updated = await tx.prisonerSupportRequest.update({
    where: { id: requestId },
    data: {
      status: input.status,
      ...(input.adminReply !== undefined
        ? { adminReply: input.adminReply, repliedByAdminId: admin.id }
        : {}),
      resolvedAt:
        input.status === SupportRequestStatus.RESOLVED ||
        input.status === SupportRequestStatus.CLOSED
          ? new Date()
          : null,
    },
    select: adminSelect,
  });

  if (replyChanged || statusChanged) {
    await createNotification({
      userId: request.prisoner.userId,
      type: replyChanged ? 'PRISONER_SUPPORT_REPLY' : 'PRISONER_SUPPORT_STATUS_CHANGED',
      title: replyChanged ? 'Admin replied to your support request' : 'Support request updated',
      message: `Your Support / Grievance request is now ${input.status.replace('_', ' ').toLowerCase()}.`,
      link: '/prisoner/support',
    }, tx);
  }

  return mapRequest(updated);
});
