import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

import config from '../../config';
import prisma from '../../config/prisma';
import {
  generateUniqueVisitorPublicId,
  isVisitorPublicIdCollision,
  VISITOR_PUBLIC_ID_MAX_ATTEMPTS,
  VisitorPublicIdGenerationError,
} from '../../utils/visitor-public-id';
import {
  AuthUser,
  AuthUserPayload,
  ChangePasswordInput,
  LoginInput,
  RegisterVisitorInput,
  VisitorRegistrationResult,
} from './auth.types';

const userSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  isActive: true,
  adminProfile: { select: { name: true } },
  officerProfile: { select: { name: true } },
  visitorProfile: {
    select: { name: true, publicId: true, profilePic: true },
  },
  prisonerProfile: {
    select: { name: true, publicId: true, profilePic: true },
  },
};

const getProfileName = (user: {
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string } | null;
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
  adminProfile?: { name: string } | null;
  officerProfile?: { name: string } | null;
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
  id: user.id,
  publicId:
    user.visitorProfile?.publicId ?? user.prisonerProfile?.publicId ?? null,
  name: getProfileName(user),
  email: user.email ?? '',
  role: user.role,
  profileImageUrl:
    user.visitorProfile?.profilePic ?? user.prisonerProfile?.profilePic ?? null,
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

  if (
    !passwordMatches ||
    (input.expectedRole !== undefined && user.role !== input.expectedRole)
  ) {
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

  let registration: Omit<VisitorRegistrationResult, 'accessToken'> | null =
    null;

  for (
    let attempt = 0;
    attempt < VISITOR_PUBLIC_ID_MAX_ATTEMPTS;
    attempt += 1
  ) {
    try {
      registration = await prisma.$transaction(async (tx) => {
        const publicId = await generateUniqueVisitorPublicId(tx);
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

        return {
          user: {
            id: user.id,
            publicId: visitorProfile.publicId,
            name: visitorProfile.name,
            email: user.email ?? '',
            role: user.role,
            profileImageUrl: null,
          },
          visitorProfile,
        };
      });
      break;
    } catch (error) {
      if (isVisitorPublicIdCollision(error)) continue;
      throw error;
    }
  }

  if (!registration) throw new VisitorPublicIdGenerationError();

  return {
    ...registration,
    accessToken: createAccessToken(registration.user),
  };
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
