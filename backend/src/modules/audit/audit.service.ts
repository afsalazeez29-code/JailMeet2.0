import { ActionType, Prisma } from '@prisma/client';

import prisma from '../../config/prisma';
import { AuditResult } from '../../constants/audit-results';

type AuditInput = {
  userId?: string | null;
  action: ActionType;
  entity: string;
  entityReference?: string | null;
  result: AuditResult;
  summary?: string | null;
};

export const recordAudit = (
  input: AuditInput,
  db: Prisma.TransactionClient = prisma,
) => db.auditLog.create({
  data: {
    userId: input.userId ?? null,
    action: input.action,
    entity: input.entity,
    entityReference: input.entityReference ?? null,
    result: input.result,
    details: input.summary ?? null,
  },
  select: { createdAt: true },
});
