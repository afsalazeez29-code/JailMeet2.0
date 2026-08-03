import { ActionType, JailRuleAudience, Prisma } from '@prisma/client';

import prisma from '../../config/prisma';
import { getPermanentAdminProfile } from '../../utils/permanent-admin';
import { createNotifications } from '../notifications';
import { createPublicReference } from '../../utils/public-reference';
import { recordAudit } from '../audit';

export class JailRuleError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'JailRuleError';
  }
}

const ruleSelect = {
  reference: true,
  title: true,
  content: true,
  category: true,
  audience: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const mapRule = (rule: {
  reference: string;
  title: string;
  content: string;
  category: string;
  audience: JailRuleAudience;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  ...rule,
  createdAt: rule.createdAt.toISOString(),
  updatedAt: rule.updatedAt.toISOString(),
});

const isPrisonerVisible = (audience: JailRuleAudience, isActive: boolean) =>
  isActive && (
    audience === JailRuleAudience.PRISONER ||
    audience === JailRuleAudience.ALL
  );

const notifyPrisoners = async (
  title: string,
  tx: Prisma.TransactionClient,
) => {
  const recipients = await tx.prisonerProfile.findMany({
    where: { user: { role: 'PRISONER', isActive: true } },
    select: { userId: true },
  });
  await createNotifications(recipients.map(({ userId }) => ({
    userId,
    type: 'PRISONER_RULE_PUBLISHED',
    title: 'New Prisoner instruction available',
    message: `${title} is now available in Jail Rules.`,
    link: '/prisoner/jail-rules',
  })), tx);
};

export const listActiveRules = async (audience: JailRuleAudience) => {
  const rules = await prisma.jailRule.findMany({
    where: {
      isActive: true,
      audience: { in: [audience, JailRuleAudience.ALL] },
    },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: ruleSelect,
  });
  return rules.map(mapRule);
};

export const listAllRules = async (audience?: JailRuleAudience) => {
  const rules = await prisma.jailRule.findMany({
    where: audience ? { audience } : undefined,
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: ruleSelect,
  });
  return rules.map(mapRule);
};

const requirePermanentAdmin = async (userId: string) => {
  if (!(await getPermanentAdminProfile(userId))) {
    throw new JailRuleError(403, 'Permanent Admin access required');
  }
};

type RuleInput = {
  title: string;
  content: string;
  category: string;
  audience: JailRuleAudience;
  sortOrder: number;
  isActive: boolean;
};

export const createJailRule = async (userId: string, input: RuleInput) => {
  await requirePermanentAdmin(userId);
  return prisma.$transaction(async (tx) => {
    const rule = await tx.jailRule.create({ data: { ...input, reference: createPublicReference('RUL') }, select: ruleSelect });
    if (isPrisonerVisible(rule.audience, rule.isActive)) {
      await notifyPrisoners(rule.title, tx);
    }
    await recordAudit({ userId, action: ActionType.CREATE, entity: 'JailRule', entityReference: rule.reference, result: 'SUCCESS', summary: `Jail Rule created for ${rule.audience}; publication state ${rule.isActive ? 'active' : 'inactive'}.` }, tx);
    return mapRule(rule);
  });
};

export const updateJailRule = async (
  userId: string,
  ruleId: string,
  input: Partial<RuleInput>,
) => {
  await requirePermanentAdmin(userId);
  return prisma.$transaction(async (tx) => {
    const existing = await tx.jailRule.findUnique({
      where: { reference: ruleId },
      select: { audience: true, isActive: true },
    });
    if (!existing) throw new JailRuleError(404, 'Jail rule not found');

    const updated = await tx.jailRule.update({
      where: { reference: ruleId },
      data: input,
      select: ruleSelect,
    });
    if (
      !isPrisonerVisible(existing.audience, existing.isActive) &&
      isPrisonerVisible(updated.audience, updated.isActive)
    ) {
      await notifyPrisoners(updated.title, tx);
    }
    await recordAudit({ userId, action: ActionType.UPDATE, entity: 'JailRule', entityReference: updated.reference, result: 'SUCCESS', summary: `Jail Rule updated; publication state ${updated.isActive ? 'active' : 'inactive'}.` }, tx);
    return mapRule(updated);
  });
};
