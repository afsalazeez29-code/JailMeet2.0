import {
  ActionType,
  AppointmentStatus,
  ParoleStatus,
  Prisma,
  Role,
} from '@prisma/client';
import bcrypt from 'bcrypt';

import prisma from '../../config/prisma';
import { allocateRolePublicId } from '../../utils/role-public-id';
import { getPermanentAdminProfile } from '../../utils/permanent-admin';
import { recordAudit } from '../audit';
import { createNotification } from '../notifications';
import {
  AdminAppointmentOverview,
  AdminParoleOverview,
  AdminUserDetail,
  PaginatedResult,
  SafeAdminUser,
} from './admin.types';
import {
  AppointmentListQuery,
  CreateOfficerInput,
  CreatePrisonerInput,
  ParoleListQuery,
  ProfileListQuery,
  UpdateOfficerInput,
  UpdatePrisonerInput,
  UpdateUserStatusInput,
  UserListQuery,
} from './admin.types';

export class AdminError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AdminError';
    this.statusCode = statusCode;
  }
}

const PERMANENT_ADMIN_EMAIL = 'admin@jailmeet.com';

const toIso = (date: Date): string => date.toISOString();

const pagination = (page: number, limit: number, totalItems: number) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
});

const getProfileName = (user: {
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string; publicId: string | null } | null;
  visitorProfile?: { name: string; publicId: string | null } | null;
  prisonerProfile?: { name: string; publicId: string | null } | null;
}): string =>
  user.adminProfile?.name ??
  user.officerProfile?.name ??
  user.visitorProfile?.name ??
  user.prisonerProfile?.name ??
  '';

const safeUserSelect = {
  id: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  adminProfile: { select: { name: true } },
  officerProfile: { select: { name: true, publicId: true } },
  visitorProfile: { select: { name: true, publicId: true } },
  prisonerProfile: { select: { name: true, publicId: true } },
};

const toSafeUser = (user: {
  id: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string; publicId: string | null } | null;
  visitorProfile?: { name: string; publicId: string | null } | null;
  prisonerProfile?: { name: string; publicId: string | null } | null;
}): SafeAdminUser => ({
  accountReference: user.officerProfile?.publicId ?? user.visitorProfile?.publicId ?? user.prisonerProfile?.publicId ?? user.email ?? 'PROFILE-MISSING',
  publicId: user.officerProfile?.publicId ?? user.visitorProfile?.publicId ?? user.prisonerProfile?.publicId ?? null,
  name: getProfileName(user),
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: toIso(user.createdAt),
  updatedAt: toIso(user.updatedAt),
});

const userSearchWhere = (search?: string): Prisma.UserWhereInput[] => {
  if (!search) {
    return [];
  }

  return [
    { email: { contains: search, mode: 'insensitive' } },
    { adminProfile: { name: { contains: search, mode: 'insensitive' } } },
    { officerProfile: { name: { contains: search, mode: 'insensitive' } } },
    { visitorProfile: { name: { contains: search, mode: 'insensitive' } } },
    {
      visitorProfile: {
        publicId: { equals: search, mode: 'insensitive' },
      },
    },
    { prisonerProfile: { name: { contains: search, mode: 'insensitive' } } },
    { officerProfile: { publicId: { equals: search, mode: 'insensitive' } } },
    { prisonerProfile: { publicId: { equals: search, mode: 'insensitive' } } },
  ];
};

const listUsersWhere = (query: UserListQuery): Prisma.UserWhereInput => ({
  ...(query.role ? { role: query.role } : {}),
  ...(query.status ? { isActive: query.status === 'ACTIVE' } : {}),
  ...(query.search ? { OR: userSearchWhere(query.search) } : {}),
});

export const listUsers = async (
  query: UserListQuery,
): Promise<PaginatedResult<SafeAdminUser>> => {
  const where = listUsersWhere(query);
  const [items, totalItems] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: safeUserSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(toSafeUser),
    pagination: pagination(query.page, query.limit, totalItems),
  };
};

