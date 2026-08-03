import { Prisma, Role } from '@prisma/client';

import { DomainError } from './domain-error';

type PublicIdRole = Role.VISITOR | Role.OFFICER | Role.PRISONER;

const prefixes: Record<PublicIdRole, 'VIS' | 'OFR' | 'PRN'> = {
  [Role.VISITOR]: 'VIS',
  [Role.OFFICER]: 'OFR',
  [Role.PRISONER]: 'PRN',
};

/**
 * Allocates the next role ID while holding a transaction-scoped PostgreSQL
 * advisory lock. Call only from the transaction that creates/repairs the
 * profile so concurrent requests cannot choose the same suffix.
 */
export const allocateRolePublicId = async (
  tx: Prisma.TransactionClient,
  role: PublicIdRole,
): Promise<string> => {
  const prefix = prefixes[role];
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`jailmeet:${prefix}:public-id`}))`;

  const rows = role === Role.VISITOR
    ? await tx.visitorProfile.findMany({ where: { publicId: { startsWith: `${prefix}-` } }, select: { publicId: true } })
    : role === Role.OFFICER
      ? await tx.officerProfile.findMany({ where: { publicId: { startsWith: `${prefix}-` } }, select: { publicId: true } })
      : await tx.prisonerProfile.findMany({ where: { publicId: { startsWith: `${prefix}-` } }, select: { publicId: true } });

  const greatest = rows.reduce((max, row) => {
    const match = row.publicId?.match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  if (greatest >= 999999) {
    throw new DomainError(422, `No ${role.toLowerCase()} public IDs remain available`);
  }

  return `${prefix}-${String(greatest + 1).padStart(3, '0')}`;
};
