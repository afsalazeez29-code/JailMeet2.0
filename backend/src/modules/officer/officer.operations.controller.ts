import { Request, Response } from 'express';
import * as service from './officer.service';

const run = (handler: (userId: string) => Promise<unknown>, success: string) => async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try { res.status(200).json({ success: true, message: success, data: await handler(req.user.id) }); }
  catch (error) { if (error instanceof service.OfficerOperationsError) return void res.status(error.statusCode).json({ success: false, message: error.message }); console.error('[OfficerOperations]', error); res.status(500).json({ success: false, message: 'Officer operation failed' }); }
};

export const profile = run((u) => service.getOfficerProfile(u), 'Officer profile fetched');

// Named handlers keep request-derived inputs explicit and make route review straightforward.
const withInputs = (handler: (req: Request, res: Response, userId: string) => Promise<unknown>, message: string, created = false) => async (req: Request, res: Response) => {
  if (!req.user) return void res.status(401).json({ success: false, message: 'Authentication required' });
  try { res.status(created ? 201 : 200).json({ success: true, message, data: await handler(req, res, req.user.id) }); }
  catch (error) { if (error instanceof service.OfficerOperationsError) return void res.status(error.statusCode).json({ success: false, message: error.message }); console.error('[OfficerOperations]', error); res.status(500).json({ success: false, message: 'Officer operation failed' }); }
};

export const listPrisoners = withInputs((_q, r, u) => service.listAssignedPrisoners(u, r.locals.validatedQuery), 'Assigned prisoners fetched');
export const prisonerDetail = withInputs((q, _r, u) => service.getAssignedPrisoner(u, q.params.publicId), 'Assigned prisoner fetched');
export const listFir = withInputs((_q, r, u) => service.listFirRecords(u, r.locals.validatedQuery), 'FIR records fetched');
export const firDetail = withInputs((q, _r, u) => service.getFirRecord(u, q.params.recordReference), 'FIR record fetched');
export const createFir = withInputs((q, _r, u) => service.createFirRecord(u, q.params.publicId, q.body), 'FIR record created', true);
export const updateFir = withInputs((q, _r, u) => service.updateFirRecord(u, q.params.recordReference, q.body), 'FIR record updated');
export const archiveFir = withInputs((q, _r, u) => service.archiveFirRecord(u, q.params.recordReference, q.body.reason), 'FIR record archived');
export const firHistory = withInputs((q, _r, u) => service.getFirHistory(u, q.params.recordReference), 'FIR history fetched');
export const listHealth = withInputs((_q, r, u) => service.listHealthRecords(u, r.locals.validatedQuery), 'Health records fetched');
export const healthSummary = withInputs((q, _r, u) => service.getHealthSummary(u, q.params.publicId), 'Health summary fetched');
export const healthDetail = withInputs((q, _r, u) => service.getHealthRecord(u, q.params.recordReference), 'Health record fetched');
export const createHealth = withInputs((q, _r, u) => service.createHealthRecord(u, q.params.publicId, q.body), 'Health record created', true);
export const updateHealth = withInputs((q, _r, u) => service.updateHealthRecord(u, q.params.recordReference, q.body), 'Health record updated');
export const archiveHealth = withInputs((q, _r, u) => service.archiveHealthRecord(u, q.params.recordReference, q.body.reason), 'Health record archived');
export const search = withInputs((_q, r, u) => service.officerSearch(u, r.locals.validatedQuery.q, r.locals.validatedQuery.limit), 'Search results fetched');
export const activity = withInputs((_q, r, u) => service.officerActivity(u, r.locals.validatedQuery), 'Officer activity fetched');
export const support = withInputs((_q, _r, u) => service.listEscalatedSupport(u), 'Escalated support fetched');
export const supportResponse = withInputs((q, _r, u) => service.respondEscalatedSupport(u, q.params.requestId, q.body), 'Officer response saved');
export const reports = withInputs((_q, r, u) => service.officerReports(u, r.locals.validatedQuery), 'Officer reports fetched');
