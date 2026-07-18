import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 * Catches errors passed via next(err) from any route.
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(`[ErrorHandler] ${err.message}`);

  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
