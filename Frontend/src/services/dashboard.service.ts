import { requestWithAuth } from '@/services/auth.service';
import {
  AdminDashboardData,
  OfficerDashboardData,
  PrisonerDashboardData,
  VisitorDashboardData,
} from '@/types/dashboard';

export const getAdminDashboard = async (
  token?: string | null,
): Promise<AdminDashboardData> =>
  requestWithAuth<AdminDashboardData>('/dashboard/admin', token);

export const getVisitorDashboard = async (
  token?: string | null,
): Promise<VisitorDashboardData> =>
  requestWithAuth<VisitorDashboardData>('/dashboard/visitor', token);

export const getOfficerDashboard = async (
  token?: string | null,
): Promise<OfficerDashboardData> =>
  requestWithAuth<OfficerDashboardData>('/dashboard/officer', token);

export const getPrisonerDashboard = async (
  token?: string | null,
): Promise<PrisonerDashboardData> =>
  requestWithAuth<PrisonerDashboardData>('/dashboard/prisoner', token);
