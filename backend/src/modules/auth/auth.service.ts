import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ActionType, Role } from '@prisma/client';

import config from '../../config';
import prisma from '../../config/prisma';
import { allocateRolePublicId } from '../../utils/role-public-id';
import {
  AuthUser,
  AuthUserPayload,
  ChangePasswordInput,
  LoginInput,
  RegisterVisitorInput,
  VisitorRegistrationResult,
} from './auth.types';
import { recordAudit } from '../audit';

const userSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  adminProfile: { select: { name: true, profilePic: true } },
  officerProfile: { select: { name: true, publicId: true, profilePic: true } },
  visitorProfile: {
    select: { name: true, publicId: true, profilePic: true },
  },
  prisonerProfile: {
    select: { name: true, publicId: true, profilePic: true },
  },
};

const getProfileName = (user: {
  adminProfile?: { name: string; profilePic: string | null } | null;
  officerProfile?: { name: string; publicId: string | null; profilePic: string | null } | null;
  visitorProfile?: {
    name: string;
    publicId: string | null;
    profilePic: string | null;
  } | null;
  prisonerProfile?: {
    name: string;
    publicId: string | null;
    profilePic: string | null;
  } | null;
}): string =>
  user.adminProfile?.name ??
  user.officerProfile?.name ??
  user.visitorProfile?.name ??
  user.prisonerProfile?.name ??
  '';

const toAuthUser = (user: {
  id: string;
  email: string | null;
  role: Role;
  adminProfile?: { name: string; profilePic: string | null } | null;
  officerProfile?: { name: string; publicId: string | null; profilePic: string | null } | null;
  visitorProfile?: {
    name: string;
    publicId: string | null;
    profilePic: string | null;
  } | null;
  prisonerProfile?: {
    name: string;
    publicId: string | null;
    profilePic: string | null;
  } | null;
}): AuthUser => ({
  publicId:
    user.officerProfile?.publicId ??
    user.visitorProfile?.publicId ??
    user.prisonerProfile?.publicId ??
    null,
  name: getProfileName(user),
  email: user.email ?? '',
  role: user.role,
  profileImageUrl:
    user.adminProfile?.profilePic ??
    user.officerProfile?.profilePic ??
    user.visitorProfile?.profilePic ??
    user.prisonerProfile?.profilePic ??
    null,
});

const createAccessToken = (userId: string, user: AuthUser): string => {
  const payload: AuthUserPayload = {
    id: userId,
    email: user.email,
    role: user.role,
  };
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwtSecret, options);
};

export const loginUser = async (
  input: LoginInput,
): Promise<{ user: AuthUser; accessToken: string } | null> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: userSelect,
  });

  if (!user || !user.isActive) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (
    !passwordMatches ||
    (input.expectedRole !== undefined && user.role !== input.expectedRole)
  ) {
    return null;
  }

  const authUser = toAuthUser(user);
  const accessToken = createAccessToken(user.id, authUser);

  return { user: authUser, accessToken };
};

export const getAuthenticatedUser = async (
  userId: string,
): Promise<AuthUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user || !user.isActive) {
    return null;
  }

  return toAuthUser(user);
};

export const registerVisitor = async (
  input: RegisterVisitorInput,
): Promise<VisitorRegistrationResult | null> => {
  const [existingUser, existingPhone] = await Promise.all([
    prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    }),
    prisma.visitorProfile.findFirst({
      where: { phone: input.phone },
      select: { id: true },
    }),
  ]);

  if (existingUser || existingPhone) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const registration = await prisma.$transaction(async (tx) => {
        const publicId = await allocateRolePublicId(tx, Role.VISITOR);
        const user = await tx.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            role: Role.VISITOR,
          },
          select: {
            id: true,
            email: true,
            role: true,
          },
        });

        const createdVisitorProfile = await tx.visitorProfile.create({
          data: {
            publicId,
            userId: user.id,
            name: input.name,
            phone: input.phone,
            address: input.address,
            state: input.state,
            zip: input.zip,
          },
          select: {
            id: true,
            publicId: true,
            name: true,
            phone: true,
            address: true,
            state: true,
            zip: true,
          },
        });

        const visitorProfile = {
          ...createdVisitorProfile,
          publicId,
        };

        const authUser: AuthUser = {
            publicId: visitorProfile.publicId,
            name: visitorProfile.name,
            email: user.email ?? '',
            role: user.role,
            profileImageUrl: null,
        };

        return {
          user: authUser,
          accessToken: createAccessToken(user.id, authUser),
          visitorProfile,
        };
      });

  return registration;
};

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'AuthServiceError';
    this.statusCode = statusCode;
  }
}

export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      password: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AuthServiceError(404, 'User not found');
  }

  if (!user.isActive) {
    throw new AuthServiceError(403, 'Account is inactive');
  }

  const currentPasswordMatches = await bcrypt.compare(
    input.currentPassword,
    user.password,
  );

  if (!currentPasswordMatches) {
    throw new AuthServiceError(400, 'Current password is incorrect');
  }

  const newPasswordMatchesCurrent = await bcrypt.compare(
    input.newPassword,
    user.password,
  );

  if (newPasswordMatchesCurrent) {
    throw new AuthServiceError(
      400,
      'New password must be different from the current password',
    );
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, passwordChangedAt: new Date() },
    });
    await recordAudit({ userId: user.id, action: ActionType.UPDATE, entity: 'UserPassword', entityReference: 'SELF', result: 'SUCCESS', summary: 'Password changed successfully.' }, tx);
  });
};