export const getUserDetail = async (
  userId: string,
): Promise<AdminUserDetail> => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: userId }, { visitorProfile: { publicId: userId } }, { officerProfile: { publicId: userId } }, { prisonerProfile: { publicId: userId } }] },
    select: {
      ...safeUserSelect,
      adminProfile: {
        select: { name: true, createdAt: true, updatedAt: true },
      },
      officerProfile: {
        select: { publicId: true, name: true, phone: true, createdAt: true, updatedAt: true },
      },
      visitorProfile: {
        select: {
          publicId: true,
          name: true,
          phone: true,
          state: true,
          address: true,
          zip: true,
          profilePic: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      prisonerProfile: {
        select: {
          publicId: true,
          name: true,
          age: true,
          gender: true,
          caseDetails: true,
          admissionDate: true,
          sentencePeriod: true,
          jailType: true,
          jailName: true,
          cellNumber: true,
          profilePic: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AdminError(404, 'User not found');
  }

  const profile =
    user.adminProfile ??
    user.officerProfile ??
    user.visitorProfile ??
    user.prisonerProfile ??
    null;

  return {
    user: toSafeUser(user),
    profile,
  };
};

export const updateUserStatus = async (
  adminUserId: string,
  targetUserId: string,
  input: UpdateUserStatusInput,
): Promise<SafeAdminUser> => {
  const target = await prisma.user.findFirst({
    where: { OR: [{ email: targetUserId }, { visitorProfile: { publicId: targetUserId } }, { officerProfile: { publicId: targetUserId } }, { prisonerProfile: { publicId: targetUserId } }] },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!target) {
    throw new AdminError(404, 'User not found');
  }

  if (!(await getPermanentAdminProfile(adminUserId))) {
    await recordAudit({ userId: adminUserId, action: ActionType.UPDATE, entity: 'UserAccountStatus', entityReference: target.email ?? target.role, result: 'BLOCKED', summary: 'Permanent-Admin restriction blocked an account-status change.' });
    throw new AdminError(403, 'Permanent Admin access required');
  }

  const expectedConfirmation = `${input.isActive ? 'ACTIVATE' : 'DEACTIVATE'} ${targetUserId}`;
  if (input.confirmation !== expectedConfirmation) throw new AdminError(422, `Confirmation must be exactly ${expectedConfirmation}`);

  if (target.email === PERMANENT_ADMIN_EMAIL && input.isActive === false) {
    await recordAudit({ userId: adminUserId, action: ActionType.UPDATE, entity: 'UserAccountStatus', entityReference: target.email, result: 'BLOCKED', summary: 'Permanent Admin deactivation was blocked.' });
    throw new AdminError(403, 'The permanent Admin cannot be deactivated');
  }

  if (adminUserId === target.id && input.isActive === false) {
    await recordAudit({ userId: adminUserId, action: ActionType.UPDATE, entity: 'UserAccountStatus', entityReference: target.email ?? target.role, result: 'BLOCKED', summary: 'Self-deactivation was blocked.' });
    throw new AdminError(400, 'Admins cannot deactivate their own account');
  }

  if (
    target.role === Role.ADMIN &&
    target.isActive &&
    input.isActive === false
  ) {
    const activeAdminCount = await prisma.user.count({
      where: { role: Role.ADMIN, isActive: true },
    });

    if (activeAdminCount <= 1) {
      await recordAudit({ userId: adminUserId, action: ActionType.UPDATE, entity: 'UserAccountStatus', entityReference: target.email ?? target.role, result: 'BLOCKED', summary: 'Last active Admin deactivation was blocked.' });
      throw new AdminError(400, 'Cannot deactivate the last active admin');
    }
  }

  return prisma.$transaction(async (tx) => {
    if (!(await getPermanentAdminProfile(adminUserId, tx))) throw new AdminError(403, 'Permanent Admin access required');
    const updatedUser = await tx.user.update({ where: { id: target.id }, data: { isActive: input.isActive }, select: safeUserSelect });
    await recordAudit({ userId: adminUserId, action: ActionType.UPDATE, entity: 'UserAccountStatus', entityReference: target.email ?? target.role, result: 'SUCCESS', summary: `Account ${input.isActive ? 'activated' : 'deactivated'}; reason recorded.` }, tx);
    return toSafeUser(updatedUser);
  });
};

export const getDeactivationImpact = async (targetReference: string) => {
  const target = await prisma.user.findFirst({ where: { OR: [{ email: targetReference }, { visitorProfile: { publicId: targetReference } }, { officerProfile: { publicId: targetReference } }, { prisonerProfile: { publicId: targetReference } }] }, select: { email: true, role: true, isActive: true, officerProfile: { select: { publicId: true, _count: { select: { assignedPrisoners: true, reviewedAppointments: true, reviewedParoleReqs: true, escalatedSupportRequests: true } } } }, visitorProfile: { select: { publicId: true, _count: { select: { appointments: true, supportRequests: true } } } }, prisonerProfile: { select: { publicId: true, _count: { select: { appointments: true, paroleRequests: true, supportRequests: true } } } } } });
  if (!target) throw new AdminError(404, 'User not found');
  const publicId = target.officerProfile?.publicId ?? target.visitorProfile?.publicId ?? target.prisonerProfile?.publicId ?? null;
  return { accountReference: publicId ?? target.email, role: target.role, isActive: target.isActive, effects: target.officerProfile?._count ?? target.visitorProfile?._count ?? target.prisonerProfile?._count ?? {}, warning: target.role === Role.OFFICER && (target.officerProfile?._count.assignedPrisoners ?? 0) > 0 ? 'Deactivation will leave assigned Prisoners connected to an inactive Officer until reassigned.' : 'Historical workflow records are preserved; login access changes immediately.' };
};

const profilePagination = async <T>(
  page: number,
  limit: number,
  totalItems: number,
  items: T[],
): Promise<PaginatedResult<T>> => ({
  items,
  pagination: pagination(page, limit, totalItems),
});

export const listVisitors = async (query: ProfileListQuery) => {
  const where: Prisma.VisitorProfileWhereInput = query.search
    ? {
        OR: [
          { publicId: { contains: query.search, mode: 'insensitive' } },
          { name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search, mode: 'insensitive' } },
          { user: { email: { contains: query.search, mode: 'insensitive' } } },
        ],
      }
    : {};
  const [items, totalItems] = await prisma.$transaction([
    prisma.visitorProfile.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        publicId: true,
        name: true,
        phone: true,
        state: true,
        address: true,
        zip: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true, isActive: true } },
      },
    }),
    prisma.visitorProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getVisitorDetail = async (visitorId: string) => {
  const visitor = await prisma.visitorProfile.findUnique({
    where: { publicId: visitorId },
    select: {
      publicId: true,
      name: true,
      phone: true,
      state: true,
      address: true,
      zip: true,
      profilePic: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, role: true, isActive: true } },
    },
  });

  if (!visitor) {
    throw new AdminError(404, 'Visitor not found');
  }

  return visitor;
};

