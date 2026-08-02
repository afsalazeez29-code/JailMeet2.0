import type { VisitorAppointment } from '@features/appointments/types';

export type AdminDashboardData = {
  totalUsers: number;
  totalVisitors: number;
  totalOfficers: number;
  totalPrisoners: number;
  totalAppointments: number;
  pendingAppointments: number;
  pendingParoleRequests: number;
};

export type OfficerDashboardData = {
  totalPrisoners: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  pendingParoleRequests: number;
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
