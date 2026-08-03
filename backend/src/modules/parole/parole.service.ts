import { ActionType, ParoleStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma';
import { createPublicReference } from '../../utils/public-reference';
import { recordAudit } from '../audit';
import { createNotification } from '../notifications';
import {
  CreateParoleRequestInput,
  OfficerParoleRequestResult,
  ParoleStatusFilterInput,
  PrisonerParoleRequestResult,
  ReviewParoleRequestInput,
} from './parole.types';

export class ParoleError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ParoleError';
  }
}

const prisonerParoleSelect = {
  id: true, reference: true, relativeName: true, relationship: true, purpose: true,
  message: true, fromDate: true, toDate: true, status: true, officerReply: true,
  reviewedAt: true, createdAt: true, updatedAt: true,
  officer: { select: { publicId: true, name: true } },
} as const;

const officerParoleSelect = {
  ...prisonerParoleSelect,
  prisoner: { select: { publicId: true, name: true } },
} as const;

const mapPrisonerParoleRequest = (request: any): PrisonerParoleRequestResult => ({
  id: request.id,
  reference: request.reference,
  relativeName: request.relativeName,
  relationship: request.relationship,
  purpose: request.purpose,
  message: request.message,
  fromDate: request.fromDate.toISOString(),
  toDate: request.toDate.toISOString(),
  status: request.status,
  officerReply: request.officerReply,
  reviewedAt: request.reviewedAt?.toISOString() ?? null,
  reviewer: request.officer ?? null,
  createdAt: request.createdAt.toISOString(),
  updatedAt: request.updatedAt.toISOString(),
});

const mapOfficerParoleRequest = (request: any): OfficerParoleRequestResult => {
  const { id: _privateId, ...safe } = mapPrisonerParoleRequest(request);
  return { ...safe, prisoner: { publicId: request.prisoner.publicId ?? 'PRN-UNKNOWN', name: request.prisoner.name } };
};

const parseParoleDates = (input: CreateParoleRequestInput) => {
  const fromDate = new Date(input.fromDate);
  const toDate = new Date(input.toDate);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) throw new ParoleError(400, 'Invalid parole request data');
  if (fromDate <= new Date()) throw new ParoleError(400, 'Parole from date must be in the future');
  if (toDate < fromDate) throw new ParoleError(400, 'Parole to date must be after from date');
  return { fromDate, toDate };
};

export const createPrisonerParoleRequest = async (userId: string, input: CreateParoleRequestInput) => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: { id: true, name: true, assignedOfficer: { select: { userId: true } } },
  });
  if (!prisoner) throw new ParoleError(404, 'Prisoner profile not found');
  const { fromDate, toDate } = parseParoleDates(input);
  const reference = createPublicReference('PAR');
  try {
    const request = await prisma.$transaction(async (tx) => {
      const created = await tx.paroleRequest.create({
        data: {
          reference, pendingKey: prisoner.id, prisonerId: prisoner.id,
          relativeName: input.relativeName, relationship: input.relationship,
          purpose: input.purpose, message: input.message, fromDate, toDate,
        },
        select: prisonerParoleSelect,
      });
      await createNotification({ userId, type: 'PAROLE_SUBMITTED', title: 'Parole request submitted', message: 'Your parole request was submitted for Officer review.', link: '/prisoner/parole', dedupeKey: `PAROLE_SUBMITTED:${reference}` }, tx);
      if (prisoner.assignedOfficer) {
        await createNotification({ userId: prisoner.assignedOfficer.userId, type: 'PAROLE_PENDING', title: 'Parole request requires review', message: `A parole request for ${prisoner.name} requires review.`, link: '/officer/parole?status=PENDING', dedupeKey: `PAROLE_PENDING:${reference}` }, tx);
      }
      return created;
    });
    return mapPrisonerParoleRequest(request);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ParoleError(409, 'A pending parole request already exists');
    throw error;
  }
};

export const getPrisonerParoleRequests = async (userId: string) => {
  const prisoner = await prisma.prisonerProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!prisoner) throw new ParoleError(404, 'Prisoner profile not found');
  const requests = await prisma.paroleRequest.findMany({ where: { prisonerId: prisoner.id }, orderBy: { createdAt: 'desc' }, select: prisonerParoleSelect });
  return requests.map(mapPrisonerParoleRequest);
};

