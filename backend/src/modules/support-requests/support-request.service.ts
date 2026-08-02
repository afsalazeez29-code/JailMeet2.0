import { Prisma, SupportCategory, SupportRequestStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import { getPermanentAdminProfile } from '../../utils/permanent-admin';
import { createNotification } from '../notifications';

export class SupportRequestError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'SupportRequestError';
  }
}

const visitorSelect = {
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
  ...visitorSelect,
  visitor: { select: { publicId: true, name: true } },
} as const;

const mapRequest = (item: {
  id: string; category: SupportCategory; subject: string; message: string;
  status: SupportRequestStatus; adminReply: string | null; resolvedAt: Date | null;
  createdAt: Date; updatedAt: Date; visitor?: { publicId: string | null; name: string };
}) => ({
  ...item,
  resolvedAt: item.resolvedAt?.toISOString() ?? null,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

const pagination = (page: number, limit: number, totalItems: number) => ({
  page, limit, totalItems, totalPages: Math.max(1, Math.ceil(totalItems / limit)),
});

export const createVisitorSupportRequest = async (
  userId: string,
  input: { category: SupportCategory; subject: string; message: string },
) => {
  const visitor = await prisma.visitorProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!visitor) throw new SupportRequestError(404, 'Visitor profile not found');
  return mapRequest(await prisma.supportRequest.create({
    data: { ...input, visitorId: visitor.id },
    select: visitorSelect,
  }));
};

export const listVisitorSupportRequests = async (userId: string, page: number, limit: number) => {
  const where = { visitor: { userId } };
  const [items, totalItems] = await prisma.$transaction([
    prisma.supportRequest.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limit, take: limit, select: visitorSelect }),
    prisma.supportRequest.count({ where }),
  ]);
  return { items: items.map(mapRequest), pagination: pagination(page, limit, totalItems) };
};

export const getVisitorSupportRequest = async (userId: string, requestId: string) => {
  const item = await prisma.supportRequest.findFirst({ where: { id: requestId, visitor: { userId } }, select: visitorSelect });
  if (!item) throw new SupportRequestError(404, 'Support request not found');
  return mapRequest(item);
};

export const listAdminSupportRequests = async (
  userId: string,
  query: { page: number; limit: number; category?: SupportCategory; status?: SupportRequestStatus },
) => {
  if (!(await getPermanentAdminProfile(userId))) throw new SupportRequestError(403, 'Permanent Admin access required');
  const where: Prisma.SupportRequestWhereInput = {
    ...(query.category ? { category: query.category } : {}),
    ...(query.status ? { status: query.status } : {}),
  };
  const [items, totalItems] = await prisma.$transaction([
    prisma.supportRequest.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit, select: adminSelect }),
    prisma.supportRequest.count({ where }),
  ]);
  return { items: items.map(mapRequest), pagination: pagination(query.page, query.limit, totalItems) };
};

export const getAdminSupportRequest = async (userId: string, requestId: string) => {
  if (!(await getPermanentAdminProfile(userId))) throw new SupportRequestError(403, 'Permanent Admin access required');
  const item = await prisma.supportRequest.findUnique({ where: { id: requestId }, select: adminSelect });
  if (!item) throw new SupportRequestError(404, 'Support request not found');
  return mapRequest(item);
};

export const updateAdminSupportRequest = async (
  userId: string,
  requestId: string,
  input: { status: SupportRequestStatus; adminReply?: string },
) => prisma.$transaction(async (tx) => {
  const [admin, request] = await Promise.all([
    getPermanentAdminProfile(userId, tx),
    tx.supportRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true, adminReply: true, visitor: { select: { userId: true } } },
    }),
  ]);
  if (!admin) throw new SupportRequestError(403, 'Permanent Admin access required');
  if (!request) throw new SupportRequestError(404, 'Support request not found');

  const replyChanged = input.adminReply !== undefined && input.adminReply !== request.adminReply;
  const statusChanged = input.status !== request.status;
  const updated = await tx.supportRequest.update({
    where: { id: requestId },
    data: {
      status: input.status,
      ...(input.adminReply !== undefined ? { adminReply: input.adminReply, repliedByAdminId: admin.id } : {}),
      resolvedAt: input.status === SupportRequestStatus.RESOLVED || input.status === SupportRequestStatus.CLOSED
        ? new Date()
        : null,
    },
    select: adminSelect,
  });

  if (replyChanged || statusChanged) {
    await createNotification({
      userId: request.visitor.userId,
      type: replyChanged ? 'SUPPORT_REPLY' : 'SUPPORT_STATUS_CHANGED',
      title: replyChanged ? 'Admin replied to your support request' : 'Support request updated',
      message: `Your support request is now ${input.status.replace('_', ' ').toLowerCase()}.`,
      link: '/visitor/support',
    }, tx);
  }
  return mapRequest(updated);
});
