import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found handler.
 * Placed after all routes so it catches any unmatched request.
 */
const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
};

export default notFound;
