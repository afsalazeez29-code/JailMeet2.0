import { JailRuleAudience } from '@prisma/client';
import { z } from 'zod';

import { validateRequest } from '../../utils/validate';

const ruleFields = {
  title: z.string().trim().min(3).max(120),
  content: z.string().trim().min(10).max(3000),
  category: z.string().trim().min(2).max(80),
  audience: z.nativeEnum(JailRuleAudience),
  sortOrder: z.number().int().min(0).max(10000),
  isActive: z.boolean(),
};

export const createRuleSchema = z.object({
  ...ruleFields,
  sortOrder: ruleFields.sortOrder.default(0),
  isActive: ruleFields.isActive.default(true),
}).strict();

export const updateRuleSchema = z.object({
  title: ruleFields.title.optional(),
  content: ruleFields.content.optional(),
  category: ruleFields.category.optional(),
  audience: ruleFields.audience.optional(),
  sortOrder: ruleFields.sortOrder.optional(),
  isActive: ruleFields.isActive.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const ruleParamsSchema = z.object({ ruleId: z.string().uuid() });
export const adminRuleQuerySchema = z.object({
  audience: z.nativeEnum(JailRuleAudience).optional(),
}).strict();

export const validateCreateRule = validateRequest(createRuleSchema, 'body', 'Invalid jail rule');
export const validateUpdateRule = validateRequest(updateRuleSchema, 'body', 'Invalid jail rule');
export const validateRuleParams = validateRequest(ruleParamsSchema, 'params', 'Invalid jail rule ID');
export const validateAdminRuleQuery = validateRequest(adminRuleQuerySchema, 'query', 'Invalid jail rule filters');
