import {
  AppointmentStatus,
  ParoleStatus,
  Role,
} from '@prisma/client';

import prisma from '../../config/prisma';
import {
  AdminDashboardSummary,
  OfficerDashboardSummary,
  PrisonerDashboardSummary,
  VisitorDashboardSummary,
} from './dashboard.types';

export const getAdminDashboard = async (): Promise<AdminDashboardSummary> => {
  const [
    totalUsers,
    totalVisitors,
    totalOfficers,
    totalPrisoners,
    totalAppointments,
    pendingAppointments,
    pendingParoleRequests,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.VISITOR } }),
    prisma.user.count({ where: { role: Role.OFFICER } }),
    prisma.user.count({ where: { role: Role.PRISONER } }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: { status: AppointmentStatus.PENDING },
    }),
    prisma.paroleRequest.count({
      where: { status: ParoleStatus.PENDING },
    }),
  ]);

  return {
    totalUsers,
    totalVisitors,
    totalOfficers,
    totalPrisoners,
    totalAppointments,
    pendingAppointments,
    pendingParoleRequests,
  };
};

export const getOfficerDashboard = async (): Promise<OfficerDashboardSummary> => {
  const [
    totalPrisoners,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    pendingParoleRequests,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: Role.PRISONER } }),
    prisma.appointment.count({
      where: { status: AppointmentStatus.PENDING },
    }),
    prisma.appointment.count({
      where: { status: AppointmentStatus.ACCEPTED },
    }),
    prisma.appointment.count({
      where: { status: AppointmentStatus.REJECTED },
    }),
    prisma.paroleRequest.count({
      where: { status: ParoleStatus.PENDING },
    }),
  ]);

  return {
    totalPrisoners,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    pendingParoleRequests,
  };
};

export const getVisitorDashboard = async (
  userId: string,
): Promise<VisitorDashboardSummary> => {
  const visitorProfile = await prisma.visitorProfile.findUnique({
    where: { userId },
    select: {
      publicId: true,
      appointments: {
        orderBy: { requestedDate: 'desc' },
        select: {
          id: true,
          requestedDate: true,
          message: true,
          relationship: true,
          status: true,
          replyMessage: true,
          createdAt: true,
          updatedAt: true,
          prisoner: {
            select: { publicId: true, name: true, profilePic: true },
          },
        },
      },
    },
  });

  if (!visitorProfile) {
    throw new Error('Visitor profile not found');
  }

  const appointments = visitorProfile.appointments.map((appointment) => ({
    id: appointment.id,
    appointmentAt: appointment.requestedDate.toISOString(),
    reason: appointment.message ?? appointment.relationship,
    status: appointment.status,
    officerNote: appointment.replyMessage,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    prisoner: {
      publicId: appointment.prisoner.publicId ?? 'PRN-UNKNOWN',
      name: appointment.prisoner.name,
      profilePic: appointment.prisoner.profilePic,
    },
  }));

  return {
    publicId: visitorProfile.publicId,
    myAppointments: appointments.length,
    pendingAppointments: appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.PENDING,
    ).length,
    approvedAppointments: appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.ACCEPTED,
    ).length,
    rejectedAppointments: appointments.filter(
      (appointment) => appointment.status === AppointmentStatus.REJECTED,
    ).length,
    appointments,
  };
};

export const getPrisonerDashboard = async (
  userId: string,
): Promise<PrisonerDashboardSummary> => {
  const prisonerWhere = { prisoner: { userId } };

  const [
    prisoner,
    myParoleRequests,
    pendingParoleRequests,
    approvedParoleRequests,
    rejectedParoleRequests,
    myAppointments,
  ] = await prisma.$transaction([
    prisma.prisonerProfile.findUnique({
      where: { userId },
      select: {
        name: true,
        publicId: true,
        profilePic: true,
        user: { select: { email: true } },
      },
    }),
    prisma.paroleRequest.count({ where: prisonerWhere }),
    prisma.paroleRequest.count({
      where: {
        ...prisonerWhere,
        status: ParoleStatus.PENDING,
      },
    }),
    prisma.paroleRequest.count({
      where: {
        ...prisonerWhere,
        status: ParoleStatus.ACCEPTED,
      },
    }),
    prisma.paroleRequest.count({
      where: {
        ...prisonerWhere,
        status: ParoleStatus.REJECTED,
      },
    }),
    prisma.appointment.count({ where: prisonerWhere }),
  ]);

  if (!prisoner) {
    throw new Error('Prisoner profile not found');
  }

  return {
    prisoner: {
      name: prisoner.name,
      email: prisoner.user.email ?? '',
      publicId: prisoner.publicId,
      profilePic: prisoner.profilePic,
    },
    summary: {
      myParoleRequests,
      pendingParoleRequests,
      approvedParoleRequests,
      rejectedParoleRequests,
      myAppointments,
    },
  };
};
