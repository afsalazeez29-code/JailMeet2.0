import { createHash } from 'crypto';
import { ParoleStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import {
  CreateParoleRequestInput,
  OfficerParoleRequestResult,
  ParoleStatusFilterInput,
  PrisonerParoleRequestResult,
  ReviewParoleRequestInput,
} from './parole.types';
import { createNotification } from '../notifications';

export class ParoleError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ParoleError';
    this.statusCode = statusCode;
  }
}

const toIso = (date: Date): string => date.toISOString();
const paroleReference = (id: string): string =>
  `PAR-${createHash('sha256').update(id).digest('hex').slice(0, 10).toUpperCase()}`;

const prisonerParoleSelect = {
  id: true,
  relativeName: true,
  relationship: true,
  purpose: true,
  message: true,
  fromDate: true,
  toDate: true,
  status: true,
  officerReply: true,
  createdAt: true,
  updatedAt: true,
};

const officerParoleSelect = {
  ...prisonerParoleSelect,
  prisoner: {
    select: {
      id: true,
      name: true,
    },
  },
};

const mapPrisonerParoleRequest = (request: {
  id: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: Date;
  toDate: Date;
  status: ParoleStatus;
  officerReply: string | null;
  createdAt: Date;
  updatedAt: Date;
}): PrisonerParoleRequestResult => ({
  id: request.id,
  reference: paroleReference(request.id),
  relativeName: request.relativeName,
  relationship: request.relationship,
  purpose: request.purpose,
  message: request.message,
  fromDate: toIso(request.fromDate),
  toDate: toIso(request.toDate),
  status: request.status,
  officerReply: request.officerReply,
  createdAt: toIso(request.createdAt),
  updatedAt: toIso(request.updatedAt),
});

const mapOfficerParoleRequest = (
  request: Parameters<typeof mapPrisonerParoleRequest>[0] & {
    prisoner: { id: string; name: string };
  },
): OfficerParoleRequestResult => ({
  ...mapPrisonerParoleRequest(request),
  prisoner: {
    id: request.prisoner.id,
    name: request.prisoner.name,
  },
});

const parseParoleDates = (input: CreateParoleRequestInput) => {
  const fromDate = new Date(input.fromDate);
  const toDate = new Date(input.toDate);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new ParoleError(400, 'Invalid parole request data');
  }

  if (fromDate <= new Date()) {
    throw new ParoleError(400, 'Parole from date must be in the future');
  }

  if (toDate < fromDate) {
    throw new ParoleError(400, 'Parole to date must be after from date');
  }

  return { fromDate, toDate };
};

export const createPrisonerParoleRequest = async (
  userId: string,
  input: CreateParoleRequestInput,
): Promise<PrisonerParoleRequestResult> => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!prisoner) {
    throw new ParoleError(404, 'Prisoner profile not found');
  }

  const pendingRequest = await prisma.paroleRequest.findFirst({
    where: {
      prisonerId: prisoner.id,
      status: ParoleStatus.PENDING,
    },
    select: { id: true },
  });

  if (pendingRequest) {
    throw new ParoleError(409, 'A pending parole request already exists');
  }

  const { fromDate, toDate } = parseParoleDates(input);

  const request = await prisma.$transaction(async (tx) => {
    const created = await tx.paroleRequest.create({
      data: {
        prisonerId: prisoner.id,
        relativeName: input.relativeName,
        relationship: input.relationship,
        purpose: input.purpose,
        message: input.message,
        fromDate,
        toDate,
        status: ParoleStatus.PENDING,
      },
      select: prisonerParoleSelect,
    });
    await createNotification({
      userId,
      type: 'PAROLE_SUBMITTED',
      title: 'Parole request submitted',
      message: 'Your parole request was submitted for Officer review.',
      link: '/prisoner/parole',
    }, tx);
    return created;
  });

  return mapPrisonerParoleRequest(request);
};

export const getPrisonerParoleRequests = async (
  userId: string,
): Promise<PrisonerParoleRequestResult[]> => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!prisoner) {
    throw new ParoleError(404, 'Prisoner profile not found');
  }

  const requests = await prisma.paroleRequest.findMany({
    where: { prisonerId: prisoner.id },
    orderBy: { createdAt: 'desc' },
    select: prisonerParoleSelect,
  });

  return requests.map(mapPrisonerParoleRequest);
};

export const getOfficerParoleRequests = async (
  filter: ParoleStatusFilterInput,
): Promise<OfficerParoleRequestResult[]> => {
  const requests = await prisma.paroleRequest.findMany({
    where: filter.status ? { status: filter.status } : undefined,
    orderBy: { createdAt: 'desc' },
    select: officerParoleSelect,
  });

  return requests.map(mapOfficerParoleRequest);
};

export const reviewParoleRequest = async (
  userId: string,
  paroleRequestId: string,
  input: ReviewParoleRequestInput,
): Promise<OfficerParoleRequestResult> => {
  const officer = await prisma.officerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!officer) {
    throw new ParoleError(404, 'Officer profile not found');
  }

  const paroleRequest = await prisma.paroleRequest.findUnique({
    where: { id: paroleRequestId },
    select: {
      id: true,
      status: true,
      prisoner: { select: { userId: true } },
    },
  });

  if (!paroleRequest) {
    throw new ParoleError(404, 'Parole request not found');
  }

  if (paroleRequest.status !== ParoleStatus.PENDING) {
    throw new ParoleError(409, 'Only pending parole requests can be reviewed');
  }

  const updatedRequest = await prisma.$transaction(async (tx) => {
    const updated = await tx.paroleRequest.update({
      where: { id: paroleRequestId },
      data: {
        status: input.status,
        officerReply: input.replyMessage,
        officerId: officer.id,
      },
      select: officerParoleSelect,
    });
    const approved = input.status === ParoleStatus.ACCEPTED;
    await createNotification({
      userId: paroleRequest.prisoner.userId,
      type: approved ? 'PAROLE_APPROVED' : 'PAROLE_REJECTED',
      title: approved ? 'Parole request approved' : 'Parole request rejected',
      message: approved
        ? 'Your parole request was approved. Open Parole Status for details.'
        : 'Your parole request was rejected. Open Parole Status to read the Officer reply.',
      link: '/prisoner/parole',
    }, tx);
    return updated;
  });

  return mapOfficerParoleRequest(updatedRequest);
};
