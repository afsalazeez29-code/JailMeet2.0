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
  const visitorWhere = { visitor: { userId } };

  const [
    myAppointments,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
  ] = await prisma.$transaction([
    prisma.appointment.count({ where: visitorWhere }),
    prisma.appointment.count({
      where: {
        ...visitorWhere,
        status: AppointmentStatus.PENDING,
      },
    }),
    prisma.appointment.count({
      where: {
        ...visitorWhere,
        status: AppointmentStatus.ACCEPTED,
      },
    }),
    prisma.appointment.count({
      where: {
        ...visitorWhere,
        status: AppointmentStatus.REJECTED,
      },
    }),
  ]);

  return {
    myAppointments,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
  };
};

export const getPrisonerDashboard = async (
  userId: string,
): Promise<PrisonerDashboardSummary> => {
  const prisonerWhere = { prisoner: { userId } };

  const [
    myParoleRequests,
    pendingParoleRequests,
    approvedParoleRequests,
    rejectedParoleRequests,
    myAppointments,
  ] = await prisma.$transaction([
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

  return {
    myParoleRequests,
    pendingParoleRequests,
    approvedParoleRequests,
    rejectedParoleRequests,
    myAppointments,
  };
};
