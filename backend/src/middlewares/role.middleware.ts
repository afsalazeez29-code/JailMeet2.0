import { Role } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export const authorizeRoles =
  (allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
      return;
    }

    next();
  };
