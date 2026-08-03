import {
  ActionType,
  AppointmentChangeRequestStatus,
  AppointmentStatus,
  FirStatus,
  MedicalTreatmentStatus,
  ParoleStatus,
  Prisma,
  Role,
  SupportRequestStatus,
  VisitPassStatus,
} from '@prisma/client';

import prisma from '../../config/prisma';
import { AuditResult } from '../../constants/audit-results';
import { DomainError } from '../../utils/domain-error';
import { getPermanentAdminProfile, getPermanentAdminRecipient } from '../../utils/permanent-admin';
import { createPublicReference } from '../../utils/public-reference';
import { allocateRolePublicId } from '../../utils/role-public-id';
import { recordAudit } from '../audit';
import { createNotification, createNotifications } from '../notifications';

const pageInfo = (page: number, limit: number, totalItems: number) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.max(1, Math.ceil(totalItems / limit)),
});

const requirePermanentAdmin = async (userId: string, tx: Prisma.TransactionClient = prisma) => {
  const profile = await getPermanentAdminProfile(userId, tx);
  if (!profile) throw new DomainError(403, 'Permanent Admin access required');
  return profile;
};

const actorIdentity = (user: {
  email: string | null;
  role: Role;
  adminProfile: { name: string } | null;
  officerProfile: { name: string; publicId: string | null } | null;
  visitorProfile: { name: string; publicId: string | null } | null;
  prisonerProfile: { name: string; publicId: string | null } | null;
}) => {
  const profile = user.adminProfile ?? user.officerProfile ?? user.visitorProfile ?? user.prisonerProfile;
  const publicId = user.officerProfile?.publicId ?? user.visitorProfile?.publicId ?? user.prisonerProfile?.publicId ?? null;
  return { name: profile?.name ?? 'Unknown user', email: user.email, role: user.role, publicId };
};

export const getAdminProfile = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, role: Role.ADMIN },
    select: {
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      passwordChangedAt: true,
      adminProfile: { select: { name: true, profilePic: true } },
      auditLogs: {
        orderBy: { createdAt: 'desc' },
        take: 8,
        select: { action: true, entity: true, entityReference: true, result: true, details: true, createdAt: true },
      },
    },
  });
  if (!user?.adminProfile) throw new DomainError(404, 'Admin profile not found');
  return {
    name: user.adminProfile.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    profileImageUrl: user.adminProfile.profilePic,
    createdAt: user.createdAt.toISOString(),
    passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,
    recentActivity: user.auditLogs.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
  };
};

type IntegrityIssue = {
  key: string;
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  identity: string;
  role?: Role;
  summary: string;
  repairTypes: string[];
};

