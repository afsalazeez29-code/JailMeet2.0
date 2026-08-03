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

export const getAdminDashboard = async (adminUserId: string): Promise<AdminDashboardSummary> => {
  const [
    activeVisitorAccounts,
    activeVisitorsWithProfiles,
    activeOfficerAccounts,
    activeOfficersWithProfiles,
    activePrisonerAccounts,
    activePrisonersWithProfiles,
    unassignedPrisoners,
    pendingAppointments,
    pendingParoleRequests,
    pendingChangeRequests,
    openVisitorSupport,
    openPrisonerSupport,
    escalatedSupport,
    activeJailRules,
    firRequiringAttention,
    medicalRequiringAttention,
    unreadAdminNotifications,
    missingPublicIds,
    invalidAssignments,
    officerWorkload,
    recentSecurityWarnings,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: Role.VISITOR, isActive: true } }),
    prisma.visitorProfile.count({ where: { user: { role: Role.VISITOR, isActive: true } } }),
    prisma.user.count({ where: { role: Role.OFFICER, isActive: true } }),
    prisma.officerProfile.count({ where: { user: { role: Role.OFFICER, isActive: true } } }),
    prisma.user.count({ where: { role: Role.PRISONER, isActive: true } }),
    prisma.prisonerProfile.count({ where: { user: { role: Role.PRISONER, isActive: true } } }),
    prisma.prisonerProfile.count({ where: { assignedOfficerId: null, user: { role: Role.PRISONER, isActive: true } } }),
    prisma.appointment.count({
      where: { status: AppointmentStatus.PENDING },
    }),
    prisma.paroleRequest.count({
      where: { status: ParoleStatus.PENDING },
    }),
    prisma.appointmentChangeRequest.count({ where: { status: 'PENDING' } }),
    prisma.supportRequest.count({ where: { status: 'OPEN' } }),
    prisma.prisonerSupportRequest.count({ where: { status: 'OPEN' } }),
    prisma.prisonerSupportRequest.count({ where: { escalatedAt: { not: null }, officerHandledAt: null } }),
    prisma.jailRule.count({ where: { isActive: true } }),
    prisma.firRecord.count({ where: { status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
    prisma.medicalRecord.count({ where: { archivedAt: null, OR: [{ treatmentStatus: 'FOLLOW_UP_REQUIRED' }, { followUpDate: { lte: new Date() } }] } }),
    prisma.notification.count({ where: { userId: adminUserId, isRead: false } }),
    prisma.$queryRaw<Array<{ count: bigint }>>`SELECT (SELECT COUNT(*) FROM "VisitorProfile" WHERE "publicId" IS NULL) + (SELECT COUNT(*) FROM "OfficerProfile" WHERE "publicId" IS NULL) + (SELECT COUNT(*) FROM "PrisonerProfile" WHERE "publicId" IS NULL) AS count`,
    prisma.prisonerProfile.count({ where: { assignedOfficer: { user: { OR: [{ role: { not: Role.OFFICER } }, { isActive: false }] } } } }),
    prisma.officerProfile.findMany({ where: { user: { role: Role.OFFICER, isActive: true } }, orderBy: { name: 'asc' }, select: { publicId: true, name: true, _count: { select: { assignedPrisoners: true } } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 86400000) }, result: { in: ['BLOCKED', 'DENIED', 'FORBIDDEN', 'CONFLICT', 'INVALID'] } } }),
  ]);

  return {
    totalActiveValidAccounts: activeVisitorAccounts + activeOfficerAccounts + activePrisonerAccounts,
    activeVisitorAccounts,
    activeVisitorsWithProfiles,
    activeOfficerAccounts,
    activeOfficersWithProfiles,
    activePrisonerAccounts,
    activePrisonersWithProfiles,
    unassignedPrisoners,
    pendingAppointments,
    pendingParoleRequests,
    pendingChangeRequests,
    openVisitorSupport,
    openPrisonerSupport,
    escalatedSupport,
    activeJailRules,
    firRequiringAttention,
    medicalRequiringAttention,
    unreadAdminNotifications,
    integrityWarnings: (activeVisitorAccounts - activeVisitorsWithProfiles) + (activeOfficerAccounts - activeOfficersWithProfiles) + (activePrisonerAccounts - activePrisonersWithProfiles) + Number(missingPublicIds[0]?.count ?? 0) + unassignedPrisoners + invalidAssignments,
    operationalSummary: { officerWorkload: officerWorkload.map((item) => ({ publicId: item.publicId, name: item.name, assignedPrisoners: item._count.assignedPrisoners })), supportRequiringResponse: openVisitorSupport + openPrisonerSupport + escalatedSupport, overdueMedicalFollowUps: medicalRequiringAttention, recentSecurityWarnings },
  };
};

