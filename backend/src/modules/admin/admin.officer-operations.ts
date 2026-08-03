import { ActionType, MedicalAccessLevel, PrisonerSupportCategory, Role } from '@prisma/client';
import { Request, Response } from 'express';

import prisma from '../../config/prisma';
import { DomainError } from '../../utils/domain-error';
import { getPermanentAdminProfile } from '../../utils/permanent-admin';
import { recordAudit } from '../audit';
import { createNotification, createNotifications } from '../notifications';

const handle = (error: unknown, res: Response) => {
  if (error instanceof DomainError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  console.error('[AdminOfficerOperations]', error);
  res.status(500).json({ success: false, message: 'The Admin operation could not be completed' });
};

export const assignPrisoner = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(req.user!.id, tx))) throw new DomainError(403, 'Permanent Admin access required');
      const prisoner = await tx.prisonerProfile.findUnique({ where: { publicId: req.params.prisonerPublicId }, select: { id: true, publicId: true, name: true, assignedOfficerId: true, assignedOfficer: { select: { userId: true, publicId: true } } } });
      if (!prisoner) throw new DomainError(404, 'Prisoner not found');
      const officer = req.body.officerPublicId ? await tx.officerProfile.findFirst({ where: { publicId: req.body.officerPublicId, user: { role: Role.OFFICER, isActive: true } }, select: { id: true, userId: true, publicId: true, name: true } }) : null;
      if (req.body.officerPublicId && !officer) throw new DomainError(409, 'Selected Officer is not active and eligible');
      if (prisoner.assignedOfficerId === officer?.id || (!prisoner.assignedOfficerId && !officer)) throw new DomainError(409, 'Assignment is already current');
      await tx.prisonerProfile.update({ where: { id: prisoner.id }, data: { assignedOfficerId: officer?.id ?? null } });
      if (officer) await createNotification({ userId: officer.userId, type: 'PRISONER_ASSIGNED', title: 'Prisoner assigned', message: `${prisoner.name} (${prisoner.publicId}) was assigned to you.`, link: `/officer/prisoners/${prisoner.publicId}`, dedupeKey: `PRISONER_ASSIGNED:${prisoner.publicId}:${officer.publicId}` }, tx);
      if (prisoner.assignedOfficer) await createNotification({ userId: prisoner.assignedOfficer.userId, type: 'PRISONER_REASSIGNED', title: 'Prisoner assignment changed', message: `${prisoner.name} (${prisoner.publicId}) is no longer assigned to you.`, link: '/officer/prisoners', dedupeKey: `PRISONER_REASSIGNED:${prisoner.publicId}:${prisoner.assignedOfficer.publicId}:${officer?.publicId ?? 'UNASSIGNED'}` }, tx);
      if (!officer) await createNotification({ userId: req.user!.id, type: 'PRISONER_UNASSIGNED', title: 'Prisoner is unassigned', message: `${prisoner.name} (${prisoner.publicId}) now requires an Officer assignment.`, link: '/admin/officer-operations', dedupeKey: `PRISONER_UNASSIGNED:${prisoner.publicId}:${Date.now()}` }, tx);
      await recordAudit({ userId: req.user!.id, action: ActionType.ASSIGN, entity: 'PrisonerProfile', entityReference: prisoner.publicId, result: officer ? 'ASSIGNED' : 'UNASSIGNED', summary: `${officer ? `Assigned to Officer ${officer.publicId}` : 'Officer assignment removed'}; reason recorded.` }, tx);
      return { prisoner: { publicId: prisoner.publicId, name: prisoner.name }, assignedOfficer: officer ? { publicId: officer.publicId, name: officer.name } : null };
    });
    res.status(200).json({ success: true, message: 'Prisoner assignment updated', data: result });
  } catch (error) { handle(error, res); }
};

