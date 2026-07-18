/**
 * apiResponse.ts — Standardised JSON response helpers.
 * Every controller should use these to keep response shape consistent.
 */

import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
): void => {
  res.status(statusCode).json({
    status: 'ok',
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown,
): void => {
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors !== undefined && { errors }),
  });
};
