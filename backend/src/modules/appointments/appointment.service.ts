import { AppointmentStatus } from '@prisma/client';

import prisma from '../../config/prisma';
import {
  AppointmentStatusFilterInput,
  CreateAppointmentInput,
  OfficerAppointmentResult,
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
  prisoner: { id: string; name: string };
}): VisitorAppointmentResult => ({
  id: appointment.id,
  appointmentAt: toIso(appointment.requestedDate),
  reason: appointment.message ?? appointment.relationship,
  status: appointment.status,
  officerNote: appointment.replyMessage,
  createdAt: toIso(appointment.createdAt),
  updatedAt: toIso(appointment.updatedAt),
  prisoner: {
    id: appointment.prisoner.id,
    name: appointment.prisoner.name,
  },
});

const mapOfficerAppointment = (appointment: Parameters<typeof mapVisitorAppointment>[0] & {
  visitor: {
    id: string;
    publicId: string | null;
    name: string;
    phone: string;
  };
}): OfficerAppointmentResult => ({
  ...mapVisitorAppointment(appointment),
  visitor: {
    id: appointment.visitor.id,
    publicId: appointment.visitor.publicId,
    name: appointment.visitor.name,
    phone: appointment.visitor.phone,
  },
});

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
      id: true,
      name: true,
    },
  },
};

const officerAppointmentSelect = {
  ...appointmentSelect,
  visitor: {
    select: {
      id: true,
      publicId: true,
      name: true,
      phone: true,
    },
  },
};

export const getPrisonerOptions = async (): Promise<PrisonerOption[]> => {
  const prisoners = await prisma.prisonerProfile.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
    },
  });

  return prisoners;
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
      select: { id: true },
    }),
    prisma.prisonerProfile.findUnique({
      where: { id: input.prisonerId },
      select: { id: true },
    }),
  ]);

  if (!visitor) {
    throw new AppointmentError(404, 'Visitor profile not found');
  }

  if (!prisoner) {
    throw new AppointmentError(404, 'Prisoner not found');
  }

  const duplicateAppointment = await prisma.appointment.findFirst({
    where: {
      visitorId: visitor.id,
      prisonerId: prisoner.id,
      requestedDate,
      status: AppointmentStatus.PENDING,
    },
    select: { id: true },
  });

  if (duplicateAppointment) {
    throw new AppointmentError(409, 'Appointment already exists');
  }

  const appointment = await prisma.appointment.create({
    data: {
      visitorId: visitor.id,
      prisonerId: prisoner.id,
      requestedDate,
      relationship: 'Visitor',
      message: input.reason,
      status: AppointmentStatus.PENDING,
    },
    select: appointmentSelect,
  });

  return mapVisitorAppointment(appointment);
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
    select: appointmentSelect,
  });

  return appointments.map(mapVisitorAppointment);
};

export const getOfficerAppointments = async (
  filter: AppointmentStatusFilterInput,
): Promise<OfficerAppointmentResult[]> => {
  const appointments = await prisma.appointment.findMany({
    where: filter.status ? { status: filter.status } : undefined,
    orderBy: { requestedDate: 'asc' },
    select: officerAppointmentSelect,
  });

  return appointments.map(mapOfficerAppointment);
};

export const reviewAppointment = async (
  userId: string,
  appointmentId: string,
  input: ReviewAppointmentInput,
): Promise<OfficerAppointmentResult> => {
  const officer = await prisma.officerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!officer) {
    throw new AppointmentError(404, 'Officer profile not found');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true, status: true },
  });

  if (!appointment) {
    throw new AppointmentError(404, 'Appointment not found');
  }

  if (appointment.status !== AppointmentStatus.PENDING) {
    throw new AppointmentError(409, 'Only pending appointments can be reviewed');
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: input.status,
      replyMessage: input.officerNote,
      officerId: officer.id,
    },
    select: officerAppointmentSelect,
  });

  return mapOfficerAppointment(updatedAppointment);
};
