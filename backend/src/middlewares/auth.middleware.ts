import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import prisma from '../config/prisma';
import { AuthUserPayload } from '../modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: [],
    });
    return;
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'string' ||
      typeof decoded.role !== 'string'
    ) {
      throw new Error('Invalid authentication payload');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive || user.role !== decoded.role) {
      throw new Error('Authentication context is no longer valid');
    }

    req.user = {
      id: user.id,
      email: user.email ?? '',
      role: user.role,
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: [],
    });
  }
};
