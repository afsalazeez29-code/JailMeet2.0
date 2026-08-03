import type { AppointmentStatus } from '@prisma/client';

export type AdminDashboardSummary = {
  totalActiveValidAccounts: number;
  activeVisitorAccounts: number;
  activeVisitorsWithProfiles: number;
  activeOfficerAccounts: number;
  activeOfficersWithProfiles: number;
  activePrisonerAccounts: number;
  activePrisonersWithProfiles: number;
  unassignedPrisoners: number;
  pendingAppointments: number;
  pendingParoleRequests: number;
  pendingChangeRequests: number;
  openVisitorSupport: number;
  openPrisonerSupport: number;
  escalatedSupport: number;
  activeJailRules: number;
  firRequiringAttention: number;
  medicalRequiringAttention: number;
  unreadAdminNotifications: number;
  integrityWarnings: number;
  operationalSummary: {
    officerWorkload: Array<{ publicId: string | null; name: string; assignedPrisoners: number }>;
    supportRequiringResponse: number;
    overdueMedicalFollowUps: number;
    recentSecurityWarnings: number;
  };
};

export type OfficerDashboardSummary = {
  officer: { publicId: string; name: string };
  assignedPrisoners: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  pendingParoleRequests: number;
  pendingChangeRequests: number;
  visitsToday: number;
  passesAwaitingVerification: number;
  openFirTasks: number;
  medicalRequestsRequiringAction: number;
  unreadNotifications: number;
  todaySchedule: Array<{
    reference: string;
    requestedDate: string;
    prisoner: { publicId: string; name: string };
    visitor: { publicId: string | null; name: string };
    visitPass: { status: string; expiresAt: Date } | null;
    passStatus: string | null;
    expiringSoon: boolean;
  }>;
};

export type VisitorDashboardSummary = {
  publicId: string | null;
  myAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  appointments: Array<{
    id: string;
    appointmentAt: string;
    reason: string;
    status: AppointmentStatus;
    officerNote: string | null;
    createdAt: string;
    updatedAt: string;
    prisoner: {
      publicId: string;
      name: string;
      profilePic: string | null;
    };
  }>;
};

export type PrisonerDashboardSummary = {
  prisoner: {
    name: string;
    email: string;
    publicId: string | null;
    profilePic: string | null;
  };
  summary: {
    myParoleRequests: number;
    pendingParoleRequests: number;
    approvedParoleRequests: number;
    rejectedParoleRequests: number;
    myAppointments: number;
  };
};
