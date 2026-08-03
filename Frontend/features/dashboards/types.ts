import type { VisitorAppointment } from '@features/appointments/types';

export type AdminDashboardData = {
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
  operationalSummary: { officerWorkload: Array<{ publicId: string | null; name: string; assignedPrisoners: number }>; supportRequiringResponse: number; overdueMedicalFollowUps: number; recentSecurityWarnings: number };
};

export type OfficerDashboardData = {
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
  todaySchedule: Array<{ reference: string; requestedDate: string; prisoner: { publicId: string; name: string }; visitor: { publicId: string | null; name: string }; passStatus: string | null; expiringSoon: boolean }>;
};

export type VisitorDashboardData = {
  publicId: string | null;
  myAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  appointments: VisitorAppointment[];
};

export type PrisonerDashboardData = {
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
