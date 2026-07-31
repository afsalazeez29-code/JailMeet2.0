import type { AppointmentStatus } from '@prisma/client';

export type AdminDashboardSummary = {
  totalUsers: number;
  totalVisitors: number;
  totalOfficers: number;
  totalPrisoners: number;
  totalAppointments: number;
  pendingAppointments: number;
  pendingParoleRequests: number;
};

export type OfficerDashboardSummary = {
  totalPrisoners: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  pendingParoleRequests: number;
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
  myParoleRequests: number;
  pendingParoleRequests: number;
  approvedParoleRequests: number;
  rejectedParoleRequests: number;
  myAppointments: number;
};
