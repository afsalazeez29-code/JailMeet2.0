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
  isActive: true,
  visitorProfile: {
    select: {
      publicId: true,
      name: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zip: true,
      dateOfBirth: true,
      gender: true,
      profilePic: true,
    },
  },
};

const toVisitorProfileResult = (user: {
  id: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  visitorProfile: {
    publicId: string | null;
    name: string;
    phone: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
    dateOfBirth: Date | null;
    gender: string | null;
    profilePic: string | null;
  } | null;
}): VisitorProfileResult | null => {
  if (!user.visitorProfile) {
    return null;
  }

  return {
    user: {
      id: user.id,
      publicId: user.visitorProfile.publicId,
      name: user.visitorProfile.name,
      email: user.email ?? '',
      role: user.role,
      isActive: user.isActive,
      profileImageUrl: user.visitorProfile.profilePic,
    },
    visitorProfile: {
      publicId: user.visitorProfile.publicId,
      phone: user.visitorProfile.phone,
      address: user.visitorProfile.address,
      city: user.visitorProfile.city,
      state: user.visitorProfile.state,
      country: user.visitorProfile.country,
      zip: user.visitorProfile.zip,
      dateOfBirth: user.visitorProfile.dateOfBirth
        ? user.visitorProfile.dateOfBirth.toISOString().slice(0, 10)
        : null,
      gender: user.visitorProfile.gender,
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
