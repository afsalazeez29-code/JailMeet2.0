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
  createdAt: string;
  updatedAt: string;
};

export type OfficerParoleRequest = PrisonerParoleRequest & {
  prisoner: {
    id: string;
    name: string;
  };
};

export type AdminParoleRequest = {
  id: string;
  relativeName: string;
  relationship: string;
  purpose: string;
  message: string | null;
  fromDate: string;
  toDate: string;
  status: ParoleStatus;
  officerReply: string | null;
  createdAt: string;
  updatedAt: string;
  prisoner: { id: string; name: string };
  officer: { id: string; name: string } | null;
};

export type ReviewParoleRequestInput = {
  status: 'ACCEPTED' | 'REJECTED';
  replyMessage?: string;
};