export const getOfficerParoleRequests = async (officerUserId: string, filter: ParoleStatusFilterInput) => {
  const where: Prisma.ParoleRequestWhereInput = {
    prisoner: { assignedOfficer: { userId: officerUserId } },
    ...(filter.status !== 'ALL' ? { status: filter.status } : {}),
    ...(filter.dateFrom || filter.dateTo ? { createdAt: { ...(filter.dateFrom ? { gte: new Date(filter.dateFrom) } : {}), ...(filter.dateTo ? { lte: new Date(filter.dateTo) } : {}) } } : {}),
    ...(filter.search ? { OR: [
      { reference: { contains: filter.search, mode: 'insensitive' } },
      { prisoner: { publicId: { contains: filter.search, mode: 'insensitive' } } },
      { prisoner: { name: { contains: filter.search, mode: 'insensitive' } } },
    ] } : {}),
  };
  const [requests, totalItems] = await prisma.$transaction([
    prisma.paroleRequest.findMany({ where, orderBy: { createdAt: 'asc' }, skip: (filter.page - 1) * filter.limit, take: filter.limit, select: officerParoleSelect }),
    prisma.paroleRequest.count({ where }),
  ]);
  return { items: requests.map(mapOfficerParoleRequest), pagination: { page: filter.page, limit: filter.limit, totalItems, totalPages: Math.max(1, Math.ceil(totalItems / filter.limit)) } };
};

export const reviewParoleRequest = async (officerUserId: string, reference: string, input: ReviewParoleRequestInput) => {
  const result = await prisma.$transaction(async (tx) => {
    const officer = await tx.officerProfile.findUnique({ where: { userId: officerUserId }, select: { id: true } });
    if (!officer) throw new ParoleError(404, 'Officer profile not found');
    const claimed = await tx.paroleRequest.updateMany({
      where: { reference, status: ParoleStatus.PENDING, prisoner: { assignedOfficerId: officer.id } },
      data: { status: input.status, officerReply: input.replyMessage, officerId: officer.id, reviewedAt: new Date(), pendingKey: null },
    });
    if (claimed.count !== 1) return null;
    const request = await tx.paroleRequest.findUniqueOrThrow({ where: { reference }, select: { prisoner: { select: { userId: true } } } });
    const approved = input.status === ParoleStatus.ACCEPTED;
    await createNotification({ userId: request.prisoner.userId, type: approved ? 'PAROLE_APPROVED' : 'PAROLE_REJECTED', title: approved ? 'Parole request approved' : 'Parole request rejected', message: approved ? 'Your parole request was approved. Open Parole Status for details.' : 'Your parole request was rejected. Open Parole Status to read the Officer reply.', link: '/prisoner/parole', dedupeKey: `PAROLE_${input.status}:${reference}` }, tx);
    await recordAudit({ userId: officerUserId, action: approved ? ActionType.APPROVE : ActionType.REJECT, entity: 'ParoleRequest', entityReference: reference, result: 'SUCCESS', summary: `Parole request ${input.status.toLowerCase()}.` }, tx);
    const updated = await tx.paroleRequest.findUniqueOrThrow({ where: { reference }, select: officerParoleSelect });
    return mapOfficerParoleRequest(updated);
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  if (!result) {
    await Promise.all([
      recordAudit({ userId: officerUserId, action: ActionType.CONFLICT, entity: 'ParoleRequest', entityReference: reference, result: 'CONFLICT', summary: 'Parole request was already processed or outside assignment.' }),
      createNotification({ userId: officerUserId, type: 'OFFICER_ACTION_CONFLICT', title: 'Parole request already processed', message: 'Another Officer already processed this parole request.', link: '/officer/parole?status=PENDING', dedupeKey: `OFFICER_PAROLE_CONFLICT:${reference}:${officerUserId}` }),
    ]);
    throw new ParoleError(409, 'Another Officer already processed this parole request');
  }
  return result;
};
