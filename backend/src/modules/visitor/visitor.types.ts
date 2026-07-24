import { Role } from '@prisma/client';
import { z } from 'zod';

import { updateVisitorProfileSchema } from './visitor.schema';

export type UpdateVisitorProfileInput = z.infer<
  typeof updateVisitorProfileSchema
>;

export type VisitorProfileResult = {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  visitorProfile: {
    phone: string;
    address: string | null;
    state: string | null;
    zip: string | null;
  };
};