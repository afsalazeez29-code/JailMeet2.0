import type { PaginatedData } from '@/types/api';

export type ParoleStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type ParoleListFilters = {
  search?: string;
  page?: number;
  limit?: number;
  status?: ParoleStatus;
};

export type PaginatedResponse<T> = PaginatedData<T>;


export type CreateParoleRequestInput = {
  relativeName: string;
  relationship: string;
  purpose: string;
  message?: string;
  fromDate: string;
  toDate: string;
};

export type PrisonerParoleRequest = {
  id: string;
  reference: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: string;
  toDate: string;
  status: ParoleStatus;
  officerReply: string | null;
  reviewedAt: string | null;
  reviewer: { publicId: string | null; name: string } | null;
  createdAt: string;
  updatedAt: string;
};

export type OfficerParoleRequest = Omit<PrisonerParoleRequest, 'id'> & {
  prisoner: {
    publicId: string;
    name: string;
  };
};

export type AdminParoleRequest = {
  reference: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: string;
  toDate: string;
  status: ParoleStatus;
  officerReply: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner: { publicId: string | null; name: string; assignedOfficer: { publicId: string | null; name: string } | null };
  officer: { publicId: string | null; name: string } | null;
};

export type ReviewParoleRequestInput = {
  status: 'ACCEPTED' | 'REJECTED';
  replyMessage?: string;
};