export const getOfficerDashboard = async (userId: string): Promise<OfficerDashboardSummary> => {
  const officer = await prisma.officerProfile.findUnique({ where: { userId }, select: { id: true, publicId: true, name: true } });
  if (!officer) throw new Error('Officer profile not found');
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const assigned = { prisoner: { assignedOfficerId: officer.id } };
  const [
    totalPrisoners,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    pendingParoleRequests,
    pendingChangeRequests,
    visitsToday,
    passesAwaitingVerification,
    openFirTasks,
    medicalRequestsRequiringAction,
    unreadNotifications,
    todaySchedule,
  ] = await prisma.$transaction([
    prisma.prisonerProfile.count({ where: { assignedOfficerId: officer.id, user: { isActive: true } } }),
    prisma.appointment.count({
      where: { ...assigned, status: AppointmentStatus.PENDING },
    }),
    prisma.appointment.count({
      where: { ...assigned, status: AppointmentStatus.ACCEPTED, requestedDate: { gte: new Date() } },
    }),
    prisma.appointment.count({
      where: { ...assigned, status: AppointmentStatus.REJECTED },
    }),
    prisma.paroleRequest.count({
      where: { ...assigned, status: ParoleStatus.PENDING },
    }),
    prisma.appointmentChangeRequest.count({ where: { appointment: assigned, status: 'PENDING' } }),
    prisma.appointment.count({ where: { ...assigned, requestedDate: { gte: start, lt: end }, status: AppointmentStatus.ACCEPTED } }),
    prisma.visitPass.count({ where: { appointment: { ...assigned, requestedDate: { gte: start, lt: end }, status: AppointmentStatus.ACCEPTED }, status: 'ACTIVE' } }),
    prisma.firRecord.count({ where: { ...assigned, status: { in: ['OPEN', 'UNDER_REVIEW'] } } }),
    prisma.medicalRecord.count({ where: { ...assigned, archivedAt: null, OR: [{ treatmentStatus: 'FOLLOW_UP_REQUIRED' }, { followUpDate: { lte: new Date() } }] } }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.appointment.findMany({ where: { ...assigned, requestedDate: { gte: start, lt: end }, status: AppointmentStatus.ACCEPTED }, orderBy: { requestedDate: 'asc' }, select: { reference: true, requestedDate: true, prisoner: { select: { publicId: true, name: true } }, visitor: { select: { publicId: true, name: true } }, visitPass: { select: { status: true, expiresAt: true } } } }),
  ]);

  return {
    officer: { publicId: officer.publicId ?? 'ID unavailable', name: officer.name },
    assignedPrisoners: totalPrisoners,
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    pendingParoleRequests,
    pendingChangeRequests,
    visitsToday,
    passesAwaitingVerification,
    openFirTasks,
    medicalRequestsRequiringAction,
    unreadNotifications,
    todaySchedule: todaySchedule.map((item) => ({ ...item, requestedDate: item.requestedDate.toISOString(), prisoner: { ...item.prisoner, publicId: item.prisoner.publicId ?? 'ID unavailable' }, visitor: { ...item.visitor, publicId: item.visitor.publicId ?? 'ID unavailable' }, passStatus: item.visitPass?.status ?? null, expiringSoon: Boolean(item.visitPass?.expiresAt && item.visitPass.expiresAt.getTime() - Date.now() <= 60 * 60 * 1000) })),
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
