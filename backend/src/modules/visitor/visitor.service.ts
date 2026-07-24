import { Role } from '@prisma/client';

import prisma from '../../config/prisma';
import {
  UpdateVisitorProfileInput,
  VisitorProfileResult,
} from './visitor.types';

const visitorProfileSelect = {
  id: true,
  email: true,
  role: true,
  visitorProfile: {
    select: {
      name: true,
      phone: true,
      address: true,
      state: true,
      zip: true,
    },
  },
};

const toVisitorProfileResult = (user: {
  id: string;
  email: string | null;
  role: Role;
  visitorProfile: {
    name: string;
    phone: string;
    address: string | null;
    state: string | null;
    zip: string | null;
  } | null;
}): VisitorProfileResult | null => {
  if (!user.visitorProfile) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: user.visitorProfile.name,
      email: user.email ?? '',
      role: user.role,
    },
    visitorProfile: {
      phone: user.visitorProfile.phone,
      address: user.visitorProfile.address,
      state: user.visitorProfile.state,
      zip: user.visitorProfile.zip,
    },
  };
};

export const getVisitorProfile = async (
  userId: string,
): Promise<VisitorProfileResult | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: visitorProfileSelect,
  });

  if (!user) {
    return null;
  }

  return toVisitorProfileResult(user);
};

export const updateVisitorProfile = async (
  userId: string,
  input: UpdateVisitorProfileInput,
): Promise<VisitorProfileResult | null> => {
  const existingProfile = await prisma.visitorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!existingProfile) {
    return null;
  }

  await prisma.visitorProfile.update({
    where: { userId },
    data: input,
  });

  return getVisitorProfile(userId);
};