export const listOfficers = async (query: ProfileListQuery) => {
  const where: Prisma.OfficerProfileWhereInput = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search, mode: 'insensitive' } },
          { user: { email: { contains: query.search, mode: 'insensitive' } } },
        ],
      }
    : {};
  const [items, totalItems] = await prisma.$transaction([
    prisma.officerProfile.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        publicId: true,
        medicalAccessLevel: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true, isActive: true } },
        _count: { select: { assignedPrisoners: true } },
      },
    }),
    prisma.officerProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getOfficerDetail = async (officerId: string) => {
  const officer = await prisma.officerProfile.findUnique({
    where: { publicId: officerId },
    select: {
      publicId: true,
      medicalAccessLevel: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, role: true, isActive: true } },
      _count: { select: { assignedPrisoners: true } },
    },
  });

  if (!officer) {
    throw new AdminError(404, 'Officer not found');
  }

  return officer;
};

const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const createOfficer = async (adminUserId: string, input: CreateOfficerInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AdminError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  try {
    return await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(adminUserId, tx))) throw new AdminError(403, 'Permanent Admin access required');
      const publicId = await allocateRolePublicId(tx, Role.OFFICER);
      const user = await tx.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          role: Role.OFFICER,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const officerProfile = await tx.officerProfile.create({
        data: {
          userId: user.id,
          publicId,
          name: input.name,
          phone: input.phone,
        },
        select: {
          publicId: true,
          name: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await recordAudit({ userId: adminUserId, action: ActionType.CREATE, entity: 'OfficerProfile', entityReference: publicId, result: 'SUCCESS', summary: 'Officer account and matching profile created atomically.' }, tx);
      await createNotification({ userId: adminUserId, type: 'ROLE_ACCOUNT_CREATED', title: 'Officer account created', message: `${input.name} (${publicId}) is ready.`, link: `/admin/officers/${publicId}`, dedupeKey: `ROLE_ACCOUNT_CREATED:${publicId}` }, tx);

      return {
        user: {
          accountReference: publicId,
          publicId,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: toIso(user.createdAt),
          updatedAt: toIso(user.updatedAt),
        },
        officerProfile,
      };
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AdminError(409, 'Email already registered');
    }

    throw error;
  }
};

