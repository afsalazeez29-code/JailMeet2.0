import { ParoleStatus } from '@prisma/client';

export type PrisonerParoleRequestResult = {
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

export type OfficerParoleRequestResult = PrisonerParoleRequestResult & {
  prisoner: {
    id: string;
    name: string;
  };
};
