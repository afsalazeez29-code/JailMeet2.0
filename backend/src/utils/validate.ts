import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validateRequest = (
  schema: z.ZodType,
  source: 'body' | 'query' | 'params',
  message: string,
) => (req: Request, res: Response, next: NextFunction): void => {
  const parsed = schema.safeParse(req[source]);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message,
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (source === 'query') {
    res.locals.validatedQuery = parsed.data;
  } else {
    req[source] = parsed.data as never;
  }
  next();
};
