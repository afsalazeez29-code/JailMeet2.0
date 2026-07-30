import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

import {
  AuthServiceError,
  changePassword as changePasswordService,
  getAuthenticatedUser,
  loginUser,
  registerVisitor,
} from './auth.service';
import {
  changePasswordSchema,
  loginSchema,
  registerVisitorSchema,
} from './auth.schema';

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
    return;
  }

  try {
    const result = await loginUser(parsedBody.data);

    if (!result) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    console.error('[AuthController] Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: [],
    });
    return;
  }

  try {
    const user = await getAuthenticatedUser(req.user.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
        errors: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Authenticated user retrieved successfully',
      data: { user },
    });
  } catch (error) {
    console.error('[AuthController] Me failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve authenticated user',
    });
  }
};

export const registerVisitorController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsedBody = registerVisitorSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid visitor registration data',
    });
    return;
  }

  try {
    const result = await registerVisitor(parsedBody.data);

    if (!result) {
      res.status(409).json({
        success: false,
        message: 'Email or phone already registered',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Visitor registered successfully',
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({
        success: false,
        message: 'Email or phone already registered',
      });
      return;
    }

    console.error('[AuthController] Visitor registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Visitor registration failed',
    });
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      errors: [],
    });
    return;
  }

  const parsedBody = changePasswordSchema.safeParse(req.body);

  if (!parsedBody.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid password-change data',
    });
    return;
  }

  try {
    await changePasswordService(req.user.id, parsedBody.data);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: { changed: true },
    });
  } catch (error) {
    if (error instanceof AuthServiceError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error('[AuthController] Change password failed:', error);
    res.status(500).json({
      success: false,
      message: 'Password change failed',
    });
  }
};
