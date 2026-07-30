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
};

export type PrisonerDashboardSummary = {
  myParoleRequests: number;
  pendingParoleRequests: number;
  approvedParoleRequests: number;
  rejectedParoleRequests: number;
  myAppointments: number;
};
