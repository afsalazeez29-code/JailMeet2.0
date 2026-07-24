import {
  AppointmentStatus,
  ParoleStatus,
  Prisma,
  Role,
} from '@prisma/client';
import bcrypt from 'bcrypt';

import prisma from '../../config/prisma';
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

const toIso = (date: Date): string => date.toISOString();

const pagination = (page: number, limit: number, totalItems: number) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
});

const getProfileName = (user: {
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string } | null;
  visitorProfile?: { name: string } | null;
  prisonerProfile?: { name: string } | null;
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
  officerProfile: { select: { name: true } },
  visitorProfile: { select: { name: true } },
  prisonerProfile: { select: { name: true } },
};

const toSafeUser = (user: {
  id: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string } | null;
  visitorProfile?: { name: string } | null;
  prisonerProfile?: { name: string } | null;
}): SafeAdminUser => ({
  id: user.id,
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
    { prisonerProfile: { name: { contains: search, mode: 'insensitive' } } },
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...safeUserSelect,
      adminProfile: {
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      },
      officerProfile: {
        select: { id: true, name: true, phone: true, createdAt: true, updatedAt: true },
      },
      visitorProfile: {
        select: {
          id: true,
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
          id: true,
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
  if (adminUserId === targetUserId && input.isActive === false) {
    throw new AdminError(400, 'Admins cannot deactivate their own account');
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, isActive: true },
  });

  if (!target) {
    throw new AdminError(404, 'User not found');
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
      throw new AdminError(400, 'Cannot deactivate the last active admin');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { isActive: input.isActive },
    select: safeUserSelect,
  });

  return toSafeUser(updatedUser);
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
        id: true,
        name: true,
        phone: true,
        state: true,
        address: true,
        zip: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, isActive: true } },
      },
    }),
    prisma.visitorProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getVisitorDetail = async (visitorId: string) => {
  const visitor = await prisma.visitorProfile.findUnique({
    where: { id: visitorId },
    select: {
      id: true,
      name: true,
      phone: true,
      state: true,
      address: true,
      zip: true,
      profilePic: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, email: true, role: true, isActive: true } },
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
        id: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, email: true, isActive: true } },
      },
    }),
    prisma.officerProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getOfficerDetail = async (officerId: string) => {
  const officer = await prisma.officerProfile.findUnique({
    where: { id: officerId },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, email: true, role: true, isActive: true } },
    },
  });

  if (!officer) {
    throw new AdminError(404, 'Officer not found');
  }

  return officer;
};

const isUniqueConstraintError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const createOfficer = async (input: CreateOfficerInput) => {
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
          name: input.name,
          phone: input.phone,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        user: {
          ...user,
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
    where: { id: officerId },
    select: { id: true },
  });

  if (!officer) {
    throw new AdminError(404, 'Officer not found');
  }

  return prisma.officerProfile.update({
    where: { id: officerId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { id: true, email: true, role: true, isActive: true } },
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
        id: true,
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
        user: { select: { id: true, email: true, isActive: true } },
      },
    }),
    prisma.prisonerProfile.count({ where }),
  ]);

  return profilePagination(query.page, query.limit, totalItems, items);
};

export const getPrisonerDetail = async (prisonerId: string) => {
  const prisoner = await prisma.prisonerProfile.findUnique({
    where: { id: prisonerId },
    select: {
      id: true,
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
      user: { select: { id: true, email: true, role: true, isActive: true } },
    },
  });

  if (!prisoner) {
    throw new AdminError(404, 'Prisoner not found');
  }

  return prisoner;
};

export const createPrisoner = async (input: CreatePrisonerInput) => {
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
          id: true,
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

      return {
        user: {
          ...user,
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
    where: { id: prisonerId },
    select: { id: true },
  });

  if (!prisoner) {
    throw new AdminError(404, 'Prisoner not found');
  }

  const updatedPrisoner = await prisma.prisonerProfile.update({
    where: { id: prisonerId },
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
      id: true,
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
      user: { select: { id: true, email: true, role: true, isActive: true } },
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
        id: true,
        relationship: true,
        message: true,
        requestedDate: true,
        status: true,
        replyMessage: true,
        createdAt: true,
        updatedAt: true,
        visitor: { select: { id: true, name: true, phone: true } },
        prisoner: { select: { id: true, name: true } },
        officer: { select: { id: true, name: true } },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      requestedDate: toIso(item.requestedDate),
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
        id: true,
        relativeName: true,
        relationship: true,
        purpose: true,
        message: true,
        fromDate: true,
        toDate: true,
        status: true,
        officerReply: true,
        createdAt: true,
        updatedAt: true,
        prisoner: { select: { id: true, name: true } },
        officer: { select: { id: true, name: true } },
      },
    }),
    prisma.paroleRequest.count({ where }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      fromDate: toIso(item.fromDate),
      toDate: toIso(item.toDate),
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
    })),
    pagination: pagination(query.page, query.limit, totalItems),
  };
};