export const updateOfficer = async (
  officerId: string,
  input: UpdateOfficerInput,
) => {
  const officer = await prisma.officerProfile.findUnique({
    where: { publicId: officerId },
    select: { id: true },
  });

  if (!officer) {
    throw new AdminError(404, 'Officer not found');
  }

  return prisma.officerProfile.update({
    where: { publicId: officerId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
    },
    select: {
      publicId: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, role: true, isActive: true } },
    },
  });
};

export const listPrisoners = async (query: ProfileListQuery) => {
  const where: Prisma.PrisonerProfileWhereInput = query.search
    ? {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { gender: { contains: query.search, mode: 'insensitive' } },
          { jailName: { contains: query.search, mode: 'insensitive' } },
          { cellNumber: { contains: query.search, mode: 'insensitive' } },
          { user: { email: { contains: query.search, mode: 'insensitive' } } },
        ],
      }
    : {};
  const [items, totalItems] = await prisma.$transaction([
    prisma.prisonerProfile.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        publicId: true,
        name: true,
        age: true,
        gender: true,
        caseDetails: true,
        admissionDate: true,
        sentencePeriod: true,
        jailType: true,
        jailName: true,
        cellNumber: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true, isActive: true } },
        assignedOfficer: { select: { publicId: true, name: true } },
      },
    }),
    prisma.prisonerProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getPrisonerDetail = async (prisonerId: string) => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { publicId: prisonerId },
    select: {
      publicId: true,
      name: true,
      age: true,
      gender: true,
      caseDetails: true,
      admissionDate: true,
      sentencePeriod: true,
      jailType: true,
      jailName: true,
      cellNumber: true,
      profilePic: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, role: true, isActive: true } },
      assignedOfficer: { select: { publicId: true, name: true } },
    },
  });

  if (!prisoner) {
    throw new AdminError(404, 'Prisoner not found');
  }

  return prisoner;
};

export const createPrisoner = async (adminUserId: string, input: CreatePrisonerInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AdminError(409, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);
  const admissionDate = new Date(input.admissionDate);

  try {
    return await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(adminUserId, tx))) throw new AdminError(403, 'Permanent Admin access required');
      const publicId = await allocateRolePublicId(tx, Role.PRISONER);
      const user = await tx.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          role: Role.PRISONER,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const prisonerProfile = await tx.prisonerProfile.create({
        data: {
          userId: user.id,
          publicId,
          name: input.name,
          age: input.age,
          gender: input.gender,
          admissionDate,
          caseDetails: input.caseDetails,
          sentencePeriod: input.sentencePeriod,
          jailType: input.jailType,
          jailName: input.jailName,
          cellNumber: input.cellNumber,
          profilePic: input.profilePic,
        },
        select: {
          publicId: true,
          name: true,
          age: true,
          gender: true,
          caseDetails: true,
          admissionDate: true,
          sentencePeriod: true,
          jailType: true,
          jailName: true,
          cellNumber: true,
          profilePic: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await recordAudit({ userId: adminUserId, action: ActionType.CREATE, entity: 'PrisonerProfile', entityReference: publicId, result: 'SUCCESS', summary: 'Prisoner account and matching profile created atomically.' }, tx);
      await createNotification({ userId: adminUserId, type: 'ROLE_ACCOUNT_CREATED', title: 'Prisoner account created', message: `${input.name} (${publicId}) is ready.`, link: `/admin/prisoners/${publicId}`, dedupeKey: `ROLE_ACCOUNT_CREATED:${publicId}` }, tx);

      return {
        user: {
          accountReference: publicId,
          publicId,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: toIso(user.createdAt),
          updatedAt: toIso(user.updatedAt),
        },
        prisonerProfile: {
          ...prisonerProfile,
          admissionDate: toIso(prisonerProfile.admissionDate),
          createdAt: toIso(prisonerProfile.createdAt),
          updatedAt: toIso(prisonerProfile.updatedAt),
        },
      };
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AdminError(409, 'Email already registered');
    }

    throw error;
  }
};

