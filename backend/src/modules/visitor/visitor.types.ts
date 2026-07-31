import { Role } from '@prisma/client';
import { z } from 'zod';

import { updateVisitorProfileSchema } from './visitor.schema';

export type UpdateVisitorProfileInput = z.infer<
  typeof updateVisitorProfileSchema
>;

export type VisitorProfileResult = {
  user: {
    id: string;
    publicId: string | null;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    profileImageUrl: string | null;
  };
  visitorProfile: {
    publicId: string | null;
    phone: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip: string | null;
    dateOfBirth: string | null;
    gender: string | null;
  };
};
