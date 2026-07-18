import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

import config from '../../config';
import prisma from '../../config/prisma';
import {
  ChangePasswordInput,
  LoginInput,
  RegisterVisitorInput,
} from './auth.validation';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthUserPayload = {
  id: string;
  email: string;
  role: Role;
};

export type VisitorRegistrationResult = {
  user: AuthUser;
  visitorProfile: {
    id: string;
    name: string;
    phone: string;
    address: string | null;
    state: string | null;
    zip: string | null;
  };
};

const userSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  adminProfile: { select: { name: true } },
  officerProfile: { select: { name: true } },
  visitorProfile: { select: { name: true } },
  prisonerProfile: { select: { name: true } },
};

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

const toAuthUser = (user: {
  id: string;
  email: string | null;
  role: Role;
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string } | null;
  visitorProfile?: { name: string } | null;
  prisonerProfile?: { name: string } | null;
}): AuthUser => ({
  id: user.id,
  name: getProfileName(user),
  email: user.email ?? '',
  role: user.role,
});

const createAccessToken = (user: AuthUser): string => {
  const payload: AuthUserPayload = {
    id: user.id,
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

  if (!passwordMatches) {
    return null;
  }

  const authUser = toAuthUser(user);
  const accessToken = createAccessToken(authUser);

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
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  return prisma.$transaction(async (tx) => {
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

    const visitorProfile = await tx.visitorProfile.create({
      data: {
        userId: user.id,
        name: input.name,
        phone: input.phone,
        address: input.address,
        state: input.state,
        zip: input.zip,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        state: true,
        zip: true,
      },
    });

    return {
      user: {
        id: user.id,
        name: visitorProfile.name,
        email: user.email ?? '',
        role: user.role,
      },
      visitorProfile,
    };
  });
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

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};