export const setMedicalAccess = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const item = await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(req.user!.id, tx))) throw new DomainError(403, 'Permanent Admin access required');
      const profile = await tx.officerProfile.findFirst({ where: { publicId: req.params.officerPublicId, user: { role: Role.OFFICER, isActive: true } }, select: { id: true, publicId: true, name: true, medicalAccessLevel: true } });
      if (!profile) throw new DomainError(409, 'Selected Officer is not active and eligible');
      if (profile.medicalAccessLevel === req.body.medicalAccessLevel) throw new DomainError(409, 'Medical access is already current');
      const updated = await tx.officerProfile.update({ where: { id: profile.id }, data: { medicalAccessLevel: req.body.medicalAccessLevel as MedicalAccessLevel }, select: { publicId: true, name: true, medicalAccessLevel: true } });
      await recordAudit({ userId: req.user!.id, action: ActionType.UPDATE, entity: 'OfficerMedicalAccess', entityReference: updated.publicId, result: 'SUCCESS', summary: `Medical access changed to ${updated.medicalAccessLevel}; reason recorded.` }, tx);
      return updated;
    });
    res.status(200).json({ success: true, message: 'Medical access updated', data: item });
  } catch (error) { handle(error, res); }
};

export const announceOfficers = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    const result = await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(req.user!.id, tx))) throw new DomainError(403, 'Permanent Admin access required');
      const officers = await tx.user.findMany({ where: { role: Role.OFFICER, isActive: true }, select: { id: true } });
      const key = `OFFICER_ANNOUNCEMENT:${Date.now()}`;
      const created = await createNotifications(officers.map((officer) => ({ userId: officer.id, type: `OFFICER_ANNOUNCEMENT_${req.body.priority}`, title: req.body.title, message: req.body.message, link: req.body.link ?? '/officer/dashboard', dedupeKey: `${key}:${officer.id}` })), tx);
      await recordAudit({ userId: req.user!.id, action: ActionType.CREATE, entity: 'OfficerAnnouncement', entityReference: key, result: 'SUCCESS', summary: `Announcement sent to ${created.count} active Officers.` }, tx);
      return created;
    });
    res.status(201).json({ success: true, message: 'Officer announcement published', data: { recipientCount: result.count } });
  } catch (error) { handle(error, res); }
};

export const escalateSupport = async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try {
    await prisma.$transaction(async (tx) => {
      if (!(await getPermanentAdminProfile(req.user!.id, tx))) throw new DomainError(403, 'Permanent Admin access required');
      const officer = await tx.officerProfile.findFirst({ where: { publicId: req.body.officerPublicId, user: { role: Role.OFFICER, isActive: true } }, select: { id: true, userId: true, publicId: true, medicalAccessLevel: true } });
      if (!officer) throw new DomainError(409, 'Selected Officer is not active and eligible');
      const request = await tx.prisonerSupportRequest.findUnique({ where: { reference: req.params.requestId }, select: { reference: true, category: true, prisoner: { select: { publicId: true, assignedOfficerId: true } } } });
      if (!request) throw new DomainError(404, 'Support request not found');
      if (request.prisoner.assignedOfficerId !== officer.id) throw new DomainError(409, 'Support can be escalated only to the assigned Officer');
      if (request.category === PrisonerSupportCategory.MEDICAL_ASSISTANCE && officer.medicalAccessLevel === MedicalAccessLevel.NONE) throw new DomainError(403, 'Medical access is required for this escalation');
      await tx.prisonerSupportRequest.update({ where: { reference: request.reference }, data: { escalatedToOfficerId: officer.id, escalatedAt: new Date(), officerHandledAt: null } });
      await createNotification({ userId: officer.userId, type: 'SUPPORT_ESCALATED', title: 'Support action assigned', message: `An operational support action for ${request.prisoner.publicId ?? 'ID unavailable'} requires attention.`, link: '/officer/support-escalations', dedupeKey: `SUPPORT_ESCALATED:${request.reference}:${officer.publicId}` }, tx);
      await recordAudit({ userId: req.user!.id, action: ActionType.ESCALATE, entity: 'PrisonerSupportRequest', entityReference: request.reference, result: 'SUCCESS', summary: `Escalated to Officer ${officer.publicId}.` }, tx);
    });
    res.status(200).json({ success: true, message: 'Support request escalated' });
  } catch (error) { handle(error, res); }
};
