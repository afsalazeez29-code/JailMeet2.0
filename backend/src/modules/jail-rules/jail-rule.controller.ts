import { Request, Response } from 'express';

import { JailRuleAudience } from '@prisma/client';

import { createJailRule, JailRuleError, listActiveRules, listAllRules, updateJailRule } from './jail-rule.service';

const handle = (error: unknown, res: Response, fallback: string) => {
  if (error instanceof JailRuleError) return void res.status(error.statusCode).json({ success: false, message: error.message });
  console.error('[JailRuleController]', error);
  res.status(500).json({ success: false, message: fallback });
};

export const getVisitorRules = async (_req: Request, res: Response) => {
  try { res.status(200).json({ success: true, message: 'Jail rules fetched', data: await listActiveRules(JailRuleAudience.VISITOR) }); }
  catch (error) { handle(error, res, 'Failed to fetch jail rules'); }
};

export const getPrisonerRules = async (_req: Request, res: Response) => {
  try { res.status(200).json({ success: true, message: 'Prisoner rules fetched', data: await listActiveRules(JailRuleAudience.PRISONER) }); }
  catch (error) { handle(error, res, 'Failed to fetch Prisoner rules'); }
};

export const getAdminRules = async (_req: Request, res: Response) => {
  try { res.status(200).json({ success: true, message: 'Jail rules fetched', data: await listAllRules(res.locals.validatedQuery.audience) }); }
  catch (error) { handle(error, res, 'Failed to fetch jail rules'); }
};

export const createAdminRule = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try { res.status(201).json({ success: true, message: 'Jail rule created', data: await createJailRule(req.user.id, req.body) }); }
  catch (error) { handle(error, res, 'Failed to create jail rule'); }
};

export const updateAdminRule = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try { res.status(200).json({ success: true, message: 'Jail rule updated', data: await updateJailRule(req.user.id, req.params.ruleId as string, req.body) }); }
  catch (error) { handle(error, res, 'Failed to update jail rule'); }
};
