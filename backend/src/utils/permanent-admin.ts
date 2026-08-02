import { Prisma } from '@prisma/client';

import prisma from '../config/prisma';

const PERMANENT_ADMIN_EMAIL = 'admin@jailmeet.com';

export const getPermanentAdminProfile = async (
  userId: string,
  db: Prisma.TransactionClient = prisma,
) => {
  const user = await db.user.findFirst({
    where: {
      id: userId,
      email: PERMANENT_ADMIN_EMAIL,
      role: 'ADMIN',
      isActive: true,
    },
    select: { adminProfile: { select: { id: true, userId: true } } },
  });

  return user?.adminProfile ?? null;
};

export const getPermanentAdminRecipient = async (
  db: Prisma.TransactionClient = prisma,
) => db.user.findFirst({
  where: {
    email: PERMANENT_ADMIN_EMAIL,
    role: 'ADMIN',
    isActive: true,
    adminProfile: { isNot: null },
  },
  select: {
    id: true,
    adminProfile: { select: { id: true } },
  },
});
