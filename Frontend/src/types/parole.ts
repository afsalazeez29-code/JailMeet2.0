export type ParoleStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

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

export type ReviewParoleRequestInput = {
  status: 'ACCEPTED' | 'REJECTED';
  replyMessage?: string;
};