export const scanIntegrity = async () => {
  const [users, officers, visitors, prisoners, supportMissing, prisonerSupportMissing, rulesMissing] = await prisma.$transaction([
    prisma.user.findMany({
      select: {
        email: true, role: true, isActive: true,
        adminProfile: { select: { name: true } },
        officerProfile: { select: { name: true, publicId: true, profilePic: true, profileImagePublicId: true } },
        visitorProfile: { select: { name: true, publicId: true, profilePic: true, profileImagePublicId: true } },
        prisonerProfile: { select: { name: true, publicId: true, profilePic: true, profileImagePublicId: true } },
      },
    }),
    prisma.officerProfile.findMany({ select: { publicId: true, name: true, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.visitorProfile.findMany({ select: { publicId: true, name: true, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.prisonerProfile.findMany({ select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, user: { select: { role: true, isActive: true } } } }, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.supportRequest.count({ where: { reference: { equals: '' } } }),
    prisma.prisonerSupportRequest.count({ where: { reference: { equals: '' } } }),
    prisma.jailRule.count({ where: { reference: { equals: '' } } }),
  ]);

  const issues: IntegrityIssue[] = [];
  for (const user of users) {
    const profile = user.role === Role.ADMIN ? user.adminProfile : user.role === Role.OFFICER ? user.officerProfile : user.role === Role.VISITOR ? user.visitorProfile : user.prisonerProfile;
    const identity = profile?.name ?? user.email ?? `${user.role} login`;
    if (!profile) issues.push({ key: `MISSING_PROFILE:${user.role}:${user.email ?? 'NO_EMAIL'}`, type: 'MISSING_ROLE_PROFILE', severity: 'HIGH', identity, role: user.role, summary: `Active status: ${user.isActive ? 'active' : 'inactive'}; matching profile is missing.`, repairTypes: ['DEACTIVATE_ORPHAN_LOGIN'] });
    const profiles = [user.adminProfile, user.officerProfile, user.visitorProfile, user.prisonerProfile].filter(Boolean);
    if (profiles.length > 1) issues.push({ key: `MULTIPLE_PROFILE:${user.email ?? identity}`, type: 'BROKEN_ROLE_RELATION', severity: 'HIGH', identity, role: user.role, summary: 'More than one role profile is linked to this login.', repairTypes: [] });
    const roleProfile = user.officerProfile ?? user.visitorProfile ?? user.prisonerProfile;
    if (roleProfile && !roleProfile.publicId) issues.push({ key: `MISSING_PUBLIC_ID:${user.role}:${user.email ?? identity}`, type: 'MISSING_PUBLIC_ID', severity: 'HIGH', identity, role: user.role, summary: 'A valid role profile has no public ID.', repairTypes: [`GENERATE_${user.role}_PUBLIC_ID`] });
    if (roleProfile && (!roleProfile.profilePic || !roleProfile.profileImagePublicId)) issues.push({ key: `IMAGE_METADATA:${user.role}:${user.email ?? identity}`, type: 'INCOMPLETE_IMAGE_METADATA', severity: 'MEDIUM', identity, role: user.role, summary: 'Profile image URL or provider identifier is missing. No image is fabricated by repair.', repairTypes: [] });
  }

  const checkRole = (type: string, prefix: string, items: Array<{ publicId: string | null; name: string; user: { email: string | null; role: Role } }>, expected: Role) => {
    const seen = new Set<string>();
    for (const item of items) {
      const identity = item.publicId ?? item.name ?? item.user.email ?? expected;
      if (item.user.role !== expected) issues.push({ key: `ROLE_MISMATCH:${type}:${identity}`, type: 'ROLE_PROFILE_MISMATCH', severity: 'HIGH', identity, role: item.user.role, summary: `${type} is linked to a ${item.user.role} login.`, repairTypes: [] });
      if (item.publicId && !new RegExp(`^${prefix}-\\d+$`).test(item.publicId)) issues.push({ key: `INVALID_ID:${item.publicId}`, type: 'INVALID_PUBLIC_ID', severity: 'HIGH', identity, role: expected, summary: `Public ID does not use the required ${prefix}-number format.`, repairTypes: [] });
      if (item.publicId && seen.has(item.publicId)) issues.push({ key: `DUPLICATE_ID:${item.publicId}`, type: 'DUPLICATE_PUBLIC_ID', severity: 'HIGH', identity, role: expected, summary: 'Duplicate public ID detected.', repairTypes: [] });
      if (item.publicId) seen.add(item.publicId);
    }
  };
  checkRole('OfficerProfile', 'OFR', officers, Role.OFFICER);
  checkRole('VisitorProfile', 'VIS', visitors, Role.VISITOR);
  checkRole('PrisonerProfile', 'PRN', prisoners, Role.PRISONER);

  for (const prisoner of prisoners) {
    const identity = prisoner.publicId ?? prisoner.name;
    if (!prisoner.assignedOfficer) issues.push({ key: `UNASSIGNED:${identity}`, type: 'UNASSIGNED_PRISONER', severity: 'MEDIUM', identity, role: Role.PRISONER, summary: 'No active Officer assignment is present.', repairTypes: ['REASSIGN_PRISONER'] });
    else if (prisoner.assignedOfficer.user.role !== Role.OFFICER || !prisoner.assignedOfficer.user.isActive || !prisoner.assignedOfficer.publicId) issues.push({ key: `INVALID_ASSIGNMENT:${identity}`, type: 'INVALID_OFFICER_ASSIGNMENT', severity: 'HIGH', identity, role: Role.PRISONER, summary: 'Assigned Officer is inactive, has the wrong role, or lacks a usable public ID.', repairTypes: ['REMOVE_INVALID_ASSIGNMENT', 'REASSIGN_PRISONER'] });
  }
  if (supportMissing + prisonerSupportMissing + rulesMissing > 0) issues.push({ key: 'MISSING_OPERATIONAL_REFERENCES', type: 'MISSING_OPERATIONAL_REFERENCE', severity: 'HIGH', identity: 'Workflow records', summary: `${supportMissing + prisonerSupportMissing + rulesMissing} records lack public references.`, repairTypes: [] });
  return { scannedAt: new Date().toISOString(), counts: { total: issues.length, high: issues.filter((i) => i.severity === 'HIGH').length, medium: issues.filter((i) => i.severity === 'MEDIUM').length, low: issues.filter((i) => i.severity === 'LOW').length }, issues, migration: { expected: '20260803070000_complete_admin_operations', deploymentRequired: true } };
};

type RepairInput = {
  repairType: 'GENERATE_VISITOR_PUBLIC_ID' | 'GENERATE_OFFICER_PUBLIC_ID' | 'GENERATE_PRISONER_PUBLIC_ID' | 'DEACTIVATE_ORPHAN_LOGIN' | 'REMOVE_INVALID_ASSIGNMENT' | 'REASSIGN_PRISONER';
  reason: string;
  confirmation: string;
  email?: string;
  prisonerPublicId?: string;
  officerPublicId?: string;
};

export const previewRepair = async (userId: string, input: RepairInput) => {
  await requirePermanentAdmin(userId);
  const confirmation = `APPLY ${input.repairType}`;
  const affected = input.email ?? input.prisonerPublicId ?? 'No target supplied';
  return { repairType: input.repairType, identity: affected, proposedAction: input.repairType.replaceAll('_', ' ').toLowerCase(), requiredFields: input.repairType === 'REASSIGN_PRISONER' ? ['prisonerPublicId', 'officerPublicId', 'reason', 'confirmation'] : input.repairType.startsWith('GENERATE_') || input.repairType === 'DEACTIVATE_ORPHAN_LOGIN' ? ['email', 'reason', 'confirmation'] : ['prisonerPublicId', 'reason', 'confirmation'], recordsAffected: 1, reversible: input.repairType === 'DEACTIVATE_ORPHAN_LOGIN' || input.repairType.includes('ASSIGNMENT'), riskWarning: 'The current condition is revalidated atomically before any write.', confirmation };
};

export const applyRepair = async (userId: string, input: RepairInput) => {
  if (input.confirmation !== `APPLY ${input.repairType}`) throw new DomainError(422, 'Repair confirmation does not match');
  return prisma.$transaction(async (tx) => {
    await requirePermanentAdmin(userId, tx);
    let identity = input.email ?? input.prisonerPublicId ?? 'Unknown target';
    let outcome = '';
    if (input.repairType.startsWith('GENERATE_')) {
      if (!input.email) throw new DomainError(422, 'Email is required for this repair');
      const role = input.repairType.includes('VISITOR') ? Role.VISITOR : input.repairType.includes('OFFICER') ? Role.OFFICER : Role.PRISONER;
      const user = await tx.user.findUnique({ where: { email: input.email }, select: { role: true, visitorProfile: { select: { publicId: true } }, officerProfile: { select: { publicId: true } }, prisonerProfile: { select: { publicId: true } } } });
      const profile = role === Role.VISITOR ? user?.visitorProfile : role === Role.OFFICER ? user?.officerProfile : user?.prisonerProfile;
      if (!user || user.role !== role || !profile || profile.publicId) throw new DomainError(409, 'The missing public-ID issue is no longer present');
      const publicId = await allocateRolePublicId(tx, role);
      if (role === Role.VISITOR) await tx.visitorProfile.update({ where: { userId: (await tx.user.findUniqueOrThrow({ where: { email: input.email }, select: { id: true } })).id }, data: { publicId } });
      else if (role === Role.OFFICER) await tx.officerProfile.update({ where: { userId: (await tx.user.findUniqueOrThrow({ where: { email: input.email }, select: { id: true } })).id }, data: { publicId } });
      else await tx.prisonerProfile.update({ where: { userId: (await tx.user.findUniqueOrThrow({ where: { email: input.email }, select: { id: true } })).id }, data: { publicId } });
      identity = publicId;
      outcome = `${role} public ID generated.`;
    } else if (input.repairType === 'DEACTIVATE_ORPHAN_LOGIN') {
      if (!input.email) throw new DomainError(422, 'Email is required for this repair');
      const user = await tx.user.findUnique({ where: { email: input.email }, select: { id: true, role: true, isActive: true, adminProfile: true, officerProfile: true, visitorProfile: true, prisonerProfile: true } });
      if (!user || !user.isActive || user.role === Role.ADMIN || user.adminProfile || user.officerProfile || user.visitorProfile || user.prisonerProfile) throw new DomainError(409, 'The orphan-login issue is no longer present');
      await tx.user.update({ where: { id: user.id }, data: { isActive: false } });
      outcome = 'Orphan login deactivated; no profile was created or deleted.';
    } else {
      if (!input.prisonerPublicId) throw new DomainError(422, 'Prisoner public ID is required');
      const prisoner = await tx.prisonerProfile.findUnique({ where: { publicId: input.prisonerPublicId }, select: { id: true, assignedOfficer: { select: { id: true, publicId: true, user: { select: { role: true, isActive: true } } } } } });
      if (!prisoner) throw new DomainError(404, 'Prisoner not found');
      if (input.repairType === 'REMOVE_INVALID_ASSIGNMENT') {
        if (!prisoner.assignedOfficer || (prisoner.assignedOfficer.user.role === Role.OFFICER && prisoner.assignedOfficer.user.isActive && prisoner.assignedOfficer.publicId)) throw new DomainError(409, 'The invalid assignment is no longer present');
        await tx.prisonerProfile.update({ where: { id: prisoner.id }, data: { assignedOfficerId: null } });
        outcome = 'Invalid assignment removed; Prisoner preserved.';
      } else {
        if (!input.officerPublicId) throw new DomainError(422, 'Officer public ID is required');
        const officer = await tx.officerProfile.findFirst({ where: { publicId: input.officerPublicId, user: { role: Role.OFFICER, isActive: true } }, select: { id: true } });
        if (!officer) throw new DomainError(409, 'Selected Officer is not active and eligible');
        await tx.prisonerProfile.update({ where: { id: prisoner.id }, data: { assignedOfficerId: officer.id } });
        outcome = `Prisoner assigned to ${input.officerPublicId}.`;
      }
    }
    await recordAudit({ userId, action: ActionType.UPDATE, entity: 'SystemIntegrityRepair', entityReference: identity, result: 'SUCCESS', summary: `${outcome} Reason recorded.` }, tx);
    await createNotification({ userId, type: 'INTEGRITY_REPAIR_APPLIED', title: 'Integrity repair applied', message: outcome, link: '/admin/system-integrity', dedupeKey: `INTEGRITY_REPAIR:${input.repairType}:${identity}` }, tx);
    return { repairType: input.repairType, identity, outcome };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
};

export const searchAdmin = async (q: string, page: number, limit: number) => {
  const contains = { contains: q, mode: Prisma.QueryMode.insensitive };
  const [visitors, officers, prisoners, appointments, paroles, changes, passes, firs, medical, visitorSupport, prisonerSupport, rules] = await prisma.$transaction([
    prisma.visitorProfile.findMany({ where: { OR: [{ publicId: contains }, { name: contains }, { user: { email: contains } }] }, take: limit, select: { publicId: true, name: true, profilePic: true, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.officerProfile.findMany({ where: { OR: [{ publicId: contains }, { name: contains }, { user: { email: contains } }] }, take: limit, select: { publicId: true, name: true, profilePic: true, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.prisonerProfile.findMany({ where: { OR: [{ publicId: contains }, { name: contains }, { user: { email: contains } }] }, take: limit, select: { publicId: true, name: true, profilePic: true, user: { select: { email: true, role: true, isActive: true } } } }),
    prisma.appointment.findMany({ where: { reference: contains }, take: limit, select: { reference: true, status: true, visitor: { select: { publicId: true, name: true } }, prisoner: { select: { publicId: true, name: true } } } }),
    prisma.paroleRequest.findMany({ where: { reference: contains }, take: limit, select: { reference: true, status: true, prisoner: { select: { publicId: true, name: true } } } }),
    prisma.appointmentChangeRequest.findMany({ where: { reference: contains }, take: limit, select: { reference: true, status: true } }),
    prisma.visitPass.findMany({ where: { passCode: { equals: q, mode: Prisma.QueryMode.insensitive } }, take: 1, select: { passCode: true, status: true, appointment: { select: { reference: true, visitor: { select: { publicId: true, name: true } }, prisoner: { select: { publicId: true, name: true } } } } } }),
    prisma.firRecord.findMany({ where: { OR: [{ reference: contains }, { firNumber: contains }] }, take: limit, select: { reference: true, firNumber: true, status: true, prisoner: { select: { publicId: true, name: true } } } }),
    prisma.medicalRecord.findMany({ where: { reference: contains }, take: limit, select: { reference: true, treatmentStatus: true, prisoner: { select: { publicId: true, name: true } } } }),
    prisma.supportRequest.findMany({ where: { reference: contains }, take: limit, select: { reference: true, subject: true, status: true } }),
    prisma.prisonerSupportRequest.findMany({ where: { reference: contains }, take: limit, select: { reference: true, subject: true, status: true } }),
    prisma.jailRule.findMany({ where: { OR: [{ reference: contains }, { title: contains }] }, take: limit, select: { reference: true, title: true, isActive: true } }),
  ]);
  const profileResults = (type: string, base: string, items: Array<{ publicId: string | null; name: string; profilePic: string | null; user: { email: string | null; role: Role; isActive: boolean } }>) => items.filter((i) => i.publicId).map((i) => ({ type, role: i.user.role, reference: i.publicId!, title: i.name, subtitle: i.user.email, imageUrl: i.profilePic, isActive: i.user.isActive, href: `${base}/${i.publicId}` }));
  const allResults = [
    ...profileResults('Visitor', '/admin/visitors', visitors), ...profileResults('Officer', '/admin/officers', officers), ...profileResults('Prisoner', '/admin/prisoners', prisoners),
    ...appointments.map((i) => ({ type: 'Appointment', reference: i.reference, title: `${i.visitor.name} → ${i.prisoner.name}`, subtitle: i.status, href: `/admin/appointments?reference=${i.reference}` })),
    ...paroles.map((i) => ({ type: 'Parole', reference: i.reference, title: i.prisoner.name, subtitle: i.status, href: `/admin/parole?reference=${i.reference}` })),
    ...changes.map((i) => ({ type: 'Change request', reference: i.reference, title: i.reference, subtitle: i.status, href: `/admin/appointments?section=change-requests&reference=${i.reference}` })),
    ...passes.map((i) => ({ type: 'Visit pass', reference: i.passCode, title: i.appointment.reference, subtitle: i.status, href: `/admin/appointments?reference=${i.appointment.reference}` })),
    ...firs.map((i) => ({ type: 'FIR', reference: i.reference, title: i.firNumber, subtitle: `${i.prisoner.publicId ?? 'ID unavailable'} · ${i.status}`, href: `/admin/fir-records?reference=${i.reference}` })),
    ...medical.map((i) => ({ type: 'Health record', reference: i.reference, title: i.prisoner.name, subtitle: i.treatmentStatus, href: `/admin/health-records?reference=${i.reference}` })),
    ...visitorSupport.map((i) => ({ type: 'Visitor support', reference: i.reference, title: i.subject, subtitle: i.status, href: `/admin/support-requests?reference=${i.reference}` })),
    ...prisonerSupport.map((i) => ({ type: 'Prisoner support', reference: i.reference, title: i.subject, subtitle: i.status, href: `/admin/prisoner-support-requests?reference=${i.reference}` })),
    ...rules.map((i) => ({ type: 'Jail rule', reference: i.reference, title: i.title, subtitle: i.isActive ? 'Active' : 'Inactive', href: `/admin/jail-rules?reference=${i.reference}` })),
  ];
  const results = allResults.slice((page - 1) * limit, page * limit);
  return { groups: Object.values(results.reduce<Record<string, { type: string; items: typeof results }>>((all, item) => { (all[item.type] ??= { type: item.type, items: [] }).items.push(item); return all; }, {})), pagination: pageInfo(page, limit, allResults.length) };
};

export const listAuditLogs = async (query: { page: number; limit: number; actor?: string; role?: Role; action?: ActionType; entity?: string; result?: AuditResult; reference?: string; from?: Date; to?: Date }) => {
  const where: Prisma.AuditLogWhereInput = {
    ...(query.action ? { action: query.action } : {}), ...(query.entity ? { entity: { contains: query.entity, mode: 'insensitive' } } : {}), ...(query.result ? { result: query.result } : {}), ...(query.reference ? { entityReference: { contains: query.reference, mode: 'insensitive' } } : {}),
    ...(query.from || query.to ? { createdAt: { gte: query.from, lte: query.to } } : {}),
    ...(query.role || query.actor ? { user: { ...(query.role ? { role: query.role } : {}), ...(query.actor ? { OR: [{ email: { contains: query.actor, mode: 'insensitive' } }, { adminProfile: { name: { contains: query.actor, mode: 'insensitive' } } }, { officerProfile: { name: { contains: query.actor, mode: 'insensitive' } } }, { visitorProfile: { name: { contains: query.actor, mode: 'insensitive' } } }, { prisonerProfile: { name: { contains: query.actor, mode: 'insensitive' } } }] } : {}) } } : {}),
  };
  const select = { action: true, entity: true, entityReference: true, result: true, details: true, createdAt: true, user: { select: { email: true, role: true, adminProfile: { select: { name: true } }, officerProfile: { select: { name: true, publicId: true } }, visitorProfile: { select: { name: true, publicId: true } }, prisonerProfile: { select: { name: true, publicId: true } } } } } as const;
  const [items, totalItems] = await prisma.$transaction([prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit, select }), prisma.auditLog.count({ where })]);
  return { items: items.map((i) => ({ action: i.action, entity: i.entity, reference: i.entityReference, result: i.result, summary: i.details, createdAt: i.createdAt.toISOString(), actor: i.user ? actorIdentity(i.user) : null })), pagination: pageInfo(query.page, query.limit, totalItems) };
};

export const getReports = async (from?: Date, to?: Date) => {
  const createdAt = from || to ? { gte: from, lte: to } : undefined;
  const [usersByRole, activeByRole, validVisitors, validOfficers, validPrisoners, missingVisitorProfiles, missingOfficerProfiles, missingPrisonerProfiles, missingVisitorIds, missingOfficerIds, missingPrisonerIds, unassigned, appointmentsByStatus, parolesByStatus, pendingChanges, passes, visitorSupport, prisonerSupport, escalated, firs, medicalAttention, rules, auditCount] = await prisma.$transaction([
    prisma.user.groupBy({ by: ['role'], _count: true }), prisma.user.groupBy({ by: ['role'], where: { isActive: true }, _count: true }), prisma.visitorProfile.count({ where: { user: { role: Role.VISITOR, isActive: true } } }), prisma.officerProfile.count({ where: { user: { role: Role.OFFICER, isActive: true } } }), prisma.prisonerProfile.count({ where: { user: { role: Role.PRISONER, isActive: true } } }), prisma.user.count({ where: { role: Role.VISITOR, visitorProfile: null } }), prisma.user.count({ where: { role: Role.OFFICER, officerProfile: null } }), prisma.user.count({ where: { role: Role.PRISONER, prisonerProfile: null } }), prisma.visitorProfile.count({ where: { publicId: null } }), prisma.officerProfile.count({ where: { publicId: null } }), prisma.prisonerProfile.count({ where: { publicId: null } }), prisma.prisonerProfile.count({ where: { assignedOfficerId: null } }), prisma.appointment.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.paroleRequest.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.appointmentChangeRequest.count({ where: { status: AppointmentChangeRequestStatus.PENDING, ...(createdAt ? { createdAt } : {}) } }), prisma.visitPass.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.supportRequest.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.prisonerSupportRequest.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.prisonerSupportRequest.count({ where: { escalatedAt: { not: null }, ...(createdAt ? { createdAt } : {}) } }), prisma.firRecord.groupBy({ by: ['status'], where: createdAt ? { createdAt } : undefined, _count: true }), prisma.medicalRecord.count({ where: { archivedAt: null, OR: [{ treatmentStatus: MedicalTreatmentStatus.FOLLOW_UP_REQUIRED }, { followUpDate: { lt: new Date() } }] } }), prisma.jailRule.groupBy({ by: ['audience', 'isActive'], _count: true }), prisma.auditLog.count({ where: createdAt ? { createdAt } : undefined }),
  ]);
  const workloadProfiles = await prisma.officerProfile.findMany({ where: { user: { isActive: true, role: Role.OFFICER } }, select: { id: true, publicId: true, name: true, profilePic: true, _count: { select: { assignedPrisoners: true } } }, orderBy: { name: 'asc' } });
  const officerWorkload = await Promise.all(workloadProfiles.map(async (officer) => {
    const scope = { prisoner: { assignedOfficerId: officer.id } };
    const [pendingAppointments, pendingParole, pendingChangeRequests, escalatedSupport] = await prisma.$transaction([
      prisma.appointment.count({ where: { ...scope, status: AppointmentStatus.PENDING } }),
      prisma.paroleRequest.count({ where: { ...scope, status: ParoleStatus.PENDING } }),
      prisma.appointmentChangeRequest.count({ where: { appointment: scope, status: AppointmentChangeRequestStatus.PENDING } }),
      prisma.prisonerSupportRequest.count({ where: { escalatedToOfficerId: officer.id, officerHandledAt: null } }),
    ]);
    return { publicId: officer.publicId, name: officer.name, profilePic: officer.profilePic, assignedPrisoners: officer._count.assignedPrisoners, pendingAppointments, pendingParole, pendingChangeRequests, escalatedSupport };
  }));
  return { range: { from: from?.toISOString() ?? null, to: to?.toISOString() ?? null }, usersByRole, activeByRole, validProfiles: { visitors: validVisitors, officers: validOfficers, prisoners: validPrisoners }, missingProfiles: { visitors: missingVisitorProfiles, officers: missingOfficerProfiles, prisoners: missingPrisonerProfiles }, missingPublicIds: { visitors: missingVisitorIds, officers: missingOfficerIds, prisoners: missingPrisonerIds }, officerWorkload, unassignedPrisoners: unassigned, appointmentsByStatus, parolesByStatus, pendingChangeRequests: pendingChanges, visitPassesByStatus: passes, visitorSupportByStatus: visitorSupport, prisonerSupportByStatus: prisonerSupport, escalatedSupport: escalated, firByStatus: firs, medicalAttention, jailRules: rules, activityEvents: auditCount };
};

export const listFirRecords = async (query: { page: number; limit: number; search?: string; status?: FirStatus; requiresAttention?: boolean }) => {
  const where: Prisma.FirRecordWhereInput = { ...(query.status ? { status: query.status } : {}), ...(query.requiresAttention ? { status: { in: [FirStatus.OPEN, FirStatus.UNDER_REVIEW] } } : {}), ...(query.search ? { OR: [{ reference: { contains: query.search, mode: 'insensitive' } }, { firNumber: { contains: query.search, mode: 'insensitive' } }, { prisoner: { OR: [{ publicId: { contains: query.search, mode: 'insensitive' } }, { name: { contains: query.search, mode: 'insensitive' } }] } }] } : {}) };
  const select = { reference: true, firNumber: true, dateFiled: true, status: true, archivedAt: true, lastChangeReason: true, prisoner: { select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, name: true } } } }, createdByOfficer: { select: { publicId: true, name: true } }, updatedByOfficer: { select: { publicId: true, name: true } } } as const;
  const [items, totalItems] = await prisma.$transaction([prisma.firRecord.findMany({ where, orderBy: { dateFiled: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit, select }), prisma.firRecord.count({ where })]);
  return { items: items.map((i) => ({ ...i, dateFiled: i.dateFiled.toISOString(), archivedAt: i.archivedAt?.toISOString() ?? null, requiresAttention: i.status === FirStatus.OPEN || i.status === FirStatus.UNDER_REVIEW })), pagination: pageInfo(query.page, query.limit, totalItems) };
};

export const getFirRecord = async (reference: string) => {
  const record = await prisma.firRecord.findUnique({ where: { reference }, select: { reference: true, firNumber: true, description: true, dateFiled: true, status: true, lastChangeReason: true, archivedAt: true, archiveReason: true, createdAt: true, updatedAt: true, prisoner: { select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, name: true } } } }, createdByOfficer: { select: { publicId: true, name: true } }, updatedByOfficer: { select: { publicId: true, name: true } } } });
  if (!record) throw new DomainError(404, 'FIR record not found');
  return { ...record, dateFiled: record.dateFiled.toISOString(), archivedAt: record.archivedAt?.toISOString() ?? null, createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString() };
};

export const correctFirRecord = async (userId: string, reference: string, input: { reason: string; status?: FirStatus; firNumber?: string; dateFiled?: Date; archive?: boolean }) => prisma.$transaction(async (tx) => {
  await requirePermanentAdmin(userId, tx);
  const existing = await tx.firRecord.findUnique({ where: { reference }, select: { reference: true } });
  if (!existing) throw new DomainError(404, 'FIR record not found');
  const record = await tx.firRecord.update({ where: { reference }, data: { ...(input.firNumber ? { firNumber: input.firNumber } : {}), ...(input.dateFiled ? { dateFiled: input.dateFiled } : {}), ...(input.status ? { status: input.status } : {}), ...(input.archive ? { status: FirStatus.ARCHIVED, archivedAt: new Date(), archiveReason: input.reason } : {}), lastChangeReason: input.reason }, select: { reference: true, firNumber: true, status: true, dateFiled: true, archivedAt: true } });
  await recordAudit({ userId, action: input.archive ? ActionType.ARCHIVE : ActionType.UPDATE, entity: 'FirRecord', entityReference: reference, result: 'SUCCESS', summary: `Admin ${input.archive ? 'archived' : 'corrected'} FIR operational metadata; reason recorded.` }, tx);
  return { ...record, dateFiled: record.dateFiled.toISOString(), archivedAt: record.archivedAt?.toISOString() ?? null };
});

export const listHealthRecords = async (query: { page: number; limit: number; search?: string; status?: MedicalTreatmentStatus; requiresAttention?: boolean; followUpFrom?: Date; followUpTo?: Date }) => {
  const now = new Date();
  const where: Prisma.MedicalRecordWhereInput = { ...(query.status ? { treatmentStatus: query.status } : {}), ...(query.requiresAttention ? { archivedAt: null, OR: [{ treatmentStatus: MedicalTreatmentStatus.FOLLOW_UP_REQUIRED }, { followUpDate: { lte: now } }] } : {}), ...(query.followUpFrom || query.followUpTo ? { followUpDate: { gte: query.followUpFrom, lte: query.followUpTo } } : {}), ...(query.search ? { OR: [{ reference: { contains: query.search, mode: 'insensitive' } }, { prisoner: { OR: [{ publicId: { contains: query.search, mode: 'insensitive' } }, { name: { contains: query.search, mode: 'insensitive' } }] } }] } : {}) };
  const select = { reference: true, treatmentStatus: true, checkupDate: true, followUpDate: true, archivedAt: true, prisoner: { select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, name: true } } } }, updatedByOfficer: { select: { publicId: true, name: true } } } as const;
  const [items, totalItems] = await prisma.$transaction([prisma.medicalRecord.findMany({ where, orderBy: { followUpDate: 'asc' }, skip: (query.page - 1) * query.limit, take: query.limit, select }), prisma.medicalRecord.count({ where })]);
  return { items: items.map((i) => ({ ...i, checkupDate: i.checkupDate?.toISOString() ?? null, followUpDate: i.followUpDate?.toISOString() ?? null, archivedAt: i.archivedAt?.toISOString() ?? null, requiresAttention: !i.archivedAt && (i.treatmentStatus === MedicalTreatmentStatus.FOLLOW_UP_REQUIRED || Boolean(i.followUpDate && i.followUpDate <= now)) })), pagination: pageInfo(query.page, query.limit, totalItems) };
};

export const getHealthRecord = async (userId: string, reference: string) => {
  const record = await prisma.medicalRecord.findUnique({ where: { reference }, select: { reference: true, bloodGroup: true, allergies: true, checkupDetails: true, checkupDate: true, medicalProfessional: true, diagnosis: true, medication: true, treatmentStatus: true, followUpDate: true, operationalInstructions: true, restrictedNotes: true, archivedAt: true, archiveReason: true, createdAt: true, updatedAt: true, prisoner: { select: { publicId: true, name: true, assignedOfficer: { select: { publicId: true, name: true } } } }, createdByOfficer: { select: { publicId: true, name: true } }, updatedByOfficer: { select: { publicId: true, name: true } } } });
  if (!record) throw new DomainError(404, 'Health record not found');
  await recordAudit({ userId, action: ActionType.VIEW, entity: 'MedicalRecord', entityReference: reference, result: 'RESTRICTED_VIEW', summary: 'Admin opened restricted health-record details.' });
  return { ...record, checkupDate: record.checkupDate?.toISOString() ?? null, followUpDate: record.followUpDate?.toISOString() ?? null, archivedAt: record.archivedAt?.toISOString() ?? null, createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString() };
};

export const correctHealthRecord = async (userId: string, reference: string, input: { reason: string; treatmentStatus?: MedicalTreatmentStatus; followUpDate?: Date | null; medicalProfessional?: string | null; operationalInstructions?: string | null; archive?: boolean }) => prisma.$transaction(async (tx) => {
  await requirePermanentAdmin(userId, tx);
  const existing = await tx.medicalRecord.findUnique({ where: { reference }, select: { reference: true } });
  if (!existing) throw new DomainError(404, 'Health record not found');
  const record = await tx.medicalRecord.update({ where: { reference }, data: { ...(input.treatmentStatus ? { treatmentStatus: input.treatmentStatus } : {}), ...(input.followUpDate !== undefined ? { followUpDate: input.followUpDate } : {}), ...(input.medicalProfessional !== undefined ? { medicalProfessional: input.medicalProfessional } : {}), ...(input.operationalInstructions !== undefined ? { operationalInstructions: input.operationalInstructions } : {}), ...(input.archive ? { treatmentStatus: MedicalTreatmentStatus.ARCHIVED, archivedAt: new Date(), archiveReason: input.reason } : {}) }, select: { reference: true, treatmentStatus: true, followUpDate: true, archivedAt: true } });
  await recordAudit({ userId, action: input.archive ? ActionType.ARCHIVE : ActionType.UPDATE, entity: 'MedicalRecord', entityReference: reference, result: 'SUCCESS', summary: `Admin ${input.archive ? 'archived' : 'corrected'} health-record operational metadata; reason recorded.` }, tx);
  return { ...record, followUpDate: record.followUpDate?.toISOString() ?? null, archivedAt: record.archivedAt?.toISOString() ?? null };
});

type AnnouncementInput = { targetRole: Role.OFFICER | Role.VISITOR | Role.PRISONER; title: string; message: string; priority: 'NORMAL' | 'HIGH'; link?: string; activeFrom?: Date; expiresAt?: Date };
export const previewAnnouncement = async (userId: string, input: AnnouncementInput) => { await requirePermanentAdmin(userId); return { targetRole: input.targetRole, recipientCount: await prisma.user.count({ where: { role: input.targetRole, isActive: true } }), immediatePublication: true, schedulerAvailable: false }; };
export const publishAnnouncement = async (userId: string, input: AnnouncementInput) => prisma.$transaction(async (tx) => {
  await requirePermanentAdmin(userId, tx);
  const now = new Date();
  if (input.activeFrom && input.activeFrom > now) throw new DomainError(422, 'Future scheduling is not available; publish when the active date arrives');
  if (input.expiresAt && input.expiresAt <= now) throw new DomainError(422, 'Expiration must be in the future');
  const reference = createPublicReference('ANN');
  const announcement = await tx.announcement.create({ data: { ...input, reference, activeFrom: input.activeFrom ?? now }, select: { reference: true, targetRole: true, title: true, priority: true, activeFrom: true, expiresAt: true, createdAt: true } });
  const recipients = await tx.user.findMany({ where: { role: input.targetRole, isActive: true }, select: { id: true } });
  const fallback = input.targetRole === Role.OFFICER ? '/officer/dashboard' : input.targetRole === Role.VISITOR ? '/visitor/dashboard' : '/prisoner/dashboard';
  await createNotifications(recipients.map((r) => ({ userId: r.id, type: `ANNOUNCEMENT_${input.priority}`, title: input.title, message: input.message, link: input.link ?? fallback, dedupeKey: `ANNOUNCEMENT:${reference}:${r.id}` })), tx);
  await recordAudit({ userId, action: ActionType.CREATE, entity: 'Announcement', entityReference: reference, result: 'SUCCESS', summary: `Announcement published to ${recipients.length} active ${input.targetRole} accounts.` }, tx);
  return { ...announcement, recipientCount: recipients.length, activeFrom: announcement.activeFrom.toISOString(), expiresAt: announcement.expiresAt?.toISOString() ?? null, createdAt: announcement.createdAt.toISOString() };
});
export const listAnnouncements = async (page: number, limit: number) => { const [items, totalItems] = await prisma.$transaction([prisma.announcement.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, select: { reference: true, targetRole: true, title: true, priority: true, link: true, activeFrom: true, expiresAt: true, createdAt: true } }), prisma.announcement.count()]); const now = new Date(); return { items: items.map((i) => ({ ...i, activeFrom: i.activeFrom.toISOString(), expiresAt: i.expiresAt?.toISOString() ?? null, createdAt: i.createdAt.toISOString(), isVisible: i.activeFrom <= now && (!i.expiresAt || i.expiresAt > now) })), pagination: pageInfo(page, limit, totalItems) }; };

export const securityEvents = async (page: number, limit: number) => {
  const resultValues: AuditResult[] = ['BLOCKED', 'DENIED', 'FORBIDDEN', 'CONFLICT', 'INVALID', 'INVALID_APPOINTMENT', 'EXPIRED', 'REVOKED', 'NOT_FOUND'];
  const where = { OR: [{ result: { in: resultValues } }, { entity: { in: ['SystemIntegrityRepair', 'OfficerMedicalAccess', 'VisitPass'] } }] };
  const [items, totalItems] = await prisma.$transaction([prisma.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, select: { action: true, entity: true, entityReference: true, result: true, details: true, createdAt: true } }), prisma.auditLog.count({ where })]);
  return { items: items.map((i) => ({ ...i, severity: ['BLOCKED', 'DENIED', 'FORBIDDEN', 'INVALID'].includes(i.result ?? '') ? 'HIGH' : 'MEDIUM', createdAt: i.createdAt.toISOString() })), pagination: pageInfo(page, limit, totalItems) };
};
