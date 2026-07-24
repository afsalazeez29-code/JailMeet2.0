import { Role } from '@prisma/client';
import { z } from 'zod';

import {
  changePasswordSchema,
  loginSchema,
  registerVisitorSchema,
} from './auth.schema';

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterVisitorInput = z.infer<typeof registerVisitorSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

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
