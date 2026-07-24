import { ParoleStatus } from '@prisma/client';
import { z } from 'zod';

import {
  createParoleRequestSchema,
  paroleStatusFilterSchema,
  reviewParoleRequestSchema,
} from './parole.schema';

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

export type CreateParoleRequestInput = z.infer<
  typeof createParoleRequestSchema
>;
export type ParoleStatusFilterInput = z.infer<
  typeof paroleStatusFilterSchema
>;
export type ReviewParoleRequestInput = z.infer<
  typeof reviewParoleRequestSchema
>;