export const updatePrisoner = async (
  prisonerId: string,
  input: UpdatePrisonerInput,
) => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { publicId: prisonerId },
    select: { id: true },
  });

  if (!prisoner) {
    throw new AdminError(404, 'Prisoner not found');
  }

  const updatedPrisoner = await prisma.prisonerProfile.update({
    where: { publicId: prisonerId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.age !== undefined ? { age: input.age } : {}),
      ...(input.gender !== undefined ? { gender: input.gender } : {}),
      ...(input.admissionDate !== undefined
        ? { admissionDate: new Date(input.admissionDate) }
        : {}),
      ...(input.caseDetails !== undefined ? { caseDetails: input.caseDetails } : {}),
      ...(input.sentencePeriod !== undefined
        ? { sentencePeriod: input.sentencePeriod }
        : {}),
      ...(input.jailType !== undefined ? { jailType: input.jailType } : {}),
      ...(input.jailName !== undefined ? { jailName: input.jailName } : {}),
      ...(input.cellNumber !== undefined ? { cellNumber: input.cellNumber } : {}),
      ...(input.profilePic !== undefined ? { profilePic: input.profilePic } : {}),
    },
    select: {
      publicId: true,
      name: true,
      age: true,
      gender: true,
      caseDetails: true,
      admissionDate: true,
      sentencePeriod: true,
      jailType: true,
      jailName: true,
      cellNumber: true,
      profilePic: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { email: true, role: true, isActive: true } },
    },
  });

  return {
    ...updatedPrisoner,
    admissionDate: toIso(updatedPrisoner.admissionDate),
    createdAt: toIso(updatedPrisoner.createdAt),
    updatedAt: toIso(updatedPrisoner.updatedAt),
  };
};

export const listAppointments = async (
  query: AppointmentListQuery,
): Promise<PaginatedResult<AdminAppointmentOverview>> => {
  const where: Prisma.AppointmentWhereInput = query.status
    ? { status: query.status }
    : {};
  const [items, totalItems] = await prisma.$transaction([
    prisma.appointment.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        reference: true,
        relationship: true,
        message: true,
        requestedDate: true,
        status: true,
        replyMessage: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
        visitor: {
          select: { publicId: true, name: true },
        },
        prisoner: { select: { publicId: true, name: true } },
        officer: { select: { publicId: true, name: true } },
        visitPass: { select: { status: true, checkedInAt: true, checkedInByOfficer: { select: { publicId: true, name: true } } } },
        changeRequests: { select: { reference: true, status: true, reviewedAt: true }, orderBy: { createdAt: 'desc' } },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      requestedDate: toIso(item.requestedDate),
      reviewedAt: item.reviewedAt ? toIso(item.reviewedAt) : null,
      visitPass: item.visitPass ? { ...item.visitPass, checkedInAt: item.visitPass.checkedInAt ? toIso(item.visitPass.checkedInAt) : null } : null,
      changeRequests: item.changeRequests.map((change) => ({ ...change, reviewedAt: change.reviewedAt ? toIso(change.reviewedAt) : null })),
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
    })),
    pagination: pagination(query.page, query.limit, totalItems),
  };
};

export const listParoleRequests = async (
  query: ParoleListQuery,
): Promise<PaginatedResult<AdminParoleOverview>> => {
  const where: Prisma.ParoleRequestWhereInput = query.status
    ? { status: query.status }
    : {};
  const [items, totalItems] = await prisma.$transaction([
    prisma.paroleRequest.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { createdAt: 'desc' },
      select: {
        reference: true,
        relativeName: true,
        relationship: true,
        purpose: true,
        message: true,
        fromDate: true,
        toDate: true,
        status: true,
        officerReply: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
        prisoner: { select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, name: true } } } },
        officer: { select: { publicId: true, name: true } },
      },
    }),
    prisma.paroleRequest.count({ where }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      fromDate: toIso(item.fromDate),
      toDate: toIso(item.toDate),
      reviewedAt: item.reviewedAt ? toIso(item.reviewedAt) : null,
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
    })),
    pagination: pagination(query.page, query.limit, totalItems),
  };
};
