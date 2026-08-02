import { Router } from 'express';

import { createAdminRule, getAdminRules, getPrisonerRules, getVisitorRules, updateAdminRule } from './jail-rule.controller';
import { validateAdminRuleQuery, validateCreateRule, validateRuleParams, validateUpdateRule } from './jail-rule.schema';

export const registerVisitorJailRuleRoutes = (router: Router): void => {
  router.get('/jail-rules', getVisitorRules);
};

export const registerPrisonerJailRuleRoutes = (router: Router): void => {
  router.get('/jail-rules', getPrisonerRules);
};

export const registerAdminJailRuleRoutes = (router: Router): void => {
  router.get('/jail-rules', validateAdminRuleQuery, getAdminRules);
  router.post('/jail-rules', validateCreateRule, createAdminRule);
  router.patch('/jail-rules/:ruleId', validateRuleParams, validateUpdateRule, updateAdminRule);
};